/* Live clock. Ticks on the second boundary, only while started (the desktop starts it on open
 * and stops it on shutdown). Writes text into the elements it is given; knows nothing else. */

const TIME_FORMAT = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
const DATE_FULL   = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
const DATE_SHORT  = { weekday: 'short', month: 'short', day: 'numeric' };

export function createClock({ timeEl, dateFullEl, dateShortEl }) {
    const time = new Intl.DateTimeFormat(undefined, TIME_FORMAT);
    const dateFull = new Intl.DateTimeFormat(undefined, DATE_FULL);
    const dateShort = new Intl.DateTimeFormat(undefined, DATE_SHORT);
    let timer = null;

    function render() {
        const now = new Date();
        timeEl.textContent = time.format(now);
        dateFullEl.textContent = dateFull.format(now);
        dateShortEl.textContent = dateShort.format(now);
    }

    function tick() {
        render();
        timer = setTimeout(tick, 1000 - (Date.now() % 1000));   /* stay aligned to the real second */
    }

    return {
        start() { if (timer === null) tick(); },
        stop()  { clearTimeout(timer); timer = null; },
    };
}
