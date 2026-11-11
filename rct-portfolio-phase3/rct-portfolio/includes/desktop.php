<?php /* Simulated desktop overlay. Expects $apps from index.php.
 * Sits OUTSIDE <main class="page"> so the landing page can be made inert while it is open.
 * Starts hidden; assets/js/modules/desktop.js opens, boots and shuts it down.
 * Windows are created by JS inside [data-window-layer]; the taskbar's open-app buttons likewise. */ ?>
<div class="desktop" id="desktop" role="dialog" aria-modal="true" aria-label="Computer desktop" tabindex="-1" data-state="closed" hidden>
    <p class="visually-hidden" role="status" data-desktop-status></p>

    <div class="desktop__workspace">
        <nav class="desktop__shortcuts" aria-label="Desktop shortcuts">
            <ul>
                <?php foreach ($apps as $app): ?>
                    <li>
                        <button type="button" class="shortcut"
                                data-app="<?= htmlspecialchars($app['id'], ENT_QUOTES) ?>"
                                data-title="<?= htmlspecialchars($app['title'], ENT_QUOTES) ?>"
                                data-icon="<?= htmlspecialchars($app['icon'], ENT_QUOTES) ?>"
                                data-width="<?= (int) $app['width'] ?>"
                                data-height="<?= (int) $app['height'] ?>">
                            <span class="shortcut__tile"><svg class="icon" aria-hidden="true"><use href="#icon-<?= htmlspecialchars($app['icon'], ENT_QUOTES) ?>"/></svg></span>
                            <span class="shortcut__label"><?= htmlspecialchars($app['title']) ?></span>
                        </button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>

        <div class="desktop__windows" data-window-layer data-layout="floating"></div>
    </div>

    <footer class="taskbar">
        <button type="button" class="taskbar__shutdown" data-action="shutdown" aria-label="Shut down computer" title="Shut down">
            <svg class="icon" aria-hidden="true"><use href="#icon-power"/></svg>
            <span class="taskbar__shutdown-label">Shut down</span>
        </button>
        <div class="taskbar__apps" role="toolbar" aria-label="Open applications" data-taskbar-apps></div>
        <div class="taskbar__clock">
            <span class="taskbar__time" data-clock-time>--:--:--</span>
            <span class="taskbar__date">
                <span class="taskbar__date--full" data-clock-date-full></span>
                <span class="taskbar__date--short" data-clock-date-short></span>
            </span>
        </div>
    </footer>

    <div class="boot" aria-hidden="true">
        <div class="boot__panel">
            <p class="boot__text" data-boot-text>Starting up</p>
            <div class="boot__bar"><span></span></div>
        </div>
    </div>
</div>
