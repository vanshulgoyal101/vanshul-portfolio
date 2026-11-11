import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { BOOKS, ESSAYS, SHELF_ITEMS } from '../src/constants/books.js';
import { BLOG_PATH, READING_LIST_PATH, absoluteUrl } from '../src/constants/routes.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY } from '../src/constants/projects.js';
import { EXPERIENCE, EARLIER_EXPERIENCE } from '../src/constants/experience.js';
import { INDEXNOW_KEY } from './lib/indexnow.mjs';

const dist = new URL('../dist/', import.meta.url);
// Heavy or single-route code must stay lazy: no page may fetch these before
// first paint (see the manualChunks notes in documentation/config.md).
const LAZY_ONLY_CHUNKS = /\/assets\/(three-core|three-react|markdown|supabase|Dashboard|HeroScene)-/;
// First-load budget: the gzipped JS and CSS a published page fetches before it
// can render (187 KB in November 2026). Raise it only for a deliberate change.
const FIRST_LOAD_BUDGET_KB = 205;
const gzipKb = path => gzipSync(readFileSync(new URL(path.slice(1), dist))).length / 1024;
let heaviestFirstLoadKb = 0;
const pageTitles = new Map();
const pageDescriptions = new Map();
const sitemap = new JSDOM(readFileSync(new URL('sitemap.xml', dist), 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('url > loc')].map(element => element.textContent);
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
assert(!urls.some(url => url.includes('/dashboard')), 'Private dashboard must not be in the sitemap');
assert(urls.includes(absoluteUrl(READING_LIST_PATH)), 'Reading list must appear in the published sitemap');
for (const url of urls) {
  const route = new URL(url);
  assert.equal(route.origin, SITE_URL);
  // GitHub Pages redirects slash-less directory URLs, so a published URL must
  // be the final form: the root or a path ending in `/`.
  assert(route.pathname.endsWith('/') && !route.search && !route.hash, `Published URL would redirect: ${url}`);
  const path = route.pathname.replace(/^\/+|\/+$/g, '');
  const file = new URL(path ? `${path}/index.html` : 'index.html', dist);
  const document = new JSDOM(readFileSync(fileURLToPath(file), 'utf8')).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), url, `Canonical mismatch for ${url}`);
  assert(document.querySelector('#root'), `Missing app root for ${url}`);
  const eager = [...document.querySelectorAll('script[src], link[rel="modulepreload"]')]
    .map(element => element.getAttribute('src') ?? element.getAttribute('href'));
  assert(eager.length > 0, `No entry script for ${url}`);
  assert.deepEqual(eager.filter(src => LAZY_ONLY_CHUNKS.test(src)), [], `Lazy-only chunk loaded eagerly by ${url}`);
  const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"][href^="/assets/"]')].map(element => element.getAttribute('href'));
  const firstLoadKb = [...eager, ...stylesheets].reduce((total, src) => total + gzipKb(src), 0);
  assert(firstLoadKb <= FIRST_LOAD_BUDGET_KB, `${url} loads ${firstLoadKb.toFixed(1)} KB of gzipped JS/CSS up front; the budget is ${FIRST_LOAD_BUDGET_KB} KB`);
  heaviestFirstLoadKb = Math.max(heaviestFirstLoadKb, firstLoadKb);
  // Fonts are self-hosted: preloads must resolve and no font CDN may return.
  const fontPreloads = [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(element => element.getAttribute('href'));
  assert(fontPreloads.length > 0, `No font preloads for ${url}`);
  for (const href of fontPreloads) assert(existsSync(new URL(href.slice(1), dist)), `Preloaded font ${href} is missing from dist`);
  assert(!document.querySelector('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]'), `Third-party font request in ${url}`);
  assert(document.querySelector('#root main')?.textContent.trim().length > 100, `Missing readable static content for ${url}`);
  assert.equal(document.querySelectorAll('h1').length, 1, `Expected one main heading for ${url}`);
  for (const selector of ['title', 'meta[name="description"]', 'meta[name="robots"]', 'link[rel="canonical"]', 'meta[property="og:url"]', 'meta[name="twitter:url"]']) {
    assert.equal(document.querySelectorAll(selector).length, 1, `Duplicate or missing ${selector} for ${url}`);
  }
  // Every published page needs its own title and description to stand apart in results.
  const description = document.querySelector('meta[name="description"]').content.trim();
  assert(document.title.trim() && description, `Empty title or description for ${url}`);
  assert(!pageTitles.has(document.title), `${url} repeats the title of ${pageTitles.get(document.title)}`);
  assert(!pageDescriptions.has(description), `${url} repeats the description of ${pageDescriptions.get(description)}`);
  pageTitles.set(document.title, url);
  pageDescriptions.set(description, url);
  assert.equal(document.querySelector('meta[property="og:url"]').content, url);
  assert.equal(document.querySelector('meta[name="twitter:url"]').content, url);
  assert(!document.querySelector('meta[name="robots"]').content.includes('noindex'), `Public route marked noindex: ${url}`);
  const image = new URL(document.querySelector('meta[property="og:image"]').content);
  assert.equal(image.origin, SITE_URL);
  assert(existsSync(new URL(image.pathname.slice(1), dist)), `Missing social image: ${image}`);
  const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap(script => [JSON.parse(script.textContent)].flat())
    .flatMap(schema => schema['@graph'] ?? [schema]);
  const schemaTypes = schemas.map(schema => schema['@type']);
  // The ProfilePage describes the homepage; any other page claiming it would
  // contradict that page's canonical URL.
  assert.equal(schemaTypes.includes('ProfilePage'), route.pathname === '/', `ProfilePage scope is wrong for ${url}`);
  if (route.pathname.startsWith('/blog/') && route.pathname !== '/blog/') {
    assert(schemaTypes.includes('BlogPosting'), `Missing BlogPosting for ${url}`);
    // Structured data and Open Graph must agree on when the post was published and last changed.
    const posting = schemas.find(schema => schema['@type'] === 'BlogPosting');
    const published = document.querySelector('meta[property="article:published_time"]')?.content;
    const modified = document.querySelector('meta[property="article:modified_time"]')?.content;
    assert(published && modified, `Missing article dates for ${url}`);
    assert.equal(posting.datePublished, published, `datePublished disagrees with article:published_time for ${url}`);
    assert.equal(posting.dateModified, modified, `dateModified disagrees with article:modified_time for ${url}`);
    assert(modified >= published, `Article modified before it was published: ${url}`);
  }
  for (const anchor of document.querySelectorAll('#root a[href^="/"]')) {
    const target = new URL(anchor.getAttribute('href'), SITE_URL);
    assert(urls.includes(`${target.origin}${target.pathname}`), `Internal link ${target} in ${url} is not a published URL`);
  }
  assert(!document.title.includes('Redirecting'), `Fallback shell for ${url}`);
  for (const anchor of document.querySelectorAll('#root a[href^="#"]')) {
    assert(document.getElementById(anchor.getAttribute('href').slice(1)), `Broken in-page link ${anchor.getAttribute('href')} in ${url}`);
  }
  if (route.pathname === '/') {
    const text = document.querySelector('#root main').textContent;
    const expected = [
      ...FEATURED_PROJECTS.map(project => project.title),
      ...PROJECT_DIRECTORY.flatMap(group => group.items.map(item => item.title)),
      ...EXPERIENCE.map(job => job.title),
      ...EARLIER_EXPERIENCE.flatMap(role => [role.title, role.company]),
    ];
    for (const phrase of expected) assert(text.includes(phrase), `Homepage static content is missing "${phrase}"`);
  }
  if (path === 'reading-list') {
    assert(document.title.startsWith('Reading List'));
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(element => JSON.parse(element.textContent));
    const shelf = schemas.find(schema => schema['@type'] === 'ItemList');
    assert.equal(shelf?.numberOfItems, SHELF_ITEMS.length);
    assert.deepEqual(shelf.itemListElement.map(entry => entry.item.name), SHELF_ITEMS.map(item => item.title));
    assert.equal(shelf.itemListElement.filter(entry => entry.item['@type'] === 'Book').length, BOOKS.length);
    assert.deepEqual(shelf.itemListElement.filter(entry => entry.item['@type'] === 'Article').map(entry => entry.item.url), ESSAYS.map(essay => essay.url));
  }
}
const feed = new JSDOM(readFileSync(new URL('feed.xml', dist), 'utf8'), { contentType: 'text/xml' }).window.document;
assert.equal(feed.querySelector('parsererror'), null, 'feed.xml must be well-formed XML');
const feedLinks = [...feed.querySelectorAll('item > link')].map(element => element.textContent);
const articleUrls = urls.filter(url => /\/blog\/[^/]+\/$/.test(new URL(url).pathname));
assert.deepEqual([...feedLinks].sort(), [...articleUrls].sort(), 'Feed items must match the published articles');
for (const item of feed.querySelectorAll('item')) {
  assert(item.getElementsByTagName('content:encoded')[0]?.textContent.trim().length > 100, 'Feed items must carry full article HTML');
}
const fontUrls = readdirSync(new URL('assets/', dist))
  .filter(file => file.endsWith('.css'))
  .flatMap(file => [...readFileSync(new URL(`assets/${file}`, dist), 'utf8').matchAll(/url\(["']?(\/fonts\/[^"')]+)["']?\)/g)].map(match => match[1]));
