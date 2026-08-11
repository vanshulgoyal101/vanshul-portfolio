/**
 * Pure builder for the XML sitemap. Side-effect-free (no fs/env) so it can be
 * unit-tested with fixtures; the generate-sitemap script handles I/O.
 */
import { byDateDesc, localCalendarDate, escapeXml } from './seo.mjs';

/**
 * Build a Google-compatible urlset (with an image sitemap per post).
 * Includes the homepage, the /blog hub, and every post — each with a
 * `<lastmod>` derived from the newest/own post date.
 * @param {Array<Record<string, unknown>>} posts  Parsed post frontmatter
 * @param {{ site: string }} opts
 * @returns {string} sitemap XML
 */
export const buildSitemap = (posts, { site }) => {
  const ordered = [...posts].filter((p) => p.slug).sort(byDateDesc);
  const newest = ordered[0]?.date;
  const newestMod = localCalendarDate(newest);

  const urls = [
    { loc: `${site}/`, priority: '1.0', changefreq: 'weekly', lastmod: newestMod },
    { loc: `${site}/blog`, priority: '0.9', changefreq: 'weekly', lastmod: newestMod },
    { loc: `${site}/reading-list`, priority: '0.6', changefreq: 'yearly' },
    ...ordered.map((p) => ({
      loc: `${site}/blog/${p.slug}`,
      lastmod: localCalendarDate(p.date),
      priority: '0.8',
      changefreq: 'monthly',
      image: `${site}/og/${p.slug}.png`,
      title: p.title,
    })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>` +
        (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
        (u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : '') +
        `<priority>${u.priority}</priority>` +
        (u.image
          ? `<image:image><image:loc>${u.image}</image:loc><image:title>${escapeXml(u.title)}</image:title></image:image>`
          : '') +
        `</url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
};
