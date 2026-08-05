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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogsDir = join(root, 'src', 'blogs');
const distDir = join(root, 'dist');

const template = readFileSync(join(distDir, 'index.html'), 'utf8');

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

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
  const publishedISO = Number.isNaN(new Date(post.date).getTime())
    ? undefined
    : new Date(post.date).toISOString();
  const readMinutes = parseInt(post.readTime, 10);

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
  ]
    .filter(Boolean)
    .join('\n  ');

  const jsonLd = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: desc,
      image: [ogImage],
      inLanguage: 'en',
      ...(publishedISO ? { datePublished: publishedISO, dateModified: publishedISO } : {}),
      ...(Number.isFinite(readMinutes) ? { timeRequired: `PT${readMinutes}M` } : {}),
      ...(post.wordCount ? { wordCount: post.wordCount } : {}),
      ...(post.category ? { articleSection: post.category, keywords: post.category } : {}),
      author: {
        '@type': 'Person',
        name: AUTHOR_NAME,
        url: SITE,
        sameAs: AUTHOR_SAME_AS,
      },
      publisher: {
        '@type': 'Person',
        name: AUTHOR_NAME,
        url: SITE,
        image: `${SITE}/og-image.png`,
      },
      mainEntityOfPage: canonical,
      url: canonical,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/#blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ],
    },
  ]).replace(/</g, '\\u003c');

  html = html.replace(
    '</head>',
    `  ${articleTags}\n  <script type="application/ld+json">${jsonLd}</script></head>`
  );
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

console.log(`Prerendered ${posts.length} blog meta shells into dist/blog/.`);
