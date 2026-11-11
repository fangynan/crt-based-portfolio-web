<?php /* About Me. Data: $portfolio['profile'|'education'|'interests'] */
$profile   = $portfolio['profile'];
$photo     = local_file($profile['photo']);
$education = $portfolio['education'];
$interests = $portfolio['interests'];
?>
<div class="app app--about">
    <header class="about-header">
        <div class="avatar<?= $photo ? '' : ' is-placeholder' ?>">
            <?php if ($photo): ?>
                <img src="<?= e($photo) ?>" alt="Profile photo of <?= e($profile['name']) ?>">
            <?php else: ?>
                <?= icon('user') ?><span>[Profile picture]</span>
            <?php endif; ?>
        </div>
        <div class="about-header__text">
            <h3 class="app-heading"><?= or_ph($profile['name'], 'Full name') ?></h3>
            <p class="app-tagline"><?= or_ph($profile['tagline'], 'Short tagline') ?></p>
        </div>
    </header>

    <section class="app-section" aria-labelledby="about-intro">
        <h4 class="app-section__title" id="about-intro">Introduction</h4>
        <?= paragraphs($profile['intro'], 'Short introduction about you') ?>
    </section>

    <section class="app-section" aria-labelledby="about-edu">
        <h4 class="app-section__title" id="about-edu">Education</h4>
        <?php if ($education): ?>
            <ul class="entry-list">
                <?php foreach ($education as $item): ?>
                    <li class="entry">
                        <p class="entry__title"><?= or_ph($item['program'] ?? '', 'Program') ?></p>
                        <p class="entry__meta"><?= or_ph($item['school'] ?? '', 'School') ?> · <?= or_ph($item['period'] ?? '', 'Years') ?></p>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php else: ?>
            <ul class="entry-list"><li class="entry">
                <p class="entry__title"><?= ph('Program or degree') ?></p>
                <p class="entry__meta"><?= ph('School') ?> · <?= ph('Years') ?></p>
            </li></ul>
        <?php endif; ?>
    </section>

    <section class="app-section" aria-labelledby="about-interests">
        <h4 class="app-section__title" id="about-interests">Interests</h4>
        <ul class="chip-list">
            <?php foreach ($interests as $interest): ?>
                <li class="chip"><?= e($interest) ?></li>
            <?php endforeach; ?>
            <?php if (!$interests): ?><li class="chip is-placeholder">[Interest]</li><li class="chip is-placeholder">[Interest]</li><li class="chip is-placeholder">[Interest]</li><?php endif; ?>
        </ul>
    </section>
</div>