assert(fontUrls.length > 0, 'Built CSS must declare the self-hosted fonts');
for (const href of fontUrls) assert(existsSync(new URL(href.slice(1), dist)), `@font-face source ${href} is missing from dist`);
// Search engines fetch this file to accept IndexNow submissions for the site.
const indexNowKeyFile = new URL(`${INDEXNOW_KEY}.txt`, dist);
assert(existsSync(indexNowKeyFile) && readFileSync(indexNowKeyFile, 'utf8') === INDEXNOW_KEY, 'dist must serve the IndexNow key file at the site root');
const llmsFile = new URL('llms.txt', dist);
assert(existsSync(llmsFile), 'Missing dist/llms.txt');
const llms = readFileSync(llmsFile, 'utf8');
assert(llms.startsWith('# '), 'llms.txt must start with an H1 title');
for (const url of [absoluteUrl(BLOG_PATH), ...articleUrls]) {
  // Match the whole link target: the archive URL is a prefix of every article URL.
  assert(llms.includes(`](${url})`), `llms.txt must link to ${url}`);
}
console.log(`Verified ${urls.length} published routes, their canonical URLs, ${fontUrls.length} font sources, the ${feedLinks.length}-item feed and llms.txt; heaviest first load ${heaviestFirstLoadKb.toFixed(1)} of ${FIRST_LOAD_BUDGET_KB} KB.`);