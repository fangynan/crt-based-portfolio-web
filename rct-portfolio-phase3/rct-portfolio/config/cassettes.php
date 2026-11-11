<?php
/* Where the clickable tapes sit on the cassette-stack image (assets/img/cassettes.png).
 * All values are percentages of the image box. The stack art has 7 tapes of equal height.
 * Swap the artwork for a different stack? Adjust these numbers (or 'count') and nothing else.
 * Which project a tape opens is decided by its position in config/portfolio.php ('projects'): tape 1 = first project. */
return [
    'stack' => [
        'count'  => 7,
        'left'   => 6.7,     /* tape left edge   */
        'width'  => 88.0,    /* tape width       */
        'top'    => 4.14,    /* top of tape 1    */
        'height' => 12.77,   /* height of each tape */
    ],
];
