/* Single source of truth for device power. No DOM code lives here.
 * Nothing else in the project stores power state: modules subscribe and render.
 *
 * State model: two independent booleans, { tv, computer }.
 *   - setPower(device, on)  changes ONE device. The computer's shutdown button
 *                           (a later phase) calls setPower('computer', false).
 *   - toggleAll()           the remote's shared action. See rule below.
 */

const state = { tv: false, computer: false };   /* initial: everything OFF */
const listeners = new Set();

export function isOn(device) {
    return state[device] === true;
}

export function isAnyOn() {
    return state.tv || state.computer;
}

export function getState() {
    return { ...state };
}

/* Calls listener immediately with the current snapshot, then on every change.
 * Returns an unsubscribe function. */
export function subscribe(listener) {
    listeners.add(listener);
    listener({ ...state });
    return () => listeners.delete(listener);
}

function emit() {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
}

export function setPower(device, on) {
    if (!(device in state) || state[device] === Boolean(on)) return;
    state[device] = Boolean(on);
    emit();
}

/* Remote rule: if ANYTHING is on, everything turns off; otherwise everything turns on.
 * Both devices are written in one step and emitted once, so renderers see a single
 * consistent change. After this shared action the devices are independent again. */
export function toggleAll() {
    const turnOn = !isAnyOn();
    state.tv = turnOn;
    state.computer = turnOn;
    emit();
}
