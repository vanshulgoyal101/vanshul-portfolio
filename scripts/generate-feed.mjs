#!/usr/bin/env node
/**
 * Generates public/feed.xml (RSS 2.0) from the blog markdown files so readers
 * and aggregators can subscribe. Runs in `prebuild`.
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

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const rfc822 = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toUTCString();
};

const posts = readdirSync(blogsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseFrontmatter(readFileSync(join(blogsDir, f), 'utf8')))
  .filter((p) => p.slug && p.title)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const lastBuild = posts.length ? rfc822(posts[0].date) : rfc822(new Date());

const items = posts
  .map((p) => {
    const url = `${SITE}/blog/${p.slug}`;
    const pubDate = rfc822(p.date);
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      ${p.category ? `<category>${esc(p.category)}</category>` : ''}
      <description>${esc(p.summary || '')}</description>
    </item>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vanshul Goyal — Blog</title>
    <link>${SITE}/#blog</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Writing on AI, the future of work, technology and space by Vanshul Goyal.</description>
    <language>en</language>
    ${lastBuild ? `<lastBuildDate>${lastBuild}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`;

writeFileSync(join(root, 'public', 'feed.xml'), xml);
console.log(`Wrote public/feed.xml with ${posts.length} items.`);
