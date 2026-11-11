/* Renders power state onto the TV and monitor, and routes screen clicks.
 * The screen hit-area is a real <button> that is `disabled` while OFF, so it cannot be
 * clicked or focused until powered on. */

import { subscribe, isOn } from '../core/power-state.js';

const LABELS = {
    tv: { on: 'Television, on. Open Gungjeon Unlimited in a new tab', off: 'Television, off' },
    computer: { on: 'Computer, on. Open desktop', off: 'Computer, off' },
};

const OFF_MS = 240;   /* must match crt-off duration in states.css */
const CLASSES = ['is-powering-on', 'is-powering-off', 'is-static-in'];

const rendered = {};  /* last state drawn per device, so unchanged devices are never re-animated */
const timers = {};    /* pending swap-to-static per device (cancelled if power flips again) */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function restart(screen, className) {
    screen.classList.remove(...CLASSES);
    void screen.offsetWidth;                       /* restart the CSS animation */
    if (className) screen.classList.add(className);
}

/* Clear one-shot animation classes when they finish so no stale state is left on the element.
 * (is-powering-off is NOT cleared here: it holds the collapsed frame until the swap timer runs.) */
function watchAnimations(screen) {
    screen.addEventListener('animationend', (event) => {
        if (event.target !== screen) return;
        screen.classList.remove('is-powering-on', 'is-static-in');
    });
}

function setSrc(screen, src) {
    if (screen.getAttribute('src') !== src) screen.setAttribute('src', src);
}

function renderInteractivity(device, element, on) {
    const hit = element.querySelector('.device__hit');
    element.dataset.power = on ? 'on' : 'off';
    if (hit) {
        hit.disabled = !on;
        hit.setAttribute('aria-label', LABELS[device][on ? 'on' : 'off']);
    }
}

function renderScreen(device, element, on) {
    const screen = element.querySelector('.device__screen');
    if (!screen) return;
    clearTimeout(timers[device]);

    if (on) {
        setSrc(screen, screen.dataset.gifOn);
        restart(screen, reducedMotion() ? null : 'is-powering-on');
        return;
    }
    if (reducedMotion()) {
        setSrc(screen, screen.dataset.gifOff);
        restart(screen, null);
        return;
    }
    /* CRT collapse first, then the static comes back */
    restart(screen, 'is-powering-off');
    timers[device] = setTimeout(() => {
        setSrc(screen, screen.dataset.gifOff);
        restart(screen, 'is-static-in');
    }, OFF_MS);
}

function preloadOnGifs(elements) {
    Object.values(elements).forEach((element) => {
        const screen = element.querySelector('.device__screen');
        if (screen && screen.dataset.gifOn) new Image().src = screen.dataset.gifOn;
    });
}

function activate(device, element) {
    if (!isOn(device)) return;
    if (device === 'tv') {
        const url = element.dataset.href;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
    }
    /* Later phases (desktop overlay) listen for this event. */
    document.dispatchEvent(new CustomEvent('device:activate', { detail: { device } }));
}

export function initScreens() {
    const elements = {
        tv: document.querySelector('[data-device="tv"]'),
        computer: document.querySelector('[data-device="computer"]'),
    };
    if (!elements.tv || !elements.computer) return;

    Object.entries(elements).forEach(([device, element]) => {
        const hit = element.querySelector('.device__hit');
        const screen = element.querySelector('.device__screen');
        if (hit) hit.addEventListener('click', () => activate(device, element));
        if (screen) watchAnimations(screen);
    });

    subscribe((power) => {
        Object.entries(elements).forEach(([device, element]) => {
            const on = power[device];
            renderInteractivity(device, element, on);
            if (rendered[device] === on) return;           /* nothing changed for this device */
            const first = rendered[device] === undefined;
            rendered[device] = on;
            if (!first) renderScreen(device, element, on); /* initial OFF markup is already correct */
        });
    });

    /* Fetch the animated GIFs in the background so power-on is instant. */
    (window.requestIdleCallback || window.setTimeout)(() => preloadOnGifs(elements));
}
