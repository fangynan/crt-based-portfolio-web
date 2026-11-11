<?php /* Contact. Data: $portfolio['contact']. Only validated http(s)/mailto links become real links. */
$c = $portfolio['contact'];
$rows = contact_rows($c);
?>
<div class="app app--contact">
    <header><h3 class="app-heading">Contact</h3></header>
    <ul class="contact-list">
        <?php foreach ($rows as $row): ?>
            <li class="contact-row">
                <span class="contact-row__icon"><?= icon($row['icon']) ?></span>
                <span class="contact-row__label"><?= e($row['label']) ?></span>
                <?php if ($row['href']): ?>
                    <a class="contact-row__link" href="<?= e($row['href']) ?>"<?= $row['external'] ? ' target="_blank" rel="noopener noreferrer"' : '' ?>>
                        <?= e($row['text']) ?><?php if ($row['external']): ?> <?= icon('external') ?><span class="visually-hidden"> (opens in a new tab)</span><?php endif; ?>
                    </a>
                <?php else: ?>
                    <span class="contact-row__link"><?= ph($row['label'] . ' not added yet') ?></span>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>
</div>
