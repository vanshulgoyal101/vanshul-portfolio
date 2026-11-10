import { SITE_URL } from '../constants/siteConfig';

const SITE_HOST = new URL(SITE_URL).hostname;

/**
 * Decide how a link inside an article opens. In-page anchors and links to this
 * site stay in the app; other web links open in a new tab; anything else
 * (mailto:, tel:, relative paths) is left to the browser.
 *
 * @param {string | undefined} href
 * @returns {{ kind: 'anchor' | 'internal' | 'external' | 'other', href: string }}
 *   For `internal`, `href` is the root-relative path to route to.
 */
export const classifyLink = (href = '') => {
  if (href.startsWith('#')) return { kind: 'anchor', href };
  if (href.startsWith('/') && !href.startsWith('//')) return { kind: 'internal', href };

  let url;
  try {
    // Protocol-relative links (//host/path) use the page's https scheme.
    url = new URL(href.startsWith('//') ? `https:${href}` : href);
  } catch {
    return { kind: 'other', href };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { kind: 'other', href };
  if (url.hostname.replace(/^www\./, '') === SITE_HOST) {
    return { kind: 'internal', href: `${url.pathname}${url.search}${url.hash}` };
  }
  return { kind: 'external', href };
};
