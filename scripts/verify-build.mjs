import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { BOOKS, ESSAYS, SHELF_ITEMS } from '../src/constants/books.js';

const dist = new URL('../dist/', import.meta.url);
const sitemap = new JSDOM(readFileSync(new URL('sitemap.xml', dist), 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('url > loc')].map(element => element.textContent);
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
assert(!urls.some(url => url.includes('/dashboard')), 'Private dashboard must not be in the sitemap');
assert(urls.includes(`${SITE_URL}/reading-list`), 'Reading list must appear in the published sitemap');
for (const url of urls) {
  const route = new URL(url);
  assert.equal(route.origin, SITE_URL);
  const path = route.pathname.replace(/^\/+|\/+$/g, '');
  const file = new URL(path ? `${path}/index.html` : 'index.html', dist);
  const document = new JSDOM(readFileSync(fileURLToPath(file), 'utf8')).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), url, `Canonical mismatch for ${url}`);
  assert(document.querySelector('#root'), `Missing app root for ${url}`);
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
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) JSON.parse(script.textContent);
  for (const anchor of document.querySelectorAll('#root a[href^="/"]')) {
    const target = new URL(anchor.getAttribute('href'), SITE_URL);
    const canonicalPath = target.pathname === '/' ? '/' : target.pathname.replace(/\/$/, '');
    assert(urls.includes(`${target.origin}${canonicalPath}`), `Unpublished internal link ${target} in ${url}`);
  }
  assert(!document.title.includes('Redirecting'), `Fallback shell for ${url}`);
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
console.log(`Verified ${urls.length} published routes and their canonical URLs.`);