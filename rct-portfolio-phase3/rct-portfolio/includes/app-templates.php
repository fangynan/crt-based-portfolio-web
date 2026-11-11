<?php /* One <template> per desktop app, cloned into a window by assets/js/apps/template.js.
 * To add an app: add it to config/apps.php, create includes/apps/<id>.php, register it in assets/js/apps/index.js.
 * Expects $apps, $assets, $site and $portfolio from index.php. */ ?>
<?php foreach ($apps as $app): ?>
    <?php $file = __DIR__ . '/apps/' . $app['id'] . '.php'; ?>
    <?php if (is_file($file)): ?>
        <template data-app-content="<?= e($app['id']) ?>"><?php require $file; ?></template>
    <?php endif; ?>
<?php endforeach; ?>
