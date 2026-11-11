<?php
/* Simulated-desktop applications. One entry = one shortcut + one window.
 * id      stable key used by JS (matches assets/js/apps/index.js)
 * title   shown on the shortcut, window title bar and taskbar
 * icon    symbol id from includes/icons.php (without the "icon-" prefix)
 * width / height   preferred window size in px on desktop (auto-shrunk to fit the screen) */
return [
    ['id' => 'about',    'title' => 'About Me', 'icon' => 'user',     'width' => 540, 'height' => 480],
    ['id' => 'resume',   'title' => 'Resume',   'icon' => 'document', 'width' => 640, 'height' => 520],
    ['id' => 'projects', 'title' => 'Projects', 'icon' => 'folder',   'width' => 720, 'height' => 520],
    ['id' => 'skills',   'title' => 'Skills',   'icon' => 'star',     'width' => 560, 'height' => 460],
    ['id' => 'contact',  'title' => 'Contact',  'icon' => 'envelope', 'width' => 500, 'height' => 380],
    ['id' => 'settings', 'title' => 'Settings', 'icon' => 'sliders',  'width' => 480, 'height' => 520],
];
