<?php /* Resume. Data: $portfolio['resume'|'education'], $assets['documents']['resume'], $site['resume_download_name'] */
$resume     = $portfolio['resume'];
$education  = $portfolio['education'];
$experience = $resume['experience'];
$awards     = $resume['achievements'];
$pdf        = local_file($assets['documents']['resume']);
?>
<div class="app app--resume">
    <header class="resume-header">
        <div>
            <h3 class="app-heading">Resume</h3>
            <p class="app-tagline"><?= or_ph($portfolio['profile']['name'], 'Full name') ?></p>
        </div>
        <?php if ($pdf): ?>
            <a class="btn" href="<?= e($pdf) ?>" download="<?= e($site['resume_download_name']) ?>"><?= icon('download') ?> Download PDF</a>
        <?php else: ?>
            <span class="btn is-disabled" role="link" aria-disabled="true"><?= icon('download') ?> Download PDF</span>
        <?php endif; ?>
    </header>
    <?php if (!$pdf): ?>
        <p class="app-note">The PDF is not added yet. Put it at <code><?= e($assets['documents']['resume']) ?></code> and this button will work.</p>
    <?php endif; ?>

    <section class="app-section" aria-labelledby="resume-summary">
        <h4 class="app-section__title" id="resume-summary">Summary</h4>
        <?= paragraphs($resume['summary'], 'Short profile summary') ?>
    </section>

    <section class="app-section" aria-labelledby="resume-edu">
        <h4 class="app-section__title" id="resume-edu">Education</h4>
        <ul class="entry-list">
            <?php foreach ($education ?: [[]] as $item): ?>
                <li class="entry">
                    <p class="entry__title"><?= or_ph($item['program'] ?? '', 'Program or degree') ?></p>
                    <p class="entry__meta"><?= or_ph($item['school'] ?? '', 'School') ?> · <?= or_ph($item['period'] ?? '', 'Years') ?></p>
                    <?php if (!$education || trim((string) ($item['details'] ?? '')) !== ''): ?>
                        <p><?= or_ph($item['details'] ?? '', 'Honors, thesis or relevant coursework') ?></p>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </section>

    <section class="app-section" aria-labelledby="resume-exp">
        <h4 class="app-section__title" id="resume-exp">Experience</h4>
        <ul class="entry-list">
            <?php foreach ($experience ?: [[]] as $item): ?>
                <li class="entry">
                    <p class="entry__title"><?= or_ph($item['role'] ?? '', 'Role') ?></p>
                    <p class="entry__meta"><?= or_ph($item['organization'] ?? '', 'Organization') ?> · <?= or_ph($item['period'] ?? '', 'Dates') ?></p>
                    <ul class="bullet-list">
                        <?php foreach (($item['highlights'] ?? []) ?: [''] as $line): ?>
                            <li><?= or_ph($line, 'What you did or achieved') ?></li>
                        <?php endforeach; ?>
                    </ul>
                </li>
            <?php endforeach; ?>
        </ul>
    </section>

    <section class="app-section" aria-labelledby="resume-awards">
        <h4 class="app-section__title" id="resume-awards">Achievements</h4>
        <ul class="entry-list">
            <?php foreach ($awards ?: [[]] as $item): ?>
                <li class="entry">
                    <p class="entry__title"><?= or_ph($item['title'] ?? '', 'Achievement') ?><?php if (trim((string) ($item['date'] ?? '')) !== ''): ?> <span class="entry__meta">· <?= e($item['date']) ?></span><?php endif; ?></p>
                    <?php if (!$awards || trim((string) ($item['detail'] ?? '')) !== ''): ?>
                        <p><?= or_ph($item['detail'] ?? '', 'Short description') ?></p>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </section>
</div>
