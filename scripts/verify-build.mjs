import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { BOOKS, ESSAYS, SHELF_ITEMS } from '../src/constants/books.js';
import { READING_LIST_PATH, absoluteUrl } from '../src/constants/routes.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY } from '../src/constants/projects.js';
import { EXPERIENCE } from '../src/constants/experience.js';

const dist = new URL('../dist/', import.meta.url);
// Heavy or single-route code must stay lazy: no page may fetch these before
// first paint (see the manualChunks notes in documentation/config.md).
const LAZY_ONLY_CHUNKS = /\/assets\/(three-core|three-react|markdown|supabase|Dashboard|HeroScene)-/;
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
  assert(document.querySelector('#root main')?.textContent.trim().length > 100, `Missing readable static content for ${url}`);
  assert.equal(document.querySelectorAll('h1').length, 1, `Expected one main heading for ${url}`);
  for (const selector of ['title', 'meta[name="description"]', 'meta[name="robots"]', 'link[rel="canonical"]', 'meta[property="og:url"]', 'meta[name="twitter:url"]']) {
    assert.equal(document.querySelectorAll(selector).length, 1, `Duplicate or missing ${selector} for ${url}`);
  }
  assert.equal(document.querySelector('meta[property="og:url"]').content, url);
  assert.equal(document.querySelector('meta[name="twitter:url"]').content, url);
  assert(!document.querySelector('meta[name="robots"]').content.includes('noindex'), `Public route marked noindex: ${url}`);
  const image = new URL(document.querySelector('meta[property="og:image"]').content);
  assert.equal(image.origin, SITE_URL);
  assert(existsSync(new URL(image.pathname.slice(1), dist)), `Missing social image: ${image}`);
  const schemaTypes = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap(script => [JSON.parse(script.textContent)].flat())
    .flatMap(schema => schema['@graph'] ?? [schema])
    .map(schema => schema['@type']);
  // The ProfilePage describes the homepage; any other page claiming it would
  // contradict that page's canonical URL.
  assert.equal(schemaTypes.includes('ProfilePage'), route.pathname === '/', `ProfilePage scope is wrong for ${url}`);
  if (route.pathname.startsWith('/blog/') && route.pathname !== '/blog/') {
    assert(schemaTypes.includes('BlogPosting'), `Missing BlogPosting for ${url}`);
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
console.log(`Verified ${urls.length} published routes, their canonical URLs and the ${feedLinks.length}-item feed.`);