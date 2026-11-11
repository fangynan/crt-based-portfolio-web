<?php /* Landing collage. Expects $assets, $site and $portfolio from index.php.
 * DOM order = mobile reading order (TV group, monitor, printer, telephone).
 * Desktop re-orders visually with CSS only (telephone sits above printer). */ ?>
<section class="scene" aria-label="Device collection">

    <!-- Group 1: cassettes + television (+ remote) -->
    <div class="group group--tv">
        <?php $stack = (require __DIR__ . '/../config/cassettes.php')['stack']; ?>
        <div class="device device--cassettes" data-device="cassettes" role="group" aria-label="Project cassettes">
            <img src="<?= $assets['img']['cassettes'] ?>" alt="">
            <?php for ($i = 0; $i < $stack['count']; $i++): ?>
                <?php $tapeTitle = trim((string) ($portfolio['projects'][$i]['title'] ?? '')); ?>
                <button type="button" class="tape-hit" data-panel-trigger="cassette" data-slot="<?= $i ?>"
                        style="--tape-top: <?= round($stack['top'] + $i * $stack['height'], 3) ?>%; --tape-height: <?= $stack['height'] ?>%; --tape-left: <?= $stack['left'] ?>%; --tape-width: <?= $stack['width'] ?>%;"
                        aria-label="Open cassette <?= $i + 1 ?><?= $tapeTitle !== '' ? ': ' . e($tapeTitle) : '' ?>"></button>
            <?php endfor; ?>
        </div>

        <div class="device device--tv" data-device="tv" data-power="off" data-href="<?= htmlspecialchars($site['tv_url'], ENT_QUOTES) ?>">
            <img class="device__screen" src="<?= $assets['gif']['static_off'] ?>" alt="" data-gif-off="<?= $assets['gif']['static_off'] ?>" data-gif-on="<?= $assets['gif']['tv_on'] ?>">
            <img class="device__frame" src="<?= $assets['img']['tv_frame'] ?>" alt="Television">
            <button type="button" class="device__hit" disabled aria-label="Television, off"></button>
        </div>

        <?php require __DIR__ . '/remote.php'; ?>
    </div>

    <!-- Group 2: monitor stage. Notes + controller are positioned against THIS box, not the viewport. -->
    <div class="group group--computer">
        <div class="monitor-stage">
            <div class="device device--computer" data-device="computer" data-power="off">
                <img class="device__screen" src="<?= $assets['gif']['static_off'] ?>" alt="" data-gif-off="<?= $assets['gif']['static_off'] ?>" data-gif-on="<?= $assets['gif']['monitor_on'] ?>">
                <img class="device__frame" src="<?= $assets['img']['monitor_frame'] ?>" alt="Computer monitor">
                <button type="button" class="device__hit" disabled aria-label="Computer, off"></button>
            </div>

            <button type="button" class="device device--note-pink" data-device="note-intro" data-panel-trigger="note-intro" aria-label="Open introduction note">
                <img src="<?= $assets['img']['note_pink'] ?>" alt="">
            </button>
            <button type="button" class="device device--note-white" data-device="note-updates" data-panel-trigger="note-updates" aria-label="Open updates note">
                <img src="<?= $assets['img']['note_white'] ?>" alt="">
            </button>
            <button type="button" class="device device--controller" data-device="controller" data-panel-trigger="arcade" aria-label="Open arcade">
                <img src="<?= $assets['img']['controller'] ?>" alt="">
            </button>
        </div>
    </div>

    <!-- Groups 3 + 4: printer, then telephone (desktop flips them: telephone above printer) -->
    <div class="group group--office">
        <button type="button" class="device device--printer" data-device="printer" data-panel-trigger="printer" aria-label="Open printer">
            <img src="<?= $assets['img']['printer'] ?>" alt="">
        </button>
        <button type="button" class="device device--telephone" data-device="telephone" data-panel-trigger="telephone" aria-label="Open contact directory">
            <img src="<?= $assets['img']['telephone'] ?>" alt="">
        </button>
    </div>
</section>
