/**
 * Pure builder for the XML sitemap. Side-effect-free (no fs/env) so it can be
 * unit-tested with fixtures; the generate-sitemap script handles I/O.
 */
import { byDateDesc, postDate, postLastModified, escapeXml } from './seo.mjs';
import { HOME_PATH, BLOG_PATH, READING_LIST_PATH, postPath, projectPath, absoluteUrl } from '../../src/constants/routes.js';
import { PROJECT_PAGES } from '../../src/constants/projectStories.js';

/**
 * Build a Google-compatible urlset (with an image sitemap per post).
 * Includes the homepage, the /blog hub, the reading list, every featured
 * project's story page (with its image) and every post. A post's `<lastmod>`
 * is its `updated` date, else its publication date; the homepage and the hub
 * take the most recent of those, since both list the posts.
 * @param {Array<Record<string, unknown>>} posts  Parsed post frontmatter
 * @param {{ site: string, projects?: typeof PROJECT_PAGES }} opts
 *   `projects` defaults to the published project pages; project pages carry
 *   no `<lastmod>` because the data has no reliable change date.
 * @returns {string} sitemap XML
 */
export const buildSitemap = (posts, { site, projects = PROJECT_PAGES }) => {
  const ordered = [...posts].filter((p) => p.slug).sort(byDateDesc);
  const lastmod = (post) => postDate(postLastModified(post));
  // ISO dates sort chronologically as strings.
  const newestMod = ordered.map(lastmod).filter(Boolean).sort().pop();

  const urls = [
    { loc: absoluteUrl(HOME_PATH, site), priority: '1.0', changefreq: 'weekly', lastmod: newestMod },
    { loc: absoluteUrl(BLOG_PATH, site), priority: '0.9', changefreq: 'weekly', lastmod: newestMod },
    { loc: absoluteUrl(READING_LIST_PATH, site), priority: '0.6', changefreq: 'yearly' },
    ...projects.map((project) => ({
      loc: absoluteUrl(projectPath(project.id), site),
      priority: '0.7',
      changefreq: 'monthly',
      image: `${site}${project.image}`,
      title: project.title,
    })),
    ...ordered.map((p) => ({
      loc: absoluteUrl(postPath(p.slug), site),
      lastmod: lastmod(p),
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
          ? `<image:image><image:loc>${escapeXml(u.image)}</image:loc><image:title>${escapeXml(u.title)}</image:title></image:image>`
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
