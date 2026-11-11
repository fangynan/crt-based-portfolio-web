/* Doodle Pad: freehand drawing on a canvas with mouse, pen or touch (Pointer Events cover all three).
 *
 *   - Brush with adjustable size, colour swatches + a free colour picker, eraser, undo, clear, PNG download.
 *   - The canvas is filled with paper colour (never transparent), and the eraser paints paper colour, so the
 *     downloaded PNG looks exactly like the screen.
 *   - Each stroke is smoothed with quadratic curves between midpoints.
 *   - Brush size is in on-screen CSS pixels, so a "6" feels the same on a phone and a desktop.
 *   - Strokes are captured on the canvas with setPointerCapture and touch-action: none (CSS), so drawing never
 *     scrolls the page and releasing the pointer outside the canvas still ends the stroke.
 */

const WIDTH = 960;
const HEIGHT = 640;                    /* 3:2, matches aspect-ratio in arcade.css */
const PAPER = '#fffdf6';
const MAX_UNDO = 5;

export function createDoodle(root) {
    const canvas = root.querySelector('[data-doodle-canvas]');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const toolButtons = [...root.querySelectorAll('[data-doodle-tool]')];
    const swatches = [...root.querySelectorAll('[data-doodle-swatch]')];
    const colorInput = root.querySelector('[data-doodle-color]');
    const sizeInput = root.querySelector('[data-doodle-size]');
    const sizeOutput = root.querySelector('[data-doodle-size-output]');
    const undoButton = root.querySelector('[data-doodle-undo]');
    const clearButton = root.querySelector('[data-doodle-clear]');
    const downloadButton = root.querySelector('[data-doodle-download]');
    const announceEl = root.querySelector('[data-doodle-announce]');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let tool = 'brush';                /* brush | eraser */
    let color = colorInput.value;
    let size = Number(sizeInput.value);
    const undoStack = [];
    let stroke = null;                 /* { id, last, lastMid, width } while drawing */

    function paintPaper() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    const announce = (text) => { announceEl.textContent = text; };

    /* ---- undo ---- */

    function snapshot() {
        undoStack.push(ctx.getImageData(0, 0, WIDTH, HEIGHT));
        if (undoStack.length > MAX_UNDO) undoStack.shift();
        syncUndo();
    }
    function syncUndo() { undoButton.setAttribute('aria-disabled', String(undoStack.length === 0)); }
    function undo() {
        const previous = undoStack.pop();
        if (!previous) return;
        ctx.putImageData(previous, 0, 0);
        syncUndo();
        announce('Undid last change');
    }

    /* ---- toolbar state ---- */

    function syncTools() {
        toolButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.doodleTool === tool)));
        swatches.forEach((b) => b.setAttribute('aria-pressed', String(tool === 'brush' && b.dataset.doodleSwatch.toLowerCase() === color.toLowerCase())));
        canvas.dataset.tool = tool;
        sizeOutput.textContent = `${size} px`;
        sizeInput.setAttribute('aria-valuetext', `${size} pixels`);
    }

    function pickColor(value) {
        color = value;
        tool = 'brush';                /* choosing a colour always means "draw with it" */
        colorInput.value = value;
        syncTools();
    }

    toolButtons.forEach((b) => b.addEventListener('click', () => { tool = b.dataset.doodleTool; syncTools(); }));
    swatches.forEach((b) => b.addEventListener('click', () => pickColor(b.dataset.doodleSwatch)));
    colorInput.addEventListener('input', () => pickColor(colorInput.value));
    sizeInput.addEventListener('input', () => { size = Number(sizeInput.value); syncTools(); });
    undoButton.addEventListener('click', undo);

    clearButton.addEventListener('click', () => {
        snapshot();
        paintPaper();
        announce('Canvas cleared. Undo is available.');
    });

    downloadButton.addEventListener('click', () => {
        const name = `doodle-${new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')}.png`;
        const save = (href, revoke) => {
            const link = document.createElement('a');
            link.href = href;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            if (revoke) setTimeout(() => URL.revokeObjectURL(href), 1000);
        };
        if (canvas.toBlob) {
            canvas.toBlob((blob) => {
                if (blob) save(URL.createObjectURL(blob), true); else save(canvas.toDataURL('image/png'), false);
            }, 'image/png');
        } else {
            save(canvas.toDataURL('image/png'), false);
        }
        announce(`Saving ${name}`);
    });

    /* ---- drawing ---- */

    function pointFrom(event, rect) {
        return {
            x: (event.clientX - rect.left) * (WIDTH / rect.width),
            y: (event.clientY - rect.top) * (HEIGHT / rect.height),
        };
    }

    function styleStroke(width) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = tool === 'eraser' ? PAPER : color;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function lineTo(point) {
        const mid = { x: (stroke.last.x + point.x) / 2, y: (stroke.last.y + point.y) / 2 };
        ctx.beginPath();
        ctx.moveTo(stroke.lastMid.x, stroke.lastMid.y);
        ctx.quadraticCurveTo(stroke.last.x, stroke.last.y, mid.x, mid.y);
        ctx.stroke();
        stroke.last = point;
        stroke.lastMid = mid;
    }

    canvas.addEventListener('pointerdown', (event) => {
        if (stroke || (event.pointerType === 'mouse' && event.button !== 0)) return;
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const width = size * (WIDTH / rect.width);
        const start = pointFrom(event, rect);

        snapshot();
        canvas.setPointerCapture?.(event.pointerId);
        styleStroke(width);
        ctx.beginPath();                                   /* a single tap leaves a dot */
        ctx.arc(start.x, start.y, width / 2, 0, Math.PI * 2);
        ctx.fill();
        stroke = { id: event.pointerId, last: start, lastMid: start, rect, width };
    });

    canvas.addEventListener('pointermove', (event) => {
        if (!stroke || event.pointerId !== stroke.id) return;
        event.preventDefault();
        styleStroke(stroke.width);
        const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [];
        (events.length ? events : [event]).forEach((e) => lineTo(pointFrom(e, stroke.rect)));
    });

    function endStroke(event) {
        if (!stroke || event.pointerId !== stroke.id) return;
        styleStroke(stroke.width);
        ctx.beginPath();                                   /* finish the last half-segment */
        ctx.moveTo(stroke.lastMid.x, stroke.lastMid.y);
        ctx.lineTo(stroke.last.x, stroke.last.y);
        ctx.stroke();
        stroke = null;
    }
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());

    paintPaper();
    syncTools();
    syncUndo();

    return {
        enter() { /* the drawing is kept while the arcade stays open, like a real sketchbook */ },
        leave() { stroke = null; },
    };
}
