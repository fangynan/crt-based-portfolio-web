/* Wires the compact device panels: one shared manager, one feature module per panel that needs behaviour.
 * Static panels (sticky notes, telephone) need no JavaScript beyond the manager. */

import { createPanelManager } from '../core/panel-manager.js';
import { initCassetteArchive } from './cassette-archive.js';
import { initPrinter } from './printer.js';
import { initArcade } from './arcade.js';

export function initPanels() {
    const host = document.querySelector('[data-panel-host]');
    const page = document.querySelector('.page');
    if (!host || !page) return;

    const manager = createPanelManager({ host, page });
    initCassetteArchive(manager, host.querySelector('[data-cassette-archive]'));
    initPrinter(manager, host.querySelector('[data-printer]'));
    initArcade(manager, host.querySelector('[data-arcade]'));
}
