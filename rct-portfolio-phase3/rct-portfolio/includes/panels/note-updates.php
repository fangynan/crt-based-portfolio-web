<?php /* Sticky note 2: current activities / learning goals / updates. Data: $portfolio['notes']['updates'] */
$note  = $portfolio['notes']['updates'];
$items = $note['items'] ?: [['label' => 'Update', 'text' => '']];
?>
<section class="panel panel--note panel--note-white" id="panel-note-updates" role="dialog" aria-modal="true" aria-labelledby="note-updates-title" tabindex="-1" hidden>
    <span class="note__tape" aria-hidden="true"></span>
    <button type="button" class="panel__close" data-panel-close aria-label="Close updates note"><?= icon('close') ?></button>
    <div class="note__body">
        <h2 class="note__heading" id="note-updates-title"><?= or_ph($note['heading'], 'Note heading') ?></h2>
        <ul class="note__list">
            <?php foreach ($items as $item): ?>
                <li class="note__item">
                    <span class="note__item-label"><?= or_ph($item['label'] ?? '', 'Label') ?></span>
                    <span class="note__item-text"><?= or_ph($item['text'] ?? '', 'What is happening here') ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>
