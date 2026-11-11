/* Renders an app from its server-side <template> (includes/apps/<id>.php).
 * The optional enhance(container, app) adds behaviour; it may return a cleanup function,
 * which the window manager calls when the window closes. */

import { renderPlaceholder } from './placeholder.js';

export function templateRenderer(enhance) {
    return (container, app) => {
        const template = document.querySelector(`template[data-app-content="${app.id}"]`);
        if (!template) { renderPlaceholder(container, app); return undefined; }
        container.replaceChildren(template.content.cloneNode(true));
        return enhance ? enhance(container, app) : undefined;
    };
}
