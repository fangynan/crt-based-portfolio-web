<?php /* Sticky note 1: friendly introduction. Data: $portfolio['notes']['intro'], ['profile'], ['interests'] */
$note      = $portfolio['notes']['intro'];
$profile   = $portfolio['profile'];
$firstName = trim(explode(' ', trim((string) $profile['name']))[0] ?? '');
?>
<section class="panel panel--note panel--note-pink" id="panel-note-intro" role="dialog" aria-modal="true" aria-labelledby="note-intro-title" tabindex="-1" hidden>
    <span class="note__tape" aria-hidden="true"></span>
    <button type="button" class="panel__close" data-panel-close aria-label="Close introduction note"><?= icon('close') ?></button>
    <div class="note__body">
        <h2 class="note__heading" id="note-intro-title"><?= or_ph($note['heading'], 'Note heading') ?></h2>
        <?= paragraphs($note['message'], 'A friendly message to visitors') ?>
        <?php if (trim((string) $profile['name']) !== ''): ?>
            <p class="note__fact"><span class="note__fact-label">Name</span> <?= e($profile['name']) ?></p>
        <?php endif; ?>
        <?php if (trim((string) $profile['tagline']) !== ''): ?>
            <p class="note__fact"><span class="note__fact-label">Motto</span> <?= e($profile['tagline']) ?></p>
        <?php endif; ?>
        <?php if (trim((string) $profile['intro']) !== ''): ?>
            <p class="note__fact"><span class="note__fact-label">About</span> <?= e($profile['intro']) ?></p>
        <?php endif; ?>
        <?php if ($portfolio['interests']): ?>
            <p class="note__fact"><span class="note__fact-label">Into</span> <?= e(implode(', ', $portfolio['interests'])) ?></p>
        <?php endif; ?>
        <?php if (trim((string) $note['sign_off']) !== ''): ?>
            <p class="note__signoff"><?= e($note['sign_off']) ?><?php if ($firstName !== ''): ?><br>– <?= e($firstName) ?><?php endif; ?></p>
        <?php endif; ?>
    </div>
</section>
