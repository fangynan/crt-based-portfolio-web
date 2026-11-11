<?php
$assets    = require __DIR__ . '/config/assets.php';
$site      = require __DIR__ . '/config/site.php';
$apps      = require __DIR__ . '/config/apps.php';
$portfolio = require __DIR__ . '/config/portfolio.php';
require __DIR__ . '/includes/helpers.php';
?>
<!DOCTYPE html>
<html lang="en">
<?php require __DIR__ . '/includes/head.php'; ?>
<body>
    <main class="page">
        <h1 class="visually-hidden">Retro device portfolio</h1>
        <?php require __DIR__ . '/includes/scene.php'; ?>
    </main>
    <?php require __DIR__ . '/includes/icons.php'; ?>
    <?php require __DIR__ . '/includes/desktop.php'; ?>
    <?php require __DIR__ . '/includes/app-templates.php'; ?>
    <?php require __DIR__ . '/includes/panels.php'; ?>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>
