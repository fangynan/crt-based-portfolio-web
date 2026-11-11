/* Settings app behaviour. Controls are plain form inputs marked data-setting="<key>"
 * (checkbox -> boolean, radio -> its value). The settings module is the only state. */

import * as settings from '../core/settings.js';
import { playUiSound } from '../core/sound.js';

export function enhanceSettings(container) {
    const controls = [...container.querySelectorAll('[data-setting]')];

    controls.forEach((control) => {
        control.addEventListener('change', () => {
            const key = control.dataset.setting;
            if (control.type === 'checkbox') settings.set(key, control.checked);
            else if (control.checked) settings.set(key, control.value);
            if (key === 'sound' && control.checked) playUiSound('on');   /* audible confirmation */
        });
    });

    container.querySelector('[data-action="reset-settings"]')
        ?.addEventListener('click', () => settings.reset());

    /* Keeps the controls in step with the stored values (including after Reset). */
    return settings.subscribe((values) => {
        controls.forEach((control) => {
            const value = values[control.dataset.setting];
            if (control.type === 'checkbox') control.checked = Boolean(value);
            else control.checked = control.value === String(value);
        });
    });
}
