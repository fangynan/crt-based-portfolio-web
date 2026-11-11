<?php /* Printer panel (fax-machine style, built entirely in CSS: no printer image).
 * Data: $assets['documents']['resume'], $site['print_duration_ms'], $site['resume_download_name'], $portfolio.
 * Behaviour: assets/js/modules/printer.js (idle -> printing -> done). The paper grows out of the slot, driven by --print-progress (0..1).
 * The sheet is a mini resume rendered from config/portfolio.php; anything left empty there is simply skipped. */
$pdf      = local_file($assets['documents']['resume']);
$fileName = $site['resume_download_name'];
$size     = $pdf ? round(filesize(dirname(__DIR__, 2) . '/' . $pdf) / 1024) . ' KB' : '';
$duration = max(500, (int) ($site['print_duration_ms'] ?? 3000));

$profile    = $portfolio['profile'];
$resume     = $portfolio['resume'];
$education  = array_filter($portfolio['education'] ?? [], fn ($i) => trim((string) ($i['school'] ?? '')) !== '' || trim((string) ($i['program'] ?? '')) !== '');
$experience = array_filter($resume['experience'] ?? [], fn ($i) => trim((string) ($i['role'] ?? '')) !== '');
$awards     = array_filter($resume['achievements'] ?? [], fn ($i) => trim((string) ($i['title'] ?? '')) !== '');
$summary    = trim((string) ($resume['summary'] ?? ''));
$contact    = $portfolio['contact'] ?? [];
$contactBits = array_filter([
    trim((string) ($contact['email'] ?? '')),
    trim((string) ($contact['phone'] ?? '')),
    ($u = safe_url($contact['github'] ?? '')) ? display_url($u) : '',
]);
$skills     = array_filter($portfolio['skills'] ?? [], fn ($g) => !empty($g['items']));
$hasContent = $summary !== '' || $education || $experience || $awards || $skills;
?>
<section class="panel panel--printer" id="panel-printer" role="dialog" aria-modal="true" aria-labelledby="printer-title" tabindex="-1" hidden
         data-printer data-duration="<?= $duration ?>" data-file="<?= e($fileName) ?>" data-state="<?= $pdf ? 'idle' : 'missing' ?>">

    <div class="fax" style="--print-progress: 0;">
        <!-- Machine head: label, status lights, LCD, paper slot -->
        <div class="fax__head">
            <div class="fax__top">
                <h2 class="fax__label" id="printer-title">Printer</h2>
                <span class="fax__leds" aria-hidden="true"><i class="fax__led fax__led--green"></i><i class="fax__led fax__led--amber"></i></span>
            </div>
            <div class="fax__lcd">
                <p class="fax__lcd-status" role="status" aria-live="polite" data-printer-status><?php
                    if ($pdf) echo 'Ready. Press Print to start.';
                    else echo 'No PDF found. Add it at ' . e($assets['documents']['resume']);
                ?></p>
                <p class="fax__lcd-file"><?= e($fileName) ?><?= $pdf ? ' · PDF · ' . e($size) : ' · missing' ?></p>
                <div class="fax__meter" role="progressbar" aria-label="Print progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-printer-progress><span></span></div>
            </div>
            <div class="fax__slot" aria-hidden="true"></div>
        </div>

        <!-- Output: the sheet grows out of the slot, then the perforated tear edge follows it down -->
        <div class="fax__out">
            <div class="fax__feed" data-printer-feed role="region" aria-label="Printed resume preview">
                <article class="sheet">
                    <header class="sheet__head">
                        <h3 class="sheet__name"><?= e($profile['name']) ?></h3>
                        <?php if ($contactBits): ?><p class="sheet__contact"><?= e(implode('  •  ', $contactBits)) ?></p><?php endif; ?>
                    </header>

                    <?php if ($summary !== ''): ?>
                        <section class="sheet__sec"><h4>Profile</h4><p><?= e($summary) ?></p></section>
                    <?php endif; ?>

                    <?php if ($education): ?>
                        <section class="sheet__sec"><h4>Education</h4>
                            <?php foreach ($education as $item): ?>
                                <div class="sheet__row"><strong><?= e($item['school'] ?? '') ?></strong><span><?= e($item['period'] ?? '') ?></span></div>
                                <p class="sheet__sub"><?= e(trim(($item['program'] ?? '') . (trim((string) ($item['details'] ?? '')) !== '' ? ' · ' . $item['details'] : ''))) ?></p>
                            <?php endforeach; ?>
                        </section>
                    <?php endif; ?>

                    <?php if ($experience): ?>
                        <section class="sheet__sec"><h4>Experience</h4>
                            <?php foreach ($experience as $item): ?>
                                <div class="sheet__row"><strong><?= e($item['role']) ?><?= trim((string) ($item['organization'] ?? '')) !== '' ? ', ' . e($item['organization']) : '' ?></strong><span><?= e($item['period'] ?? '') ?></span></div>
                                <?php if (!empty($item['highlights'])): ?>
                                    <ul><?php foreach ($item['highlights'] as $line): if (trim((string) $line) === '') continue; ?><li><?= e($line) ?></li><?php endforeach; ?></ul>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </section>
                    <?php endif; ?>

                    <?php if ($awards): ?>
                        <section class="sheet__sec"><h4>Achievements</h4>
                            <?php foreach ($awards as $item): ?>
                                <div class="sheet__row"><strong><?= e($item['title']) ?></strong><span><?= e($item['date'] ?? '') ?></span></div>
                                <?php if (trim((string) ($item['detail'] ?? '')) !== ''): ?><p class="sheet__sub"><?= e($item['detail']) ?></p><?php endif; ?>
                            <?php endforeach; ?>
                        </section>
                    <?php endif; ?>

                    <?php if ($skills): ?>
                        <section class="sheet__sec"><h4>Technical skills</h4>
                            <?php foreach ($skills as $group): ?>
                                <p class="sheet__skill"><strong><?= e($group['label']) ?>:</strong> <?= e(implode(', ', $group['items'])) ?></p>
                            <?php endforeach; ?>
                        </section>
                    <?php endif; ?>

                    <?php if (!$hasContent): ?>
                        <i class="sheet__bar"></i><i class="sheet__bar is-short"></i><i class="sheet__bar"></i><i class="sheet__bar"></i><i class="sheet__bar is-short"></i>
                    <?php endif; ?>
                </article>
            </div>
            <div class="fax__tear" aria-hidden="true"></div>
        </div>
    </div>

    <!-- Controls, on the dark deck below the machine (same look as the reference: mono, spaced caps, gold outline) -->
    <div class="fax-actions">
        <button type="button" class="fax-btn fax-btn--primary" data-printer-print data-autofocus<?= $pdf ? '' : ' aria-disabled="true"' ?>><span data-printer-print-label>Print</span></button>
        <?php if ($pdf): ?>
            <a class="fax-btn is-disabled" href="<?= e($pdf) ?>" download="<?= e($fileName) ?>" aria-disabled="true" tabindex="-1" data-printer-download>Download PDF <?= icon('download') ?></a>
        <?php else: ?>
            <span class="fax-btn is-disabled" role="link" aria-disabled="true">Download PDF <?= icon('download') ?></span>
        <?php endif; ?>
        <button type="button" class="fax-btn fax-btn--ghost" data-panel-close>Close</button>
    </div>
</section>
