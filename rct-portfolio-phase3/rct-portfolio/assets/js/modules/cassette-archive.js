/* Cassette archive: loads one project ("tape") at a time into a tape deck.
 *
 * Deck states (deck[data-state]):  empty -> inserting -> playing -> ejecting -> inserting ...
 * Content (the .tape-card articles) is rendered by PHP from config/portfolio.php; this file only shows/hides it,
 * so adding a project never needs a JavaScript change.
 * A "token" makes every load cancel the one before it, so rapid clicks or closing mid-animation never leave stale state.
 */

import * as settings from '../core/settings.js';

const INSERT_MS = 900;
const EJECT_MS = 420;
const pad = (n) => String(n).padStart(2, '0');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function initCassetteArchive(manager, panel) {
    if (!panel) return;

    const deck = panel.querySelector('[data-deck]');
    const cards = [...panel.querySelectorAll('[data-tape-card]')];
    const tracks = [...panel.querySelectorAll('[data-deck-track]')];
    const titleEl = panel.querySelector('[data-cassette-title]');
    const numberEl = panel.querySelector('[data-cassette-number]');
    const indexEl = panel.querySelector('[data-deck-index]');
    const statusEl = panel.querySelector('[data-deck-status]');
    const announceEl = panel.querySelector('[data-deck-announce]');
    const scroller = panel.querySelector('.panel__body');
    const total = cards.length;

    let current = -1;
    let token = 0;

    const reduced = () => settings.get('reduceMotion');

    function setState(state, label) {
        deck.dataset.state = state;
        statusEl.textContent = label;
    }

    function showCard(index) {
        cards.forEach((card, i) => { card.hidden = i !== index; });
        tracks.forEach((button, i) => {
            if (i === index) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
        });
    }

    async function load(index) {
        index = ((index % total) + total) % total;       /* wrap around */
        const mine = ++token;
        const hadTape = current !== -1;
        current = index;

        const card = cards[index];
        const skip = reduced();

        /* Eject the tape that is in the deck, content goes away with it */
        if (hadTape && !skip) {
            setState('ejecting', 'EJECT');
            cards.forEach((c) => { c.hidden = true; });
            await wait(EJECT_MS);
            if (mine !== token) return;
        }

        /* Swap the label, then slide the new tape in */
        titleEl.textContent = card.dataset.title;
        numberEl.textContent = pad(index + 1);
        indexEl.textContent = pad(index + 1);
        tracks.forEach((button, i) => {
            if (i === index) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
        });

        if (!skip) {
            setState('inserting', 'LOADING');
            await wait(INSERT_MS);
            if (mine !== token) return;
        }

        setState('playing', 'PLAY');
        showCard(index);
        card.classList.remove('is-entering');
        void card.offsetWidth;                            /* restart the entrance animation */
        card.classList.add('is-entering');
        scroller.scrollTop = 0;
        announceEl.textContent = `Tape ${index + 1} of ${total} loaded: ${card.dataset.title}`;
    }

    function reset() {
        token += 1;                                       /* cancels any animation still waiting */
        current = -1;
        cards.forEach((card) => { card.hidden = true; card.classList.remove('is-entering'); });
        tracks.forEach((button) => button.removeAttribute('aria-current'));
        setState('empty', 'EMPTY');
        indexEl.textContent = '--';
        titleEl.textContent = '';
        numberEl.textContent = '';
        announceEl.textContent = '';
    }

    /* ---- controls ---- */
    panel.querySelector('[data-deck-prev]').addEventListener('click', () => load(current - 1));
    panel.querySelector('[data-deck-next]').addEventListener('click', () => load(current + 1));
    tracks.forEach((button) => button.addEventListener('click', () => {
        const index = Number(button.dataset.deckTrack);
        if (index !== current) load(index);
    }));

    /* Preview thumbnails swap the main image of their own card */
    panel.addEventListener('click', (event) => {
        const thumb = event.target.closest('[data-preview-thumb]');
        if (!thumb) return;
        const card = thumb.closest('.tape-card');
        const main = card.querySelector('[data-preview-main]');
        main.src = thumb.dataset.src;
        main.alt = thumb.dataset.alt;
        card.querySelectorAll('[data-preview-thumb]').forEach((other) => other.setAttribute('aria-pressed', String(other === thumb)));
    });

    manager.register('cassette', {
        open(detail) {
            reset();
            const slot = Number(detail?.slot);
            load(Number.isInteger(slot) && slot >= 0 ? slot : 0);
        },
        close: reset,
    });
}
