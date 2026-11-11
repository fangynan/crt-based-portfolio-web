<?php /* Cassette archive: a tape deck that plays one project at a time.
 * Data: $portfolio['projects'] (see config/portfolio.php) normalised by project_view() in helpers.php.
 * One <article class="tape-card"> is rendered per tape; assets/js/modules/cassette-archive.js loads them into the deck.
 * Tape count = the larger of (tapes on the stack image) and (projects), so adding projects never needs UI edits. */
$stackCount = (require __DIR__ . '/../../config/cassettes.php')['stack']['count'];
$tapeCount  = max($stackCount, count($portfolio['projects']));
$tapes      = [];
for ($i = 0; $i < $tapeCount; $i++) $tapes[] = project_view($portfolio['projects'][$i] ?? [], $i + 1);
?>
<section class="panel panel--cassette" id="panel-cassette" role="dialog" aria-modal="true" aria-labelledby="cassette-title" tabindex="-1" hidden data-cassette-archive>
    <header class="panel__bar">
        <h2 class="panel__title" id="cassette-title">Project Archive</h2>
        <button type="button" class="panel__close" data-panel-close aria-label="Close project archive"><?= icon('close') ?></button>
    </header>

    <div class="panel__body">
        <p class="visually-hidden" role="status" aria-live="polite" data-deck-announce></p>

        <div class="deck" data-deck data-state="empty">
            <div class="deck__window">
                <div class="cassette" data-cassette aria-hidden="true">
                    <svg class="cassette__shell" viewBox="0 0 300 190" focusable="false">
                        <rect x="2" y="2" width="296" height="186" rx="12" class="cassette__body"/>
                        <rect x="14" y="14" width="272" height="96" rx="6" class="cassette__label-bg"/>
                        <path d="M70 190 L82 150 H218 L230 190 Z" class="cassette__foot"/>
                        <rect x="92" y="158" width="116" height="22" rx="4" class="cassette__slot"/>
                        <circle cx="112" cy="132" r="21" class="cassette__tape"/>
                        <circle cx="188" cy="132" r="21" class="cassette__tape"/>
                        <rect x="88" y="114" width="124" height="36" rx="18" class="cassette__window"/>
                        <?php foreach ([['left', 112], ['right', 188]] as [$side, $cx]): ?>
                            <g class="reel reel--<?= $side ?>" transform="translate(<?= $cx ?> 132)">
                                <g class="reel__spin">
                                    <circle r="13" class="reel__hub"/>
                                    <?php for ($k = 0; $k < 6; $k++): ?><rect x="-1.6" y="-13" width="3.2" height="7" class="reel__tooth" transform="rotate(<?= $k * 60 ?>)"/><?php endfor; ?>
                                    <circle r="4" class="reel__axle"/>
                                </g>
                            </g>
                        <?php endforeach; ?>
                        <circle cx="26" cy="26" r="3" class="cassette__screw"/><circle cx="274" cy="26" r="3" class="cassette__screw"/>
                        <circle cx="26" cy="174" r="3" class="cassette__screw"/><circle cx="274" cy="174" r="3" class="cassette__screw"/>
                    </svg>
                    <span class="cassette__label"><span class="cassette__number" data-cassette-number></span><span class="cassette__title" data-cassette-title></span></span>
                </div>
                <div class="deck__glass" aria-hidden="true"></div>
            </div>

            <div class="deck__panel">
                <p class="deck__readout" aria-hidden="true">
                    <span>TAPE <b data-deck-index>--</b>/<?= str_pad((string) $tapeCount, 2, '0', STR_PAD_LEFT) ?></span>
                    <span class="deck__status" data-deck-status>EMPTY</span>
                </p>
                <div class="deck__controls">
                    <button type="button" class="deck__btn" data-deck-prev aria-label="Previous tape">&#9664;&#9664;</button>
                    <button type="button" class="deck__btn deck__btn--eject" aria-label="Eject tape and close archive" data-panel-close>&#9650;</button>
                    <button type="button" class="deck__btn" data-deck-next aria-label="Next tape">&#9654;&#9654;</button>
                </div>
            </div>

            <ol class="deck__tracks" aria-label="Choose a tape">
                <?php foreach ($tapes as $i => $tape): ?>
                    <li><button type="button" class="deck__track" data-deck-track="<?= $i ?>" aria-label="Tape <?= $i + 1 ?><?= $tape['title'] !== '' ? ': ' . e($tape['title']) : ' (empty)' ?>"><?= $i + 1 ?></button></li>
                <?php endforeach; ?>
            </ol>
        </div>

        <div class="tape-sheet">
            <?php foreach ($tapes as $i => $tape): ?>
                <article class="tape-card" data-tape-card="<?= $i ?>" data-title="<?= e($tape['title'] !== '' ? $tape['title'] : 'Empty tape') ?>" hidden>
                    <p class="tape-card__meta">Tape <?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?><?= $tape['meta'] !== '' ? ' · ' . e($tape['meta']) : '' ?></p>
                    <h3 class="tape-card__title"><?= or_ph($tape['title'], 'Project ' . ($i + 1) . ' title') ?></h3>

                    <div class="tape-card__preview">
                        <?php if ($tape['images']): ?>
                            <img class="tape-card__image" src="<?= e($tape['images'][0]['src']) ?>" alt="<?= e($tape['images'][0]['alt'] ?: 'Preview of ' . $tape['title']) ?>" data-preview-main>
                            <?php if (count($tape['images']) > 1): ?>
                                <ul class="tape-card__thumbs" aria-label="Preview images">
                                    <?php foreach ($tape['images'] as $n => $img): ?>
                                        <li><button type="button" class="tape-card__thumb" data-preview-thumb data-src="<?= e($img['src']) ?>" data-alt="<?= e($img['alt'] ?: 'Preview ' . ($n + 1) . ' of ' . $tape['title']) ?>" aria-label="Show preview <?= $n + 1 ?>" aria-pressed="<?= $n === 0 ? 'true' : 'false' ?>"><img src="<?= e($img['src']) ?>" alt="" loading="lazy"></button></li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        <?php else: ?>
                            <div class="tape-card__image is-placeholder"><span>[Preview image]</span></div>
                        <?php endif; ?>
                    </div>

                    <div class="tape-card__text"><?= paragraphs($tape['description'], 'Project description') ?></div>

                    <h4 class="tape-card__heading">Technologies</h4>
                    <ul class="chip-list">
                        <?php foreach ($tape['tech'] as $item): ?><li class="chip"><?= e($item) ?></li><?php endforeach; ?>
                        <?php if (!$tape['tech']): ?><li class="chip is-placeholder">[Technology]</li><?php endif; ?>
                    </ul>

                    <h4 class="tape-card__heading">Links</h4>
                    <div class="tape-card__links">
                        <?php foreach ($tape['links'] as $link): ?>
                            <a class="btn" href="<?= e($link['url']) ?>" target="_blank" rel="noopener noreferrer"><?= e($link['label']) ?> <?= icon('external') ?><span class="visually-hidden"> (opens in a new tab)</span></a>
                        <?php endforeach; ?>
                        <?php if (!$tape['links']): ?><span class="btn is-disabled" role="link" aria-disabled="true">[Project link]</span><?php endif; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
