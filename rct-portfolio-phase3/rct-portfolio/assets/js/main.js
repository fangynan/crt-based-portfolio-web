/* Entry point. Each module owns one concern and is initialised here. */

import { initRemote } from './modules/remote.js';
import { initScreens } from './modules/screens.js';
import { initDesktop } from './modules/desktop.js';
import { initPanels } from './modules/panels.js';

document.addEventListener('DOMContentLoaded', () => {
    initScreens();
    initRemote();
    initDesktop();
    initPanels();
});
