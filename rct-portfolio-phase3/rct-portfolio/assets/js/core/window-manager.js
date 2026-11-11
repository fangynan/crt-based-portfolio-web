/* Reusable window manager. No knowledge of this project's apps or the desktop chrome.
 *
 *   const wm = createWindowManager({ layer, resolveApp });
 *   wm.open('about');            // creates the window, or focuses it if already open
 *
 * resolveApp(id) -> { title, icon?, width?, height?, render(contentEl, app) } | null
 *   render may return a cleanup function; it is called when that window closes.
 *
 * Two layouts, chosen by one media query and published as layer.dataset.layout:
 *   "floating"  windows have px left/top/width/height, can be dragged, are kept inside the layer
 *   "compact"   (phones) windows fill the layer via CSS; only the top one is visible
 * Stacking order is a single array (bottom -> top). The last entry is the active window.
 */

import { createIcon } from './icons.js';

const COMPACT_QUERY = '(max-width: 720px), (max-height: 480px)';
const DEFAULT_SIZE = { width: 560, height: 400 };
const EDGE_GAP = 8;   /* minimum space left around a window when it must shrink to fit */

export function createWindowManager({ layer, resolveApp, cascadeOrigin = { x: 150, y: 24 }, cascadeStep = 30 }) {
    const windows = new Map();           /* id -> window record, in the order opened */
    let order = [];                      /* ids, bottom -> top */
    const listeners = new Set();
    const compactQuery = window.matchMedia(COMPACT_QUERY);

    /* ---------- state + notifications ---------- */

    function snapshot() {
        return {
            windows: [...windows.values()].map(({ id, app }) => ({ id, title: app.title, icon: app.icon })),
            activeId: order[order.length - 1] ?? null,
        };
    }

    function emit(change) {
        const state = snapshot();
        listeners.forEach((listener) => listener(state, change));
    }

    /* Calls listener now with the current state, then after every change.
     * change = { type: 'init' | 'open' | 'focus' | 'close' | 'closeAll', id? } */
    function subscribe(listener) {
        listeners.add(listener);
        listener(snapshot(), { type: 'init' });
        return () => listeners.delete(listener);
    }

    /* ---------- stacking ---------- */

    function restack() {
        const topId = order[order.length - 1];
        order.forEach((id, index) => {
            const { el } = windows.get(id);
            el.style.zIndex = String(index + 1);
            el.classList.toggle('is-active', id === topId);
        });
    }

    function bringToFront(id) {
        if (!windows.has(id) || order[order.length - 1] === id) return false;
        order = order.filter((other) => other !== id);
        order.push(id);
        restack();
        return true;
    }

    /* ---------- geometry (floating layout only) ---------- */

    const isCompact = () => compactQuery.matches;

    function applyLayout(win) {
        const { el } = win;
        if (isCompact()) {
            el.style.left = el.style.top = el.style.width = el.style.height = '';
            return;
        }
        const boundsW = layer.clientWidth;
        const boundsH = layer.clientHeight;
        if (!boundsW || !boundsH) return;          /* layer is hidden: nothing to measure yet */

        const width  = Math.min(win.app.width  ?? DEFAULT_SIZE.width,  boundsW - EDGE_GAP * 2);
        const height = Math.min(win.app.height ?? DEFAULT_SIZE.height, boundsH - EDGE_GAP * 2);
        win.x = Math.min(Math.max(win.x, 0), boundsW - width);
        win.y = Math.min(Math.max(win.y, 0), boundsH - height);

        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.left = `${win.x}px`;
        el.style.top = `${win.y}px`;
    }

    function layoutAll() {
        layer.dataset.layout = isCompact() ? 'compact' : 'floating';
        windows.forEach(applyLayout);
    }

    /* ---------- dragging (title bar, floating layout, pointer events) ---------- */

    function enableDrag(win, titlebar) {
        let drag = null;

        titlebar.addEventListener('pointerdown', (event) => {
            if (isCompact() || event.button !== 0 || event.target.closest('button')) return;
            drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: win.x, originY: win.y };
            titlebar.setPointerCapture(event.pointerId);
            win.el.classList.add('is-dragging');
        });
        titlebar.addEventListener('pointermove', (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            win.x = drag.originX + event.clientX - drag.startX;
            win.y = drag.originY + event.clientY - drag.startY;
            applyLayout(win);                      /* clamps to the layer */
        });
        const end = (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            drag = null;
            win.el.classList.remove('is-dragging');
        };
        titlebar.addEventListener('pointerup', end);
        titlebar.addEventListener('pointercancel', end);
    }

    /* ---------- DOM ---------- */

    function buildWindow(id, app) {
        const el = document.createElement('section');
        el.className = 'app-window';
        el.dataset.app = id;
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'false');
        el.setAttribute('aria-labelledby', `window-title-${id}`);
        el.tabIndex = -1;

        const titlebar = document.createElement('div');
        titlebar.className = 'app-window__titlebar';
        if (app.icon) titlebar.appendChild(createIcon(app.icon));

        const title = document.createElement('h2');
        title.className = 'app-window__title';
        title.id = `window-title-${id}`;
        title.textContent = app.title;

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'app-window__close';
        close.setAttribute('aria-label', `Close ${app.title}`);
        close.appendChild(createIcon('close'));

        titlebar.append(title, close);

        /* Focusable so keyboard users can scroll it with the arrow keys. */
        const content = document.createElement('div');
        content.className = 'app-window__content';
        content.setAttribute('role', 'region');
        content.setAttribute('aria-labelledby', title.id);
        content.tabIndex = 0;

        el.append(titlebar, content);
        return { el, titlebar, close, content };
    }

    /* ---------- public actions ---------- */

    function focus(id) {
        const win = windows.get(id);
        if (!win) return;
        const changed = bringToFront(id);
        win.el.focus({ preventScroll: true });
        if (changed) emit({ type: 'focus', id });
    }

    function open(id) {
        if (windows.has(id)) { focus(id); return windows.get(id).el; }

        const app = resolveApp(id);
        if (!app) return null;

        const parts = buildWindow(id, app);
        const slot = windows.size % 6;
        const win = {
            id, app, ...parts,
            x: cascadeOrigin.x + slot * cascadeStep,
            y: cascadeOrigin.y + slot * cascadeStep,
        };

        try {
            const dispose = app.render(win.content, app);
            if (typeof dispose === 'function') win.dispose = dispose;
        } catch (error) {
            console.error(`Window "${id}" failed to render`, error);
            win.content.textContent = 'This window could not be loaded.';
        }

        win.close.addEventListener('click', () => close(id));
        win.el.addEventListener('pointerdown', () => { if (bringToFront(id)) emit({ type: 'focus', id }); });
        enableDrag(win, win.titlebar);

        windows.set(id, win);
        order.push(id);
        layer.appendChild(win.el);
        applyLayout(win);
        restack();
        win.el.focus({ preventScroll: true });
        emit({ type: 'open', id });
        return win.el;
    }

    function disposeWindow(win) {
        try { win.dispose?.(); } catch (error) { console.error(`Window "${win.id}" cleanup failed`, error); }
    }

    function close(id) {
        const win = windows.get(id);
        if (!win) return;
        const wasActive = order[order.length - 1] === id;
        disposeWindow(win);
        win.el.remove();
        windows.delete(id);
        order = order.filter((other) => other !== id);
        restack();
        if (wasActive && order.length) windows.get(order[order.length - 1]).el.focus({ preventScroll: true });
        emit({ type: 'close', id });
    }

    function closeAll() {
        if (!windows.size) return;
        windows.forEach((win) => { disposeWindow(win); win.el.remove(); });
        windows.clear();
        order = [];
        emit({ type: 'closeAll' });
    }

    /* ---------- keep everything in view as the screen changes ---------- */

    compactQuery.addEventListener('change', layoutAll);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(layoutAll).observe(layer);
    else window.addEventListener('resize', layoutAll);
    layoutAll();

    return {
        open, close, closeAll, focus, subscribe,
        has: (id) => windows.has(id),
        getActiveId: () => order[order.length - 1] ?? null,
        relayout: layoutAll,
    };
}
