<?php /* TEMPORARY CSS remote (no remote image asset exists yet).
 * Only .remote__power is interactive; the body and keys are decoration.
 * When a real remote image arrives, swap the body for an <img> and keep the
 * .remote__power button + .remote__led positioned over it. LED colour is driven by data-power. */ ?>
<div class="remote" data-device="remote" data-power="off">
    <span class="remote__led" aria-hidden="true"></span>
    <button type="button" class="remote__power" aria-label="Power" aria-pressed="false"></button>
    <span class="remote__keys" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
</div>
