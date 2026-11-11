/* Stand-in content shown until an app's real content is built in a later phase. */

export function renderPlaceholder(container, app) {
    const wrap = document.createElement('div');
    wrap.className = 'app-placeholder';

    const tag = document.createElement('p');
    tag.className = 'app-placeholder__tag';
    tag.textContent = 'Placeholder';

    const heading = document.createElement('h3');
    heading.textContent = app.title;

    const note = document.createElement('p');
    note.textContent = 'This window is a stand-in. The real content for this app is built in a later phase.';

    wrap.append(tag, heading, note);
    container.replaceChildren(wrap);
}
