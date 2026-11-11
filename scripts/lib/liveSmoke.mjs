/**
 * Read-only smoke of the live site. Dependency-free (it runs before `npm ci`)
 * and side-effect-free apart from the injected `fetch`, `sleep` and
 * `mainCommit`, so it is unit-tested against fake responses; smoke-live.mjs
 * does the I/O. It judges only the build production actually serves: first
 * wait for the expected commit, skip when a newer main commit replaced it,
 * then check every published route once with one retry.
 */

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, 'i'))?.[1];
const tags = (html, tagName) => html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];

/** The `content` of every `<meta attr="key">`, in document order. */
export const metaContents = (html, attr, key) =>
  tags(html, 'meta').filter(tag => attribute(tag, attr) === key).map(tag => attribute(tag, 'content'));

/** The `href` of every `<link>` whose rel list contains `rel`. */
export const linkHrefs = (html, rel) =>
  tags(html, 'link').filter(tag => attribute(tag, 'rel')?.split(/\s+/).includes(rel)).map(tag => attribute(tag, 'href'));

/** Same-origin scripts and stylesheets the document loads before rendering. */
export const assetReferences = (html) => [
  ...tags(html, 'script').map(tag => attribute(tag, 'src')).filter(Boolean),
  ...linkHrefs(html, 'stylesheet'),
  ...linkHrefs(html, 'modulepreload'),
];

/** The commit stamped into a built page (see vite.config.js). */
export const servedCommit = (html) => metaContents(html, 'name', 'build-commit')[0];

export const sitemapUrls = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(match => match[1]);

/**
 * A GET that bypasses the CDN's cached copy and reports redirects instead of
 * following them: a published URL must answer 200 itself.
 */
const getter = (fetch, token) => async (url) => {
  const target = new URL(url);
  target.searchParams.set('smoke', token);
  const response = await fetch(target.href, { redirect: 'manual', headers: { 'cache-control': 'no-cache' } });
  return { status: response.status, type: response.headers.get('content-type') ?? '', body: await response.text() };
};

/**
 * Poll the homepage until it serves `expected`. Returns `serving`, `superseded`
 * (main has moved past `expected`, so a newer deploy owns production) or
 * `stale` (still another commit at the deadline).
 */
export const waitForCommit = async ({ site, expected, get, mainCommit, sleep, now, timeoutMs, intervalMs, log }) => {
  const deadline = now() + timeoutMs;
  for (;;) {
    let served;
    try {
      served = servedCommit((await get(`${site}/`)).body);
    } catch (error) {
      log(`Homepage fetch failed: ${error.message}`);
    }
    if (served === expected) return { status: 'serving' };
    const head = await mainCommit();
    if (head && head !== expected) return { status: 'superseded', served, head };
    if (now() >= deadline) return { status: 'stale', served };
    log(`Production serves ${served ?? 'no readable build stamp'}; waiting for ${expected}.`);
    await sleep(intervalMs);
  }
};

/** Check the published surface; returns the failure messages and check count. */
export const checkSite = async ({ site, expected, get, sleep, retryDelayMs, token }) => {
  const failures = [];
  let checked = 0;
  // One retry absorbs a transient network error; a repeated failure is real.
  const check = async (label, run) => {
    checked += 1;
    for (let attempt = 1; ; attempt += 1) {
      try {
        return await run();
      } catch (error) {
        if (attempt === 2) {
          failures.push(`${label}: ${error.message}`);
          return undefined;
        }
        await sleep(retryDelayMs);
      }
    }
  };
  const expectOk = async (url, typePattern) => {
    const response = await get(url);
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    if (typePattern && !typePattern.test(response.type)) throw new Error(`unexpected content-type ${response.type || '(none)'}`);
    return response;
  };

  const urls = await check(`${site}/sitemap.xml`, async () => {
    const found = sitemapUrls((await expectOk(`${site}/sitemap.xml`, /xml/)).body);
    if (!found.includes(`${site}/`)) throw new Error('the homepage is not listed');
    return found;
  }) ?? [`${site}/`];

  const images = new Set();
  const assets = new Set();
  for (const url of urls) {
    await check(url, async () => {
      const { body } = await expectOk(url, /text\/html/);
      const canonical = linkHrefs(body, 'canonical');
      if (canonical.length !== 1 || canonical[0] !== url) throw new Error(`canonical is ${canonical.join(', ') || 'missing'}`);
      if (metaContents(body, 'name', 'robots').some(value => /noindex/i.test(value))) throw new Error('marked noindex');
      if (expected && servedCommit(body) !== expected) throw new Error(`serves build ${servedCommit(body) ?? '(unstamped)'}, expected ${expected}`);
      metaContents(body, 'property', 'og:image').forEach(image => images.add(image));
      assetReferences(body).forEach(reference => assets.add(new URL(reference, url).href));
    });
  }
  for (const image of images) await check(image, () => expectOk(image, /^image\/png/));
  for (const asset of assets) await check(asset, () => expectOk(asset));

  await check(`${site}/robots.txt`, async () => {
    if (!(await expectOk(`${site}/robots.txt`)).body.includes(`Sitemap: ${site}/sitemap.xml`)) throw new Error('does not advertise the sitemap');
  });
  for (const file of ['sitemap-index.xml', 'feed.xml']) await check(`${site}/${file}`, () => expectOk(`${site}/${file}`, /xml/));
  for (const file of ['llms.txt', 'site.webmanifest']) await check(`${site}/${file}`, () => expectOk(`${site}/${file}`));
  // An unknown path must stay a real 404, never a soft-200 copy of the app.
  await check('unknown route', async () => {
    const { status } = await get(`${site}/smoke-missing-${token}/`);
    if (status !== 404) throw new Error(`HTTP ${status}, expected 404`);
  });
  return { failures, checked };
};

/**
 * Wait for production to serve `expected` (when given), then check it.
 * Resolves to `{ status: 'passed' | 'superseded' | 'failed', failures, message }`.
 */
export const runLiveSmoke = async ({
  site,
  expected,
  fetch,
  mainCommit = async () => undefined,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  now = Date.now,
  timeoutMs = 15 * 60_000,
  intervalMs = 20_000,
  retryDelayMs = 10_000,
  token = Date.now().toString(36),
  log = () => {},
}) => {
  const get = getter(fetch, token);
  if (expected) {
    const wait = await waitForCommit({ site, expected, get, mainCommit, sleep, now, timeoutMs, intervalMs, log });
    if (wait.status === 'superseded') {
      return { status: 'superseded', failures: [], message: `main moved to ${wait.head}; its own smoke judges production, so ${expected} is skipped.` };
    }
    if (wait.status === 'stale') {
      const minutes = Math.round(timeoutMs / 60_000);
      return { status: 'failed', failures: [`Production serves ${wait.served ?? 'no readable build stamp'}, not ${expected}, after ${minutes} minutes`], message: 'Deployment drift.' };
    }
  }
  const { failures, checked } = await checkSite({ site, expected, get, sleep, retryDelayMs, token });
  return failures.length
    ? { status: 'failed', failures, message: `${failures.length} of ${checked} live checks failed.` }
    : { status: 'passed', failures, message: `Production${expected ? ` serves ${expected} and` : ''} passed all ${checked} live checks.` };
};
