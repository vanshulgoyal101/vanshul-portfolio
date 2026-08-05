#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the blog markdown files so search engines
 * can discover every post. Runs automatically before `npm run build` via the
 * `prebuild` script.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL as SITE } from '../src/constants/siteConfig.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogsDir = join(root, 'src', 'blogs');

const parseFrontmatter = (md) => {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) {
        data[line.slice(0, i).trim()] = line
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }
  }
  return data;
};

const isoDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  // Use local date parts so the output matches the human-written date regardless
  // of the runner's timezone (avoids a UTC off-by-one between local and CI).
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const posts = readdirSync(blogsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseFrontmatter(readFileSync(join(blogsDir, f), 'utf8')))
  .filter((p) => p.slug)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const urls = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly' },
  ...posts.map((p) => ({
    loc: `${SITE}/blog/${p.slug}`,
    lastmod: isoDate(p.date),
    priority: '0.8',
    changefreq: 'monthly',
    // Per-post Open Graph image, surfaced to Google Images via the image sitemap.
    image: `${SITE}/og/${p.slug}.png`,
    title: p.title,
  })),
];

const escXml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>` +
      (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
      (u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : '') +
      `<priority>${u.priority}</priority>` +
      (u.image
        ? `<image:image><image:loc>${u.image}</image:loc><image:title>${escXml(u.title)}</image:title></image:image>`
        : '') +
      `</url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(`Wrote public/sitemap.xml with ${urls.length} URLs (${posts.length} posts).`);
