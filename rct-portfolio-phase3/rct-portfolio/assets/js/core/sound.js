/* Tiny synthesized interface sounds (Web Audio, no audio files). Silent unless the Sound setting is on.
 * The AudioContext is created on first use, which always follows a click, so browsers allow it. */

import * as settings from './settings.js';

const VOLUME = 0.035;
const SOUNDS = {                       /* [frequency Hz, duration s] per note */
    open:     [[523, .06], [784, .08]],
    close:    [[784, .06], [523, .08]],
    on:       [[660, .07], [880, .09]],
    boot:     [[392, .1], [523, .1], [784, .18]],
    shutdown: [[784, .1], [523, .1], [392, .18]],
};

let context = null;

function getContext() {
    if (!context) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        context = new Ctor();
    }
    if (context.state === 'suspended') context.resume();
    return context;
}

export function playUiSound(name) {
    const notes = SOUNDS[name];
    if (!notes || !settings.get('sound')) return;
    try {
        const ctx = getContext();
        if (!ctx) return;
        let t = ctx.currentTime;
        notes.forEach(([frequency, duration]) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = frequency;
            gain.gain.setValueAtTime(VOLUME, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
            osc.connect(gain).connect(ctx.destination);
            osc.start(t);
            osc.stop(t + duration);
            t += duration;
        });
    } catch { /* audio unavailable: stay silent */ }
}
