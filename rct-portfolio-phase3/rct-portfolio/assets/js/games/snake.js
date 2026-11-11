/* Snake view: canvas drawing, timer, keyboard / swipe / on-screen pad. The rules live in snake-engine.js.
 *
 * Performance + "no modern effects" rules this file follows:
 *   - ONE fixed-interval timer (TICK_MS). No requestAnimationFrame loop, no interpolation: the snake jumps one
 *     whole cell per tick, and the canvas is redrawn only when a tick (or a state change) happens.
 *   - The canvas is 20 x 15 cells at 16 px (320 x 240) and is scaled by CSS with `image-rendering: pixelated`.
 *   - The timer exists only while the game is running and visible: it stops on pause, game over, leaving the
 *     game, closing the arcade and when the browser tab is hidden.
 *   - Keyboard input is handled via onKeydown(), which the arcade only calls while this game is on screen and
 *     focus is inside the arcade panel, so arrow keys never affect the rest of the site.
 */

import { createGame, queueTurn, step } from './snake-engine.js';

const COLS = 20;
const ROWS = 15;
const CELL = 16;
const TICK_MS = 130;                   /* fixed movement interval; the one number to change for a faster/slower game */
const SWIPE_PX = 24;
const BEST_KEY = 'rct-portfolio:snake-best:v1';

/* Nokia-style two-tone LCD */
const LCD_BG = '#a9b98f';
const LCD_INK = '#27301d';

const KEY_TO_DIRECTION = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right',
};

function readBest() {
    try { return Math.max(0, parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0); } catch { return 0; }
}
function writeBest(value) {
    try { localStorage.setItem(BEST_KEY, String(value)); } catch { /* storage blocked: best score lasts this visit only */ }
}

export function createSnake(root) {
    const canvas = root.querySelector('[data-snake-canvas]');
    const ctx = canvas.getContext('2d', { alpha: false });
    const scoreEl = root.querySelector('[data-snake-score]');
    const bestEl = root.querySelector('[data-snake-best]');
    const overlayEl = root.querySelector('[data-snake-overlay]');
    const announceEl = root.querySelector('[data-snake-announce]');
    const primaryButton = root.querySelector('[data-snake-primary]');
    const restartButton = root.querySelector('[data-snake-restart]');
    const padButtons = [...root.querySelectorAll('[data-snake-dir]')];

    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;

    let game = null;
    let status = 'ready';              /* ready | running | paused | over | won */
    let timer = 0;
    let best = readBest();
    let swipe = null;                  /* { id, x, y } while a finger / mouse is down on the board */

    /* ---- drawing ---- */

    function drawCell(cell) {
        ctx.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
    }

    function render() {
        ctx.fillStyle = LCD_BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = LCD_INK;
        for (let i = 0; i < game.snake.length; i++) drawCell(game.snake[i]);
        if (game.food) {                                   /* hollow square so food never looks like a body segment */
            const { x, y } = game.food;
            ctx.fillRect(x * CELL + 3, y * CELL + 3, CELL - 6, CELL - 6);
            ctx.fillStyle = LCD_BG;
            ctx.fillRect(x * CELL + 6, y * CELL + 6, CELL - 12, CELL - 12);
            ctx.fillStyle = LCD_INK;
        }
    }

    function updateUi() {
        scoreEl.textContent = game.score;
        bestEl.textContent = best;
        root.dataset.state = status;

        const messages = {
            ready: 'Press an arrow key,\nswipe, or tap Start',
            paused: 'Paused',
            over: `Game over\nScore ${game.score}`,
            won: `You filled the grid!\nScore ${game.score}`,
        };
        const message = messages[status] || '';
        overlayEl.textContent = message;
        overlayEl.hidden = message === '';

        primaryButton.textContent = { ready: 'Start', running: 'Pause', paused: 'Resume', over: 'Play again', won: 'Play again' }[status];
    }

    function announce(text) { announceEl.textContent = text; }

    /* ---- game flow ---- */

    function stopTimer() {
        clearInterval(timer);
        timer = 0;
    }

    function reset() {
        stopTimer();
        game = createGame(COLS, ROWS);
        status = 'ready';
        render();
        updateUi();
    }

    function run() {
        if (status !== 'ready' && status !== 'paused') return;
        status = 'running';
        stopTimer();
        timer = setInterval(tick, TICK_MS);
        updateUi();
        announce(game.score === 0 && game.snake.length === 3 ? 'Game started' : 'Resumed');
    }

    function pause() {
        if (status !== 'running') return;
        stopTimer();
        status = 'paused';
        updateUi();
        announce('Paused');
    }

    function finish(result) {
        stopTimer();
        status = result === 'won' ? 'won' : 'over';
        if (game.score > best) { best = game.score; writeBest(best); }
        render();
        updateUi();
        announce(`${result === 'won' ? 'You filled the grid' : 'Game over'}. Score ${game.score}.`);
    }

    function tick() {
        const result = step(game);
        render();
        if (result === 'dead' || result === 'won') { finish(result); return; }
        if (result === 'ate') scoreEl.textContent = game.score;
    }

    /* ---- input ---- */

    function turn(direction) {
        if (status === 'over' || status === 'won') return;
        queueTurn(game, direction);
        if (status === 'ready' || status === 'paused') run();      /* the first arrow press starts / resumes */
    }

    function onPrimary() {
        if (status === 'ready' || status === 'paused') run();
        else if (status === 'running') pause();
        else { reset(); run(); }
    }

    function onKeydown(event) {
        if (event.ctrlKey || event.metaKey || event.altKey) return false;
        const direction = KEY_TO_DIRECTION[event.key];
        if (direction) {
            event.preventDefault();                                /* arrow keys must not scroll the panel */
            turn(direction);
            return true;
        }
        if ((event.key === 'p' || event.key === 'P') && !event.repeat) {
            event.preventDefault();
            if (status === 'running') pause(); else if (status === 'paused') run();
            return true;
        }
        return false;
    }

    primaryButton.addEventListener('click', onPrimary);
    restartButton.addEventListener('click', () => { reset(); announce('Board reset'); });

    /* On-screen pad: act on pointerdown for instant response on touch; keep click for keyboard activation
     * (detail === 0 means the click came from Enter/Space, not from a pointer, so it is never double-counted). */
    padButtons.forEach((button) => {
        const direction = button.dataset.snakeDir;
        button.addEventListener('pointerdown', (event) => { event.preventDefault(); turn(direction); });
        button.addEventListener('click', (event) => { if (event.detail === 0) turn(direction); });
    });

    /* Swipe on the board. touch-action: none (CSS) stops the page scrolling while a finger is on it. */
    canvas.addEventListener('pointerdown', (event) => {
        swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
        canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
        if (!swipe || event.pointerId !== swipe.id) return;
        const dx = event.clientX - swipe.x;
        const dy = event.clientY - swipe.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return;
        turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        swipe.x = event.clientX;                                   /* re-anchor so a long swipe can chain turns */
        swipe.y = event.clientY;
    });
    const endSwipe = (event) => { if (swipe && event.pointerId === swipe.id) swipe = null; };
    canvas.addEventListener('pointerup', endSwipe);
    canvas.addEventListener('pointercancel', endSwipe);

    const onVisibility = () => { if (document.hidden) pause(); };

    reset();
    return {
        enter() {
            reset();
            document.addEventListener('visibilitychange', onVisibility);
        },
        leave() {
            stopTimer();
            if (status === 'running') status = 'paused';
            swipe = null;
            document.removeEventListener('visibilitychange', onVisibility);
        },
        onKeydown,
    };
}
