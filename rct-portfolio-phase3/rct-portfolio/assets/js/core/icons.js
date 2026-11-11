/* Builds <svg class="icon"><use href="#icon-NAME"/></svg> from the sprite in includes/icons.php. */

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createIcon(name) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', `#icon-${name}`);
    svg.appendChild(use);
    return svg;
}
