import { escapeXml, escapeText } from './seo.mjs';

export const jsonLdScript = data =>
  `<script type="application/ld+json" data-route-seo>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const setMeta = (html, attr, key, value) => {
  const escaped = escapeXml(value);
  const first = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  const second = new RegExp(`(<meta\\s+content=")[^"]*("\\s+${attr}="${key}")`, 'i');
  if (first.test(html)) return html.replace(first, (_, before, after) => `${before}${escaped}${after}`);
  if (second.test(html)) return html.replace(second, (_, before, after) => `${before}${escaped}${after}`);
  return html.replace('</head>', () => `<meta ${attr}="${key}" content="${escaped}" />\n</head>`);
};

export const setTitle = (html, title) =>
  html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeText(title)}</title>`);

export const setCanonical = (html, url) =>
  html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, (_, before, after) => `${before}${escapeXml(url)}${after}`);
