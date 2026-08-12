/**
 * Pure builder for the master sitemap index. Side-effect-free (no fs/env) so it
 * can be unit-tested with fixtures; gen-sitemap-index.mjs handles the I/O.
 *
 * @param {Array<string>} sites  Absolute sitemap URLs across the vanshul.com family
 * @param {{ today: string }} opts  ISO date used as <lastmod>
 * @returns {string} sitemapindex XML
 */
export const buildSitemapIndex = (sites, { today }) => {
  const entries = (sites || [])
    .filter(Boolean)
    .map(
      (loc) =>
        `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
};
