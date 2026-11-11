/* Simulated computer desktop: opens over the landing page when the powered-on monitor is clicked.
 *
 * Lifecycle (root[data-state]):  closed -> booting -> open -> closing -> closed
 *
 * While open, the landing page stays in the DOM underneath but is made inert and scroll-locked.
 * Shutdown closes every window and returns to the landing page. It does NOT touch power state,
 * so the monitor and the TV stay on.
 */

import { createWindowManager } from '../core/window-manager.js';
import { createClock } from '../core/clock.js';
import { createIcon } from '../core/icons.js';
import { subscribe as subscribePower, isOn } from '../core/power-state.js';
import { getRenderer } from '../apps/index.js';
import * as settings from '../core/settings.js';
import { playUiSound } from '../core/sound.js';
import { initDisplay } from './display.js';

const BOOT_MS = 1500;
const SHUTDOWN_MS = 700;
const REDUCED_MS = 300;

/* The Settings app's "Reduce motion" switch (which starts from the OS preference) is authoritative. */
const reducedMotion = () => settings.get('reduceMotion');

/* App metadata comes from the shortcuts rendered by PHP (config/apps.php); nothing is duplicated in JS. */
function readApps(root) {
    const apps = {};
    root.querySelectorAll('.shortcut[data-app]').forEach((button) => {
        const { app, title, icon, width, height } = button.dataset;
        apps[app] = { id: app, title, icon, width: Number(width) || undefined, height: Number(height) || undefined };
    });
    return apps;
}

function renderTaskbar(container, buttons, state, windowManager) {
    const openIds = new Set(state.windows.map((win) => win.id));

    buttons.forEach((button, id) => {                /* drop buttons for closed windows */
        if (!openIds.has(id)) { button.remove(); buttons.delete(id); }
    });

    state.windows.forEach(({ id, title, icon }) => { /* add new ones, keep open-order stable */
        if (buttons.has(id)) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'taskbar__app';
        button.setAttribute('aria-label', title);
        button.title = title;
        if (icon) button.appendChild(createIcon(icon));
        const label = document.createElement('span');
        label.className = 'taskbar__app-label';
        label.textContent = title;
        button.appendChild(label);
        button.addEventListener('click', () => windowManager.focus(id));
        container.appendChild(button);
        buttons.set(id, button);
    });

    buttons.forEach((button, id) => {
        const active = id === state.activeId;
        button.classList.toggle('is-active', active);
        if (active) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
    });
}

export function initDesktop() {
    const root = document.getElementById('desktop');
    const page = document.querySelector('.page');
    if (!root || !page) return;

    const layer = root.querySelector('[data-window-layer]');
    const taskbarApps = root.querySelector('[data-taskbar-apps]');
    const statusEl = root.querySelector('[data-desktop-status]');
    const bootText = root.querySelector('[data-boot-text]');
    const apps = readApps(root);
    initDisplay(root);

    const clock = createClock({
        timeEl: root.querySelector('[data-clock-time]'),
        dateFullEl: root.querySelector('[data-clock-date-full]'),
        dateShortEl: root.querySelector('[data-clock-date-short]'),
    });

    const windowManager = createWindowManager({
        layer,
        resolveApp: (id) => (apps[id] ? { ...apps[id], render: getRenderer(id) } : null),
    });

    /* ---- taskbar + focus hand-back when the last window closes ---- */
    const taskbarButtons = new Map();
    windowManager.subscribe((state, change) => {
        renderTaskbar(taskbarApps, taskbarButtons, state, windowManager);
        if (change.type === 'open') playUiSound('open');
        if (change.type === 'close') playUiSound('close');
        if (change.type === 'close' && !state.windows.length && root.dataset.state === 'open') {
            root.querySelector(`.shortcut[data-app="${change.id}"]`)?.focus({ preventScroll: true });
        }
    });

    /* ---- shortcuts + shutdown ---- */
    root.querySelectorAll('.shortcut[data-app]').forEach((button) => {
        button.addEventListener('click', () => {
            if (root.dataset.state === 'open') windowManager.open(button.dataset.app);
        });
    });
    root.querySelector('[data-action="shutdown"]').addEventListener('click', shutdown);

    /* ---- lifecycle ---- */
    let timer = null;

    function setState(state, message, bootLabel) {
        root.dataset.state = state;
        statusEl.textContent = message;
        if (bootLabel) bootText.textContent = bootLabel;
    }

    function lockPage(locked) {
        document.documentElement.classList.toggle('has-desktop-open', locked);
        page.inert = locked;
    }

    function openDesktop() {
        if (root.dataset.state !== 'closed' || !isOn('computer')) return;
        const ms = reducedMotion() ? REDUCED_MS : BOOT_MS;
        root.style.setProperty('--boot-ms', `${ms}ms`);

        lockPage(true);
        root.hidden = false;
        setState('booting', 'Starting up', 'Starting up');
        root.focus({ preventScroll: true });
        clock.start();
        windowManager.relayout();

        timer = setTimeout(() => {
            setState('open', 'Desktop ready');
            playUiSound('boot');
            root.querySelector('.shortcut')?.focus({ preventScroll: true });
        }, ms);
    }

    function closeDesktop() {
        clearTimeout(timer);
        windowManager.closeAll();
        clock.stop();
        root.hidden = true;
        setState('closed', '');
        lockPage(false);

        /* Always the monitor's screen button (some browsers, e.g. Safari, don't focus buttons on click). */
        document.querySelector('[data-device="computer"] .device__hit')?.focus({ preventScroll: true });
    }

    function shutdown() {
        if (root.dataset.state !== 'open') return;
        const ms = reducedMotion() ? REDUCED_MS : SHUTDOWN_MS;
        root.style.setProperty('--boot-ms', `${ms}ms`);
        setState('closing', 'Shutting down', 'Shutting down');
        playUiSound('shutdown');
        timer = setTimeout(closeDesktop, ms);
    }

    document.addEventListener('device:activate', (event) => {
        if (event.detail?.device === 'computer') openDesktop();
    });

    /* Safety net: if the computer is ever powered off while the desktop is showing, leave at once. */
    subscribePower(() => {
        if (!isOn('computer') && root.dataset.state !== 'closed') closeDesktop();
    });
}
