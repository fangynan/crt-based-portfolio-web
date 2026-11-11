# Phase 6: Retro mini-game arcade

Click the controller -> arcade menu -> Tic-Tac-Toe, Snake or Doodle Pad. "Games" (top left) returns to the menu; Esc does the same, and a second Esc closes the arcade.

## Files
- `includes/panels/arcade.php` – all markup (menu + the three games). `includes/panels.php`, `includes/scene.php`, `includes/head.php` only gained one line each.
- `assets/js/modules/arcade.js` – view switching + keyboard routing. Games are registered in its `GAMES` map.
- `assets/js/games/` – `tictactoe-logic.js` and `snake-engine.js` (pure rules, unit-tested), plus `tictactoe.js`, `snake.js`, `doodle.js` (DOM / canvas).
- `assets/css/arcade.css`, `tests/arcade-logic.test.mjs`.

## Tweaks
- Snake speed: `TICK_MS` (default 130) and grid `COLS` / `ROWS` at the top of `games/snake.js`.
- Computer opponent strength: `chooseComputerMove()` in `games/tictactoe-logic.js` (deliberately beatable, not minimax).
- Doodle palette: `$swatches` at the top of `includes/panels/arcade.php`. Canvas size / undo depth: `WIDTH`, `HEIGHT`, `MAX_UNDO` in `games/doodle.js`.

## Test
`node tests/arcade-logic.test.mjs` runs the rules tests (Node 18+, nothing to install).
