<?php /* Telephone: notebook-style contact directory. Data: $portfolio['contact'] via contact_rows() (helpers.php). */
$rows = contact_rows($portfolio['contact']);
?>
<section class="panel panel--phone" id="panel-telephone" role="dialog" aria-modal="true" aria-labelledby="phone-title" tabindex="-1" hidden>
    <button type="button" class="panel__close" data-panel-close aria-label="Close contact directory"><?= icon('close') ?></button>
    <div class="notebook">
        <span class="notebook__rings" aria-hidden="true"></span>
        <div class="notebook__page">
            <header class="notebook__header">
                <h2 class="notebook__title" id="phone-title">Contact Directory</h2>
                <p class="notebook__subtitle">Call, write, or find me online</p>
            </header>
            <ul class="notebook__list">
                <?php foreach ($rows as $row): ?>
                    <li class="notebook__entry">
                        <span class="notebook__label"><?= e($row['label']) ?></span>
                        <?php if ($row['href']): ?>
                            <a class="notebook__link" href="<?= e($row['href']) ?>"<?= $row['external'] ? ' target="_blank" rel="noopener noreferrer"' : '' ?>>
                                <?= e($row['text']) ?><?php if ($row['external']): ?> <?= icon('external') ?><span class="visually-hidden"> (opens in a new tab)</span><?php endif; ?>
                            </a>
                        <?php else: ?>
                            <span class="notebook__link"><?= ph($row['label'] . ' not added yet') ?></span>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>
