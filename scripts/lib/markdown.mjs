// Server-side Markdown rendering shared by the prerendered article pages and
// the RSS feed. It uses the same react-markdown renderer as the application:
// raw HTML is not enabled and unsafe URL protocols are removed.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';

/**
 * Render a Markdown string to static HTML.
 * @param {string} markdown
 * @param {{ origin?: string }} [options] When `origin` is set, root-relative
 *   URLs ("/blog/x/") become absolute, as feed readers require.
 * @returns {string}
 */
export const renderMarkdown = (markdown, { origin } = {}) =>
  renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        urlTransform: (url) => {
          const safe = defaultUrlTransform(url);
          return origin && safe.startsWith('/') && !safe.startsWith('//') ? `${origin}${safe}` : safe;
        },
      },
      markdown,
    ),
  );
