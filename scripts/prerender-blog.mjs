#!/usr/bin/env node
/**
 * Post-build: writes a static dist/blog/<slug>/index.html per post with that
 * post's title/description/canonical/OG/Twitter tags and JSON-LD baked in, so
 * non-JS crawlers (and social scrapers) get real per-post metadata. The SPA
 * still boots from these shells and renders the post normally.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL as SITE, AUTHOR_NAME, AUTHOR_SAME_AS } from '../src/constants/siteConfig.js';
import { parseFrontmatter, escapeXml as escAttr, escapeText as escText, parseTags, isoDate } from './lib/seo.mjs';
import { postJsonLd, blogIndexJsonLd } from './lib/structuredData.mjs';
import { BOOKS } from '../src/constants/books.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogsDir = join(root, 'src', 'blogs');
const distDir = join(root, 'dist');

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
const identity = { site: SITE, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS };

// Serialize JSON-LD for safe inline embedding (escape `<` to avoid closing the
// script element early).
const jsonLdScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

// Replace a <meta ... content="..."> value, tolerant of attribute order.
const setMeta = (html, attr, key, value) => {
  const v = escAttr(value);
  const a = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (a.test(html)) return html.replace(a, `$1${v}$2`);
  const b = new RegExp(`(<meta\\s+content=")[^"]*("\\s+${attr}="${key}")`, 'i');
  return html.replace(b, `$1${v}$2`);
};

const buildShell = (post) => {
  const canonical = `${SITE}/blog/${post.slug}`;
  const ogImage = `${SITE}/og/${post.slug}.png`;
  const title = `${post.title} — Vanshul Goyal`;
  const desc = post.summary || '';
  const publishedISO = isoDate(post.date);
  const tags = parseTags(post.tags);

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(title)}</title>`);
  html = setMeta(html, 'name', 'description', desc);
  html = setMeta(html, 'property', 'og:type', 'article');
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', desc);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:image', ogImage);
  html = setMeta(html, 'property', 'og:image:alt', post.title);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', desc);
  html = setMeta(html, 'name', 'twitter:url', canonical);
  html = setMeta(html, 'name', 'twitter:image', ogImage);
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${canonical}$2`);

  // Article-specific Open Graph tags (not present in the base template).
  const articleTags = [
    publishedISO && `<meta property="article:published_time" content="${escAttr(publishedISO)}" />`,
    publishedISO && `<meta property="article:modified_time" content="${escAttr(publishedISO)}" />`,
    `<meta property="article:author" content="${escAttr(AUTHOR_NAME)}" />`,
    post.category && `<meta property="article:section" content="${escAttr(post.category)}" />`,
    ...tags.map((t) => `<meta property="article:tag" content="${escAttr(t)}" />`),
  ]
    .filter(Boolean)
    .join('\n  ');

  html = html.replace(
    '</head>',
    `  ${articleTags}\n  ${jsonLdScript(postJsonLd(post, identity))}</head>`,
  );
  return html;
};

// The /blog listing shell: index metadata + Blog/ItemList structured data so
// crawlers see a real content hub, not just the SPA fallback.
const buildPageShell = ({ path, title, description: desc, jsonLd }) => {
  const canonical = `${SITE}${path}`;
  const ogImage = `${SITE}/og-image.png`;

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(title)}</title>`);
  html = setMeta(html, 'name', 'description', desc);
  html = setMeta(html, 'property', 'og:type', 'website');
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', desc);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:image', ogImage);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', desc);
  html = setMeta(html, 'name', 'twitter:url', canonical);
  html = setMeta(html, 'name', 'twitter:image', ogImage);
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${canonical}$2`);

  html = html.replace('</head>', `  ${jsonLdScript(jsonLd)}</head>`);
  return html;
};

const posts = readdirSync(blogsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(join(blogsDir, f), 'utf8');
    const body = raw.replace(/^---\n[\s\S]*?\n---/, '').trim();
    const wordCount = body ? body.split(/\s+/).length : undefined;
    return { ...parseFrontmatter(raw), wordCount };
  })
  .filter((p) => p.slug && p.title);

for (const post of posts) {
  const dir = join(distDir, 'blog', post.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildShell(post));
}

// The /blog listing shell (dist/blog/index.html) — a real file, so GitHub Pages
// serves it directly instead of the SPA 404 fallback.
mkdirSync(join(distDir, 'blog'), { recursive: true });
const blogTitle = `Blog — ${AUTHOR_NAME}`;
const blogDescription = 'Essays on AI, robotics, the future of work, and technology by Vanshul Goyal — engineer at United Airlines.';
writeFileSync(join(distDir, 'blog', 'index.html'), buildPageShell({
  path: '/blog',
  title: blogTitle,
  description: blogDescription,
  jsonLd: blogIndexJsonLd([...posts].sort((first, second) => new Date(second.date) - new Date(first.date)), {
    ...identity, title: blogTitle, description: blogDescription,
  }),
}));

mkdirSync(join(distDir, 'reading-list'), { recursive: true });
writeFileSync(join(distDir, 'reading-list', 'index.html'), buildPageShell({
  path: '/reading-list',
  title: `Reading List — ${AUTHOR_NAME}`,
  description: 'From My Shelf: favourite books that shaped how I think — fiction and non-fiction, with a one-line note on each.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'From My Shelf',
    url: `${SITE}/reading-list`,
    numberOfItems: BOOKS.length,
    itemListElement: BOOKS.map((book, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: { '@type': 'Book', name: book.title, author: { '@type': 'Person', name: book.author } },
    })),
  },
}));

console.log(`Prerendered ${posts.length} posts, blog index, and reading list.`);
