#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the blog markdown files so search engines
 * can discover the homepage, the /blog hub, and every post. Runs automatically
 * before `npm run build` via the `prebuild` script. The XML shape lives in
 * scripts/lib/sitemap.mjs (pure + unit-tested); this file just does I/O.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL as SITE } from '../src/constants/siteConfig.js';
import { parseFrontmatter } from './lib/seo.mjs';
import { buildSitemap } from './lib/sitemap.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogsDir = join(root, 'src', 'blogs');

const posts = readdirSync(blogsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseFrontmatter(readFileSync(join(blogsDir, f), 'utf8')))
  .filter((p) => p.slug);

const xml = buildSitemap(posts, { site: SITE });

writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(
  `Wrote public/sitemap.xml with ${posts.length + 2} URLs (${posts.length} posts + home + /blog).`,
);

