/* App content registry: app id -> render(contentEl, app).
 * Markup for each app lives in includes/apps/<id>.php (data from config/portfolio.php);
 * this file only maps ids to renderers and adds behaviour where an app needs it. */

import { templateRenderer } from './template.js';
import { renderPlaceholder } from './placeholder.js';
import { enhanceSettings } from './settings.js';

const renderers = {
    about: templateRenderer(),
    resume: templateRenderer(),
    projects: templateRenderer(),
    skills: templateRenderer(),
    contact: templateRenderer(),
    settings: templateRenderer(enhanceSettings),
};

export function getRenderer(id) {
    return renderers[id] ?? renderPlaceholder;
}
