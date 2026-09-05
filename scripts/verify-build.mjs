import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { BOOKS } from '../src/constants/books.js';

const dist = new URL('../dist/', import.meta.url);
const sitemap = new JSDOM(readFileSync(new URL('sitemap.xml', dist), 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('url > loc')].map(element => element.textContent);
assert(urls.includes(`${SITE_URL}/reading-list`), 'Reading list must appear in the published sitemap');
for (const url of urls) {
  const route = new URL(url);
  assert.equal(route.origin, SITE_URL);
  const path = route.pathname.replace(/^\/+|\/+$/g, '');
  const file = new URL(path ? `${path}/index.html` : 'index.html', dist);
  const document = new JSDOM(readFileSync(fileURLToPath(file), 'utf8')).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), url, `Canonical mismatch for ${url}`);
  assert(document.querySelector('#root'), `Missing app root for ${url}`);
  assert(!document.title.includes('Redirecting'), `Fallback shell for ${url}`);
  if (path === 'reading-list') {
    assert(document.title.startsWith('Reading List'));
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(element => JSON.parse(element.textContent));
    assert.equal(schemas.find(schema => schema['@type'] === 'ItemList')?.numberOfItems, BOOKS.length);
  }
}
console.log(`Verified ${urls.length} published routes and their canonical URLs.`);