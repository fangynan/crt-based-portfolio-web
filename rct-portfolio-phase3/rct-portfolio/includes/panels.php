<?php /* Compact device panels (cassette archive, sticky notes, printer, telephone, arcade).
 * Sits OUTSIDE <main class="page"> so the landing page can be made inert while a panel is open.
 * The host is hidden until assets/js/core/panel-manager.js opens one panel at a time.
 * Triggers are any element with data-panel-trigger="<panel id>" (see includes/scene.php).
 * To add a panel: create includes/panels/<id>.php with <section class="panel" id="panel-<id>" hidden>, require it below,
 * and add a data-panel-trigger="<id>" button. Expects $assets, $site and $portfolio from index.php. */ ?>
<div class="panel-host" data-panel-host hidden>
    <?php require __DIR__ . '/panels/cassette.php'; ?>
    <?php require __DIR__ . '/panels/note-intro.php'; ?>
    <?php require __DIR__ . '/panels/note-updates.php'; ?>
    <?php require __DIR__ . '/panels/printer.php'; ?>
    <?php require __DIR__ . '/panels/telephone.php'; ?>
    <?php require __DIR__ . '/panels/arcade.php'; ?>
</div>
