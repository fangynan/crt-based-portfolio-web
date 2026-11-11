/* Arcade panel: a game-selection menu plus three games that live inside the same panel.
 *
 * Responsibilities:
 *   - show one view at a time (menu | tictactoe | snake | doodle), keep the title and Back button in sync
 *   - call each game's enter() / leave(), so a game only runs (timers, key handling) while it is on screen
 *   - Escape inside a game goes back to the menu; Escape on the menu closes the arcade (panel-manager does that)
 *   - route keyboard input to the visible game ONLY. The listener is on the panel element, not on document, so
 *     the rest of the site never sees game keys, and the panel manager already makes the page behind inert.
 *
 * To add a game: create assets/js/games/<id>.js exporting createX(rootElement) -> { enter, leave, onKeydown? },
 * add a <div data-arcade-view="<id>" data-title="..."> and a menu item in includes/panels/arcade.php, then
 * register it in GAMES below.
 */

import { createTicTacToe } from '../games/tictactoe.js';
import { createSnake } from '../games/snake.js';
import { createDoodle } from '../games/doodle.js';

const GAMES = { tictactoe: createTicTacToe, snake: createSnake, doodle: createDoodle };

export function initArcade(manager, panel) {
    if (!panel) return;

    const views = new Map([...panel.querySelectorAll('[data-arcade-view]')].map((el) => [el.dataset.arcadeView, el]));
    const titleEl = panel.querySelector('[data-arcade-title]');
    const backButton = panel.querySelector('[data-arcade-back]');
    const games = {};
    Object.entries(GAMES).forEach(([id, create]) => {
        const root = views.get(id);
        if (root) games[id] = create(root);
    });

    let current = 'menu';

    function show(name, { focus = true } = {}) {
        if (!views.has(name)) return;
        const previous = current;
        if (previous !== 'menu') games[previous]?.leave();

        current = name;
        views.forEach((el, id) => { el.hidden = id !== name; });
        titleEl.textContent = views.get(name).dataset.title || 'Arcade';
        backButton.hidden = name === 'menu';
        panel.dataset.view = name;
        games[name]?.enter();

        if (!focus) return;
        const target = name === 'menu'
            ? panel.querySelector(`[data-arcade-open="${previous}"]`) || panel.querySelector('[data-arcade-open]')
            : views.get(name).querySelector('[data-game-focus]');
        (target || panel).focus({ preventScroll: true });
    }

    panel.querySelectorAll('[data-arcade-open]').forEach((button) => {
        button.addEventListener('click', () => show(button.dataset.arcadeOpen));
    });
    backButton.addEventListener('click', () => show('menu'));

    panel.addEventListener('keydown', (event) => {
        if (current === 'menu') return;
        if (event.key === 'Escape') {                       /* back to the menu first; a second Escape closes the panel */
            event.preventDefault();                         /* panel-manager ignores defaultPrevented Escapes */
            show('menu');
            return;
        }
        games[current]?.onKeydown?.(event);
    });

    manager.register('arcade', {
        open() { show('menu', { focus: false }); },          /* panel-manager focuses [data-autofocus] itself */
        close() {
            if (current !== 'menu') games[current]?.leave();
            current = 'menu';
        },
    });
}
