import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { BOOKS, ESSAYS, SHELF_ITEMS } from '../src/constants/books.js';
import { BLOG_PATH, READING_LIST_PATH, absoluteUrl } from '../src/constants/routes.js';
import { PROJECT_PAGES } from '../src/constants/projectStories.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY } from '../src/constants/projects.js';
import { EXPERIENCE, EARLIER_EXPERIENCE } from '../src/constants/experience.js';
import { ANALYTICS_SUPABASE_URL } from '../src/lib/runtimeConfig.js';
import { INDEXNOW_KEY } from './lib/indexnow.mjs';
import { REFERRER_POLICY, inlineScripts, parsePolicy, scriptHash } from './lib/securityPolicy.mjs';

const dist = new URL('../dist/', import.meta.url);
// Heavy or single-route code must stay lazy: no page may fetch these before
// first paint (see the manualChunks notes in documentation/config.md).
const LAZY_ONLY_CHUNKS = /\/assets\/(three-core|three-react|markdown|supabase|Dashboard|HeroScene|ProjectPage|projectStories)-/;
// First-load budget: the gzipped JS and CSS a published page fetches before it
// can render (187 KB early in November 2026; 200 KB once the lazy project
// pages split the shared page shell into its own chunk). Raise it only for a
// deliberate change.
const FIRST_LOAD_BUDGET_KB = 205;
const gzipKb = path => gzipSync(readFileSync(new URL(path.slice(1), dist))).length / 1024;
let heaviestFirstLoadKb = 0;
const pageTitles = new Map();
const pageDescriptions = new Map();
// Everything a document asks the browser to fetch; each must ship in dist.
const ASSET_REFERENCES = [
  'script[src]', 'link[rel~="stylesheet"]', 'link[rel="modulepreload"]', 'link[rel="preload"]',
  'link[rel~="icon"]', 'link[rel="apple-touch-icon"]', 'link[rel="manifest"]', 'link[rel="alternate"]',
  'img[src]', 'source[src]', 'meta[property="og:image"]', 'meta[name="twitter:image"]',
].join(', ');
const distFile = (pathname) => {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, '');
  return new URL(!relative || relative.endsWith('/') ? `${relative}index.html` : relative, dist);
};
const assertShipped = (reference, from) => {
  const target = new URL(reference, `${SITE_URL}/`);
  if (target.origin !== SITE_URL) return;
  assert(existsSync(distFile(target.pathname)), `${reference} (referenced by ${from}) is missing from dist`);
};
const assertAssetsShipped = (document, from) => {
  for (const element of document.querySelectorAll(ASSET_REFERENCES)) {
    assertShipped(element.getAttribute('src') ?? element.getAttribute('href') ?? element.getAttribute('content'), from);
  }
};
// A PNG's IHDR chunk stores width and height at bytes 16-23.
const pngSize = (file) => {
  const bytes = readFileSync(file);
  assert(bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), `${fileURLToPath(file)} is not a PNG`);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
};
// The meta policy must precede every script and allow exactly this page's
// inline scripts, so a prerender or template edit cannot silently break them.
const assertSecurityPolicy = (html, document, from) => {
  const policies = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
  assert.equal(policies.length, 1, `Expected one Content-Security-Policy for ${from}`);
  assert.equal(document.querySelector('head > script, head > meta[http-equiv="Content-Security-Policy"]'), policies[0], `Content-Security-Policy must precede every script in ${from}`);
  const policy = parsePolicy(policies[0].content);
  const hashes = policy['script-src'].filter(source => source.startsWith("'sha256-"));
  assert.deepEqual([...hashes].sort(), [...new Set(inlineScripts(html).map(scriptHash))].sort(), `script-src hashes disagree with the inline scripts in ${from}`);
  for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'", '*']) assert(!policy['script-src'].includes(unsafe), `script-src allows ${unsafe} in ${from}`);
  assert.deepEqual(policy['object-src'], ["'none'"], `object-src must be 'none' in ${from}`);
  assert.equal(document.querySelector('meta[name="referrer"]')?.content, REFERRER_POLICY, `Missing referrer policy in ${from}`);
  return policy;
};
const sitemap = new JSDOM(readFileSync(new URL('sitemap.xml', dist), 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('url > loc')].map(element => element.textContent);
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
assert(!urls.some(url => url.includes('/dashboard')), 'Private dashboard must not be in the sitemap');
assert(urls.includes(absoluteUrl(READING_LIST_PATH)), 'Reading list must appear in the published sitemap');
assert.equal(PROJECT_PAGES.length, FEATURED_PROJECTS.length, 'Every featured project needs a story page');
const projectUrls = PROJECT_PAGES.map(project => absoluteUrl(project.path));
for (const url of projectUrls) assert(urls.includes(url), `Project page ${url} must appear in the published sitemap`);
for (const url of urls) {
  const route = new URL(url);
  assert.equal(route.origin, SITE_URL);
  // GitHub Pages redirects slash-less directory URLs, so a published URL must
  // be the final form: the root or a path ending in `/`.
  assert(route.pathname.endsWith('/') && !route.search && !route.hash, `Published URL would redirect: ${url}`);
  const path = route.pathname.replace(/^\/+|\/+$/g, '');
  const file = new URL(path ? `${path}/index.html` : 'index.html', dist);
  const html = readFileSync(fileURLToPath(file), 'utf8');
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), url, `Canonical mismatch for ${url}`);
  const policy = assertSecurityPolicy(html, document, url);
  // The SPA serves /dashboard from this shell, so its analytics API must stay allowed.
  assert(policy['connect-src'].includes(ANALYTICS_SUPABASE_URL), `connect-src must allow the analytics project in ${url}`);
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
  // Scrapers render only raster cards, and only at the size the tags declare.
  const ogImageMeta = key => document.querySelector(`meta[property="og:image:${key}"]`)?.getAttribute('content');
  assert.equal(ogImageMeta('type'), 'image/png', `og:image:type must be image/png for ${url}`);
  assert.deepEqual(pngSize(new URL(image.pathname.slice(1), dist)), [Number(ogImageMeta('width')), Number(ogImageMeta('height'))], `Social image size disagrees with its tags for ${url}`);
  assert(ogImageMeta('alt')?.trim(), `Missing og:image:alt for ${url}`);
  assert.equal(document.querySelector('meta[name="twitter:image"]')?.content, image.href, `twitter:image differs from og:image for ${url}`);
  assertAssetsShipped(document, url);
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
  // Same-origin links, absolute or relative: pages must be published URLs and
  // files (the feed, llms.txt) must ship.
  for (const anchor of document.querySelectorAll('a[href]')) {
    const target = new URL(anchor.getAttribute('href'), url);
    if (target.origin !== SITE_URL || (target.pathname === route.pathname && target.hash)) continue;
    if (/\.[a-z0-9]+$/i.test(target.pathname)) assertShipped(target.href, url);
    else assert(urls.includes(`${target.origin}${target.pathname}`), `Internal link ${target} in ${url} is not a published URL`);
  }
  assert(!document.title.includes('Redirecting'), `Fallback shell for ${url}`);
  const commits = [...document.querySelectorAll('meta[name="build-commit"]')].map(element => element.content);
  assert.equal(commits.length, 1, `Expected one build-commit stamp for ${url}`);
  assert.match(commits[0], /^[0-9a-f]{40}$/, `Invalid build-commit stamp for ${url}`);
  if (process.env.GITHUB_SHA) assert.equal(commits[0], process.env.GITHUB_SHA, `Build-commit stamp is not this CI commit for ${url}`);
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
  const project = PROJECT_PAGES.find(page => page.path === route.pathname);
  if (project) {
    assert.equal(document.title, project.pageTitle, `Project page title mismatch for ${url}`);
    assert.equal(document.querySelector('#root h1')?.textContent, project.title, `Project page heading mismatch for ${url}`);
    const webPage = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(webPage?.url, url, `Missing WebPage for ${url}`);
    assert(schemaTypes.includes('BreadcrumbList'), `Missing BreadcrumbList for ${url}`);
    assert(!schemaTypes.some(type => ['ProfilePage', 'BlogPosting', 'Article'].includes(type)), `Project page ${url} claims the wrong page type`);
    const text = document.querySelector('#root main').textContent;
    for (const section of project.story.sections) assert(text.includes(section.heading), `${url} is missing the "${section.heading}" section`);
    // Each story links to the other stories and back to the homepage list.
    const links = [...document.querySelectorAll('#root main a[href^="/"]')].map(anchor => anchor.getAttribute('href'));
    for (const other of PROJECT_PAGES.filter(other => other !== project)) assert(links.includes(other.path), `${url} must link to ${other.path}`);
    assert(links.includes('/#projects'), `${url} must link back to the homepage projects`);
  }
  if (route.pathname === '/') {
    const links = [...document.querySelectorAll('#root main a[href^="/projects/"]')].map(anchor => anchor.getAttribute('href'));
    assert.deepEqual([...new Set(links)], PROJECT_PAGES.map(page => page.path), 'The static homepage must link to every project page');
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
const manifest = JSON.parse(readFileSync(new URL('site.webmanifest', dist), 'utf8'));
for (const reference of [manifest.start_url, ...manifest.icons.map(icon => icon.src)]) assertShipped(reference, 'site.webmanifest');
assertAssetsShipped(new JSDOM(readFileSync(new URL('404.html', dist), 'utf8')).window.document, '404.html');
const llmsFile = new URL('llms.txt', dist);
assert(existsSync(llmsFile), 'Missing dist/llms.txt');
const llms = readFileSync(llmsFile, 'utf8');
assert(llms.startsWith('# '), 'llms.txt must start with an H1 title');
for (const url of [absoluteUrl(BLOG_PATH), ...articleUrls, ...projectUrls]) {
  // Match the whole link target: the archive URL is a prefix of every article URL.
  assert(llms.includes(`](${url})`), `llms.txt must link to ${url}`);
}
console.log(`Verified ${urls.length} published routes, their canonical URLs, ${fontUrls.length} font sources, the ${feedLinks.length}-item feed and llms.txt; heaviest first load ${heaviestFirstLoadKb.toFixed(1)} of ${FIRST_LOAD_BUDGET_KB} KB.`);