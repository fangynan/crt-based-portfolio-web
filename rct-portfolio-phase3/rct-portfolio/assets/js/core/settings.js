/* User preferences for the simulated desktop. Single source of truth, persisted in localStorage.
 * No DOM code here: core/sound.js and modules/display.js read it; the Settings app writes it. */

const STORAGE_KEY = 'rct-portfolio:settings:v1';

const ALLOWED = {
    theme: ['system', 'light', 'dark'],
    textSize: ['small', 'default', 'large'],
    wallpaper: ['dots', 'plain'],
};
const BOOLEANS = ['sound', 'reduceMotion'];

const osPrefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function defaults() {
    return { sound: false, theme: 'system', textSize: 'default', wallpaper: 'dots', reduceMotion: osPrefersReducedMotion() };
}

function isValid(key, value) {
    if (BOOLEANS.includes(key)) return typeof value === 'boolean';
    return key in ALLOWED && ALLOWED[key].includes(value);
}

function load() {
    const state = defaults();
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        Object.keys(state).forEach((key) => { if (isValid(key, saved[key])) state[key] = saved[key]; });
    } catch { /* storage blocked or corrupt: fall back to defaults */ }
    return state;
}

function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* private mode etc. */ }
}

let state = load();
const listeners = new Set();

export const get = (key) => state[key];
export const getAll = () => ({ ...state });

/* Calls listener now, then after every change. Returns an unsubscribe function. */
export function subscribe(listener) {
    listeners.add(listener);
    listener({ ...state });
    return () => listeners.delete(listener);
}

function emit() {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
}

export function set(key, value) {
    if (!(key in state) || !isValid(key, value) || state[key] === value) return;
    state[key] = value;
    save();
    emit();
}

export function reset() {
    state = defaults();
    save();
    emit();
}
