#!/usr/bin/env node
/**
 * Post-build: writes a static dist/blog/<slug>/index.html per post with that
 * post's title/description/canonical/OG/Twitter tags and JSON-LD baked in, so
 * non-JS crawlers (and social scrapers) get real per-post metadata. The SPA
 * still boots from these shells and renders the post normally.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL as SITE, AUTHOR_NAME, AUTHOR_SAME_AS } from '../src/constants/siteConfig.js';
import { readPosts, byDateDesc, escapeXml as escAttr, escapeText as escText, parseTags, postPublishedAt } from './lib/seo.mjs';
import { prerenderContent } from './lib/prerenderContent.mjs';
import { postJsonLd, blogIndexJsonLd, homeJsonLd } from './lib/structuredData.mjs';
import { PROFILE } from '../src/constants/profile.js';
import { READING_LIST_DESCRIPTION, READING_LIST_JSON_LD } from '../src/constants/readingListSeo.js';
import { BLOG_INDEX_DESCRIPTION } from '../src/constants/blogConstants.js';
import { BLOG_PATH, READING_LIST_PATH, postPath, absoluteUrl } from '../src/constants/routes.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogsDir = join(root, 'src', 'blogs');
const distDir = join(root, 'dist');

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
const identity = { site: SITE, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS };

// Serialize JSON-LD for safe inline embedding (escape `<` to avoid closing the
// script element early).
const jsonLdScript = (data) =>
  `<script type="application/ld+json" data-route-seo>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

// Replace a <meta ... content="..."> value, tolerant of attribute order.
const setMeta = (html, attr, key, value) => {
  const v = escAttr(value);
  const a = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (a.test(html)) return html.replace(a, `$1${v}$2`);
  const b = new RegExp(`(<meta\\s+content=")[^"]*("\\s+${attr}="${key}")`, 'i');
  return html.replace(b, `$1${v}$2`);
};

const buildShell = (post) => {
  const canonical = absoluteUrl(postPath(post.slug));
  const ogImage = `${SITE}/og/${post.slug}.png`;
  const title = `${post.title} — Vanshul Goyal`;
  const desc = post.summary || '';
  const publishedISO = postPublishedAt(post.date);
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
  const canonical = absoluteUrl(path);
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

const posts = readPosts(blogsDir).sort(byDateDesc);
const withContent = (html, options) => html.replace('<div id="root"></div>', () => `<div id="root">${prerenderContent({ ...options, posts })}</div>`);

// Only the homepage carries the WebSite/Person/ProfilePage graph; the other
// shells are built from the untouched template.
const homeShell = template.replace('</head>', `  ${jsonLdScript(homeJsonLd({ ...identity, profile: PROFILE }))}</head>`);
writeFileSync(join(distDir, 'index.html'), withContent(homeShell));

for (const post of posts) {
  const dir = join(distDir, 'blog', post.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), withContent(buildShell(post), { post }));
}

// The /blog listing shell (dist/blog/index.html) — a real file, so GitHub Pages
// serves it directly instead of the SPA 404 fallback.
mkdirSync(join(distDir, 'blog'), { recursive: true });
const blogTitle = `Blog — ${AUTHOR_NAME}`;
writeFileSync(join(distDir, 'blog', 'index.html'), withContent(buildPageShell({
  path: BLOG_PATH,
  title: blogTitle,
  description: BLOG_INDEX_DESCRIPTION,
  jsonLd: blogIndexJsonLd(posts, { ...identity, title: blogTitle, description: BLOG_INDEX_DESCRIPTION }),
}), { page: 'blog' }));

mkdirSync(join(distDir, 'reading-list'), { recursive: true });
writeFileSync(join(distDir, 'reading-list', 'index.html'), withContent(buildPageShell({
  path: READING_LIST_PATH,
  title: `Reading List — ${AUTHOR_NAME}`,
  description: READING_LIST_DESCRIPTION,
  jsonLd: READING_LIST_JSON_LD,
}), { page: 'reading-list' }));

console.log(`Prerendered ${posts.length} posts, blog index, and reading list.`);
