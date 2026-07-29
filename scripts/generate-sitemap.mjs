#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the blog markdown files so search engines
 * can discover every post. Runs automatically before `npm run build` via the
 * `prebuild` script.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://vanshul.com';
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
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

const posts = readdirSync(blogsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseFrontmatter(readFileSync(join(blogsDir, f), 'utf8')))
  .filter((p) => p.slug)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const urls = [
  { loc: `${SITE}/`, priority: '1.0' },
  ...posts.map((p) => ({
    loc: `${SITE}/blog/${p.slug}`,
    lastmod: isoDate(p.date),
    priority: '0.8',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(`Wrote public/sitemap.xml with ${urls.length} URLs (${posts.length} posts).`);
