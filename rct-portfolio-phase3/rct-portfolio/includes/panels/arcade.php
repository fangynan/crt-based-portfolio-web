<?php /* Arcade panel (opened by the controller). One panel, four views: menu, Tic-Tac-Toe, Snake, Doodle Pad.
 * Behaviour: assets/js/modules/arcade.js (view switching) + assets/js/games/*.js (one file per game).
 * Styles: assets/css/arcade.css. Only one view is visible at a time (the `hidden` attribute); JS never builds markup,
 * so everything below is the complete interface. No data is needed from config/. */

$menu = [
    ['id' => 'tictactoe', 'title' => 'Tic-Tac-Toe', 'blurb' => 'Two players, or play the computer.'],
    ['id' => 'snake',     'title' => 'Snake',        'blurb' => 'Classic grid snake. Arrow keys, swipe or pad.'],
    ['id' => 'doodle',    'title' => 'Doodle Pad',   'blurb' => 'Sketch, erase, then save as a PNG.'],
];
$swatches = ['#2b2a28' => 'Charcoal', '#b3261e' => 'Red', '#b8860b' => 'Mustard', '#2e7d4f' => 'Green', '#243f73' => 'Blue', '#7a4a21' => 'Brown'];
$markCell = static function (int $i): string {
    return '<button type="button" class="ttt__cell" data-ttt-cell="' . $i . '"' . ($i === 0 ? ' data-game-focus' : '') . '></button>';
};
?>
<section class="panel panel--arcade" id="panel-arcade" role="dialog" aria-modal="true" aria-labelledby="arcade-title" tabindex="-1" hidden data-arcade data-view="menu">
    <header class="panel__bar">
        <div class="arcade__heading">
            <button type="button" class="arcade__back" data-arcade-back hidden aria-label="Back to game selection"><span aria-hidden="true">&#9664;</span> Games</button>
            <h2 class="panel__title" id="arcade-title" data-arcade-title>Arcade</h2>
        </div>
        <button type="button" class="panel__close" data-panel-close aria-label="Close arcade"><?= icon('close') ?></button>
    </header>

    <div class="panel__body arcade__body">

        <!-- Game selection -->
        <div class="arcade__view" data-arcade-view="menu" data-title="Arcade">
            <p class="arcade__intro">Pick a game.</p>
            <ul class="arcade-menu">
                <?php foreach ($menu as $n => $game): ?>
                    <li>
                        <button type="button" class="arcade-menu__item" data-arcade-open="<?= e($game['id']) ?>"<?= $n === 0 ? ' data-autofocus' : '' ?>>
                            <span class="arcade-menu__number" aria-hidden="true"><?= $n + 1 ?></span>
                            <span class="arcade-menu__text">
                                <strong><?= e($game['title']) ?></strong>
                                <small><?= e($game['blurb']) ?></small>
                            </span>
                            <span class="arcade-menu__go" aria-hidden="true">&#9654;</span>
                        </button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <!-- Tic-Tac-Toe -->
        <div class="arcade__view ttt" data-arcade-view="tictactoe" data-title="Tic-Tac-Toe" hidden>
            <div class="segmented" role="group" aria-label="Game mode">
                <button type="button" class="segmented__btn" data-ttt-mode="2p" aria-pressed="true">2 Players</button>
                <button type="button" class="segmented__btn" data-ttt-mode="cpu" aria-pressed="false">vs Computer</button>
            </div>

            <p class="ttt__status" role="status" aria-live="polite" data-ttt-status>X's turn</p>

            <div class="ttt__board" role="group" aria-label="Tic-Tac-Toe board">
                <?php for ($i = 0; $i < 9; $i++) echo $markCell($i); ?>
            </div>

            <dl class="ttt__scores" aria-label="Score">
                <div><dt data-ttt-name="X">X</dt><dd data-ttt-score="X">0</dd></div>
                <div><dt>Draws</dt><dd data-ttt-score="D">0</dd></div>
                <div><dt data-ttt-name="O">O</dt><dd data-ttt-score="O">0</dd></div>
            </dl>

            <div class="arcade__actions">
                <button type="button" class="btn" data-ttt-restart>Restart</button>
            </div>
        </div>

        <!-- Snake -->
        <div class="arcade__view snake" data-arcade-view="snake" data-title="Snake" hidden>
            <p class="visually-hidden" role="status" aria-live="polite" data-snake-announce></p>
            <p class="snake__hud">
                <span>Score <b data-snake-score>0</b></span>
                <span>Best <b data-snake-best>0</b></span>
            </p>
            <div class="snake__screen">
                <canvas class="snake__canvas" data-snake-canvas role="img" aria-label="Snake game board"></canvas>
                <p class="snake__overlay" data-snake-overlay aria-hidden="true"></p>
            </div>

            <div class="snake__controls">
                <div class="snake__buttons">
                    <button type="button" class="btn" data-snake-primary data-game-focus>Start</button>
                    <button type="button" class="btn" data-snake-restart>Restart</button>
                </div>
                <div class="snake__pad" role="group" aria-label="Direction pad">
                    <button type="button" class="snake__dir snake__dir--up" data-snake-dir="up" aria-label="Up"><span aria-hidden="true">&#9650;</span></button>
                    <button type="button" class="snake__dir snake__dir--left" data-snake-dir="left" aria-label="Left"><span aria-hidden="true">&#9664;</span></button>
                    <button type="button" class="snake__dir snake__dir--down" data-snake-dir="down" aria-label="Down"><span aria-hidden="true">&#9660;</span></button>
                    <button type="button" class="snake__dir snake__dir--right" data-snake-dir="right" aria-label="Right"><span aria-hidden="true">&#9654;</span></button>
                </div>
            </div>
            <p class="arcade__hint">Arrow keys or W A S D to steer &middot; P to pause &middot; Esc for the menu</p>
        </div>

        <!-- Doodle Pad -->
        <div class="arcade__view doodle" data-arcade-view="doodle" data-title="Doodle Pad" hidden>
            <p class="visually-hidden" role="status" aria-live="polite" data-doodle-announce></p>

            <div class="doodle__toolbar">
                <div class="segmented" role="group" aria-label="Tool">
                    <button type="button" class="segmented__btn" data-doodle-tool="brush" aria-pressed="true" data-game-focus>Brush</button>
                    <button type="button" class="segmented__btn" data-doodle-tool="eraser" aria-pressed="false">Eraser</button>
                </div>

                <div class="doodle__colors" role="group" aria-label="Colour">
                    <?php foreach ($swatches as $hex => $name): ?>
                        <button type="button" class="doodle__swatch" data-doodle-swatch="<?= e($hex) ?>" style="--swatch: <?= e($hex) ?>;" aria-label="<?= e($name) ?>" aria-pressed="<?= $hex === '#2b2a28' ? 'true' : 'false' ?>"></button>
                    <?php endforeach; ?>
                    <label class="doodle__picker">
                        <span class="visually-hidden">Custom colour</span>
                        <input type="color" value="#2b2a28" data-doodle-color>
                    </label>
                </div>

                <label class="doodle__size">
                    <span class="doodle__size-label">Size <output data-doodle-size-output for="doodle-size">6 px</output></span>
                    <input type="range" id="doodle-size" min="1" max="40" value="6" step="1" data-doodle-size>
                </label>
            </div>

            <canvas class="doodle__canvas" data-doodle-canvas data-tool="brush" role="img" aria-label="Drawing canvas. Drawing needs a mouse, pen or touchscreen."></canvas>

            <div class="arcade__actions">
                <button type="button" class="btn" data-doodle-undo aria-disabled="true">Undo</button>
                <button type="button" class="btn" data-doodle-clear>Clear</button>
                <button type="button" class="btn" data-doodle-download><?= icon('download') ?> Download PNG</button>
            </div>
        </div>
    </div>
</section>
