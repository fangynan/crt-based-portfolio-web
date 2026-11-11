/* Reusable manager for compact device panels (one open at a time).
 *
 * Responsibilities (nothing about what is INSIDE a panel):
 *   - show/hide the host + one panel, keep the landing page inert and scroll-locked while open
 *   - Escape, close buttons and click-outside close it; clicks inside never reach the page underneath
 *   - move focus in, keep Tab inside, hand focus back to the device that opened it
 *   - let feature modules react:  manager.register('cassette', { open(detail) {}, close() {} })
 */

import * as settings from './settings.js';
import { playUiSound } from './sound.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function createPanelManager({ host, page }) {
    const handlers = new Map();   /* panel id -> { open, close } */
    let active = null;            /* { id, el, opener } */

    const panelEl = (id) => host.querySelector(`#panel-${CSS.escape(id)}`);

    function focusables(el) {
        return [...el.querySelectorAll(FOCUSABLE)].filter((node) => !node.closest('[hidden]'));
    }

    function lockPage(locked) {
        document.documentElement.classList.toggle('has-panel-open', locked);
        page.inert = locked;
    }

    function open(id, { opener = null, detail = {} } = {}) {
        const el = panelEl(id);
        if (!el || active) return false;

        active = { id, el, opener };
        host.dataset.reduceMotion = String(settings.get('reduceMotion'));
        lockPage(true);
        host.hidden = false;
        el.hidden = false;
        playUiSound('open');

        handlers.get(id)?.open?.(detail, el);
        (el.querySelector('[data-autofocus]') || el).focus({ preventScroll: true });
        return true;
    }

    function close() {
        if (!active) return;
        const { id, el, opener } = active;
        active = null;
        handlers.get(id)?.close?.(el);
        el.hidden = true;
        host.hidden = true;
        lockPage(false);
        playUiSound('close');
        /* Hand focus back to the device that opened the panel (Safari does not focus buttons on click, so be explicit). */
        if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    }

    /* ---- wiring ---- */

    /* Click-outside: only when the press AND the release both happened on the dim backdrop,
     * so selecting text and letting go outside the panel never closes it. */
    let pressedOnBackdrop = false;
    host.addEventListener('pointerdown', (event) => { pressedOnBackdrop = event.target === host; });
    host.addEventListener('click', (event) => {
        event.stopPropagation();                                   /* nothing inside the host reaches the page underneath */
        if (event.target === host && pressedOnBackdrop) { close(); return; }
        if (event.target.closest('[data-panel-close]')) close();
    });

    document.addEventListener('keydown', (event) => {
        if (!active) return;
        if (event.key === 'Escape' && !event.defaultPrevented) {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== 'Tab') return;
        const items = focusables(active.el);
        if (!items.length) { event.preventDefault(); active.el.focus(); return; }
        const first = items[0];
        const last = items[items.length - 1];
        const current = document.activeElement;
        if (event.shiftKey && (current === first || current === active.el)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && current === last) { event.preventDefault(); first.focus(); }
    });

    /* Safety net: if focus ever lands outside the open panel (e.g. after the browser chrome), pull it back. */
    document.addEventListener('focusin', (event) => {
        if (active && !host.contains(event.target)) active.el.focus({ preventScroll: true });
    });

    document.querySelectorAll('[data-panel-trigger]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            open(trigger.dataset.panelTrigger, { opener: trigger, detail: { slot: trigger.dataset.slot } });
        });
    });

    return {
        open,
        close,
        isOpen: (id) => Boolean(active && (!id || active.id === id)),
        register(id, hooks) { handlers.set(id, hooks); },
    };
}
