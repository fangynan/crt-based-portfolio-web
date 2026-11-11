/* Remote control: one power button that toggles the TV and computer together.
 * Holds no state of its own; the LED/pressed state is rendered from the power manager. */

import { subscribe, toggleAll, isAnyOn } from '../core/power-state.js';

export function initRemote() {
    const remote = document.querySelector('[data-device="remote"]');
    const button = remote && remote.querySelector('.remote__power');
    if (!remote || !button) return;

    button.addEventListener('click', toggleAll);

    subscribe(() => {
        const on = isAnyOn();
        remote.dataset.power = on ? 'on' : 'off';
        /* Stable accessible name ("Power") + pressed state. Do not change the label with the state. */
        button.setAttribute('aria-pressed', String(on));
    });
}
