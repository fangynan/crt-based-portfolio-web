/* Applies the display settings (theme, text size, wallpaper, motion) to the desktop as data attributes.
 * CSS does the rest (see the tokens at the top of desktop.css). */

import * as settings from '../core/settings.js';

export function initDisplay(root) {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function apply(values) {
        root.dataset.theme = values.theme === 'system' ? (darkQuery.matches ? 'dark' : 'light') : values.theme;
        root.dataset.textSize = values.textSize;
        root.dataset.wallpaper = values.wallpaper;
        root.dataset.reduceMotion = String(values.reduceMotion);
    }

    settings.subscribe(apply);
    darkQuery.addEventListener('change', () => apply(settings.getAll()));   /* "System" follows the OS live */
}
