/**
 * Create DOM element
 * @param tag
 * @param attrs
 * @param content
 */
export const e = <T extends HTMLElement>(
    tag: string,
    attrs: Record<string, string | number | boolean | (<E extends Event>(this: T, event: E) => unknown)> = null,
    content: string | HTMLElement | HTMLElement[] = null,
): T => {
    const node = document.createElement(tag) as T;

    attrs && Object.keys(attrs).forEach(name => {
        const isEvent = name.startsWith('on');

        if (isEvent) {
            node.addEventListener(name.substring(2).toLowerCase(), attrs[name] as (event: Event) => never);
        } else {
            node.setAttribute(name, attrs[name] as string);
        }
    });

    if (content) {
        if (typeof content === 'string') {
            node.textContent = content;
        } else if ('nodeType' in content && content.nodeType) {
            node.appendChild(content)
        } else if (Array.isArray(content)) {
            content.forEach(child => node.appendChild(child));
        }
    }

    return node;
};
