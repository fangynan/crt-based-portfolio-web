/* Printer panel (fax-machine look): idle -> printing (~3 s, the paper grows out of the slot) -> done (PDF download unlocked).
 *
 * The print job lives at module level, NOT inside the panel, so closing the panel mid-print lets the job finish
 * and re-opening shows the right state. A second click while printing is ignored (aria-disabled, not `disabled`,
 * so keyboard focus is never lost).
 * Progress is time-based (performance.now), so it stays correct even if the tab is throttled.
 */

import * as settings from '../core/settings.js';

export function initPrinter(manager, panel) {
    if (!panel) return;

    const unit = panel.querySelector('.fax');
    const feed = panel.querySelector('[data-printer-feed]');
    const printButton = panel.querySelector('[data-printer-print]');
    const printLabel = panel.querySelector('[data-printer-print-label]');
    const download = panel.querySelector('[data-printer-download]');
    const statusEl = panel.querySelector('[data-printer-status]');
    const bar = panel.querySelector('[data-printer-progress]');
    const barFill = bar.querySelector('span');
    const duration = Number(panel.dataset.duration) || 3000;

    let state = panel.dataset.state;      /* idle | printing | done | missing */
    let frame = 0;

    const reduced = () => settings.get('reduceMotion');

    function render(progress) {
        /* With reduced motion the paper advances in 5 steps instead of sliding continuously. */
        const shown = reduced() ? Math.floor(progress * 5) / 5 : progress;
        unit.style.setProperty('--print-progress', shown.toFixed(3));
        const percent = Math.round(progress * 100);
        barFill.style.width = `${percent}%`;
        bar.setAttribute('aria-valuenow', String(percent));
    }

    function setStatus(text) { statusEl.textContent = text; }

    function setState(next) {
        state = next;
        panel.dataset.state = next;
        printButton.setAttribute('aria-disabled', String(next === 'printing' || next === 'missing'));
        printButton.classList.toggle('is-busy', next === 'printing');
        printLabel.textContent = next === 'printing' ? 'Printing…' : next === 'done' ? 'Print again' : 'Print';

        /* The printed sheet becomes a keyboard-scrollable region once it has finished coming out. */
        if (next === 'done') feed.setAttribute('tabindex', '0'); else feed.removeAttribute('tabindex');

        const ready = next === 'done';
        if (download) {
            download.classList.toggle('is-disabled', !ready);
            download.setAttribute('aria-disabled', String(!ready));
            if (ready) download.removeAttribute('tabindex'); else download.setAttribute('tabindex', '-1');
        }
    }

    function start() {
        if (state === 'printing' || state === 'missing') return;   /* the guard against repeated clicks */
        setState('printing');
        unit.classList.add('is-resetting');                        /* snap a previous page back inside without animating */
        render(0);
        feed.scrollTop = 0;
        void unit.offsetWidth;
        unit.classList.remove('is-resetting');

        const began = performance.now();
        const tick = (now) => {
            const progress = Math.min(1, (now - began) / duration);
            render(progress);
            if (progress < 0.12) setStatus('Warming up…');
            else if (progress < 1) setStatus(`Printing page 1 of 1… ${Math.floor(progress * 20) * 5}%`);   /* 5% steps: gentler for screen readers */
            if (progress < 1) { frame = requestAnimationFrame(tick); return; }
            finish();
        };
        frame = requestAnimationFrame(tick);
    }

    function finish() {
        cancelAnimationFrame(frame);
        render(1);
        setState('done');
        setStatus("Print complete.");
    }

    printButton.addEventListener('click', start);
    if (download) {
        download.addEventListener('click', (event) => { if (state !== 'done') event.preventDefault(); });
    }

    manager.register('printer', {
        open() { printButton.setAttribute('aria-disabled', String(state === 'printing' || state === 'missing')); },
    });

    setState(state);
}
