<?php /* Settings. Every control is wired to assets/js/core/settings.js by data-setting; nothing here is decorative. */ ?>
<div class="app app--settings">
    <header>
        <h3 class="app-heading">Settings</h3>
        <p class="app-note">Saved in this browser. They apply to the computer desktop only.</p>
    </header>

    <section class="app-section" aria-labelledby="set-sound">
        <h4 class="app-section__title" id="set-sound">Sound</h4>
        <label class="switch">
            <input type="checkbox" role="switch" data-setting="sound">
            <span class="switch__track" aria-hidden="true"></span>
            <span class="switch__text">Interface sounds<small>Short beeps when windows open and close. Off by default.</small></span>
        </label>
    </section>

    <section class="app-section" aria-labelledby="set-theme">
        <h4 class="app-section__title" id="set-theme">Theme</h4>
        <fieldset class="segmented">
            <legend class="visually-hidden">Theme</legend>
            <label><input type="radio" name="theme" value="system" data-setting="theme"><span>System</span></label>
            <label><input type="radio" name="theme" value="light" data-setting="theme"><span>Light</span></label>
            <label><input type="radio" name="theme" value="dark" data-setting="theme"><span>Dark</span></label>
        </fieldset>
    </section>

    <section class="app-section" aria-labelledby="set-display">
        <h4 class="app-section__title" id="set-display">Display</h4>
        <p class="setting-label" id="set-text-size">Text size in windows</p>
        <fieldset class="segmented" aria-labelledby="set-text-size">
            <label><input type="radio" name="textSize" value="small" data-setting="textSize"><span>Small</span></label>
            <label><input type="radio" name="textSize" value="default" data-setting="textSize"><span>Default</span></label>
            <label><input type="radio" name="textSize" value="large" data-setting="textSize"><span>Large</span></label>
        </fieldset>

        <p class="setting-label" id="set-wallpaper">Wallpaper</p>
        <fieldset class="segmented" aria-labelledby="set-wallpaper">
            <label><input type="radio" name="wallpaper" value="dots" data-setting="wallpaper"><span>Dotted</span></label>
            <label><input type="radio" name="wallpaper" value="plain" data-setting="wallpaper"><span>Plain</span></label>
        </fieldset>

        <label class="switch">
            <input type="checkbox" role="switch" data-setting="reduceMotion">
            <span class="switch__track" aria-hidden="true"></span>
            <span class="switch__text">Reduce motion<small>Skips the boot animation and window transitions. Starts from your system setting.</small></span>
        </label>
    </section>

    <button type="button" class="btn" data-action="reset-settings">Reset to defaults</button>
</div>
