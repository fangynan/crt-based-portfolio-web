<?php /* Skills. Data: $portfolio['skills'] (list of ['label', 'items']). Categories are shown even when empty. No levels. */ ?>
<div class="app app--skills">
    <header><h3 class="app-heading">Skills</h3></header>
    <?php foreach ($portfolio['skills'] as $i => $group): ?>
        <section class="app-section" aria-labelledby="skills-<?= (int) $i ?>">
            <h4 class="app-section__title" id="skills-<?= (int) $i ?>"><?= e($group['label']) ?></h4>
            <ul class="chip-list">
                <?php foreach ($group['items'] as $item): ?><li class="chip"><?= e($item) ?></li><?php endforeach; ?>
                <?php if (!$group['items']): ?><li class="chip is-placeholder">[Add skills]</li><?php endif; ?>
            </ul>
        </section>
    <?php endforeach; ?>
</div>
