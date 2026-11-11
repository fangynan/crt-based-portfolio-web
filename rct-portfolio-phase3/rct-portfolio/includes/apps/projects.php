<?php /* Projects. Data: $portfolio['projects']. With none supplied, two clearly marked placeholder cards are shown. */
$projects = $portfolio['projects'] ?: [[], []];
$isPlaceholderSet = !$portfolio['projects'];
?>
<div class="app app--projects">
    <header>
        <h3 class="app-heading">Projects</h3>
        <?php if ($isPlaceholderSet): ?><p class="app-note">No projects added yet. Edit <code>config/portfolio.php</code>.</p><?php endif; ?>
    </header>
    <ul class="project-grid">
        <?php foreach ($projects as $i => $project): ?>
            <?php
            $n       = $i + 1;
            $view    = project_view($project, $n);          /* same data as the cassette archive: 'images' or legacy 'preview' */
            $preview = $view['images'][0]['src'] ?? null;
            $link    = project_primary_link($project);
            $tech    = $project['tech'] ?? [];
            ?>
            <li class="project-card">
                <div class="project-card__preview<?= $preview ? '' : ' is-placeholder' ?>">
                    <?php if ($preview): ?>
                        <img src="<?= e($preview) ?>" alt="Preview of <?= e($project['title'] ?? 'project') ?>" loading="lazy">
                    <?php else: ?>
                        <span>[Preview image]</span>
                    <?php endif; ?>
                </div>
                <h4 class="project-card__title"><?= or_ph($project['title'] ?? '', "Project $n title") ?></h4>
                <p><?= or_ph($project['summary'] ?? '', 'Short description') ?></p>
                <ul class="chip-list" aria-label="Technologies">
                    <?php foreach ($tech as $item): ?><li class="chip"><?= e($item) ?></li><?php endforeach; ?>
                    <?php if (!$tech): ?><li class="chip is-placeholder">[Technology]</li><li class="chip is-placeholder">[Technology]</li><?php endif; ?>
                </ul>
                <?php if ($link): ?>
                    <a class="btn" href="<?= e($link) ?>" target="_blank" rel="noopener noreferrer">View project <?= icon('external') ?><span class="visually-hidden"> (opens in a new tab)</span></a>
                <?php else: ?>
                    <span class="btn is-disabled" role="link" aria-disabled="true">[Project link]</span>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>
</div>
