import { describe, it, expect, vi } from 'vitest';
import { assetReferences, linkHrefs, metaContents, runLiveSmoke, servedCommit, sitemapUrls } from './liveSmoke.mjs';

const SITE = 'https://example.com';
const COMMIT = 'a'.repeat(40);
const NEWER = 'b'.repeat(40);

const page = (url, { commit = COMMIT, robots = 'index, follow', canonical = url } = {}) => `<!doctype html><html><head>
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonical}" />
  <meta content="${SITE}/og.png" property="og:image" />
  <meta name="build-commit" content="${commit}">
  <link rel="stylesheet" crossorigin href="/assets/app.css">
  <link rel="modulepreload" href="/assets/vendor.js">
</head><body><script type="module" crossorigin src="/assets/app.js"></script></body></html>`;

const healthySite = () => ({
  '/': { type: 'text/html; charset=utf-8', body: page(`${SITE}/`) },
  '/blog/': { type: 'text/html; charset=utf-8', body: page(`${SITE}/blog/`) },
  '/sitemap.xml': { type: 'application/xml', body: `<urlset><url><loc>${SITE}/</loc></url><url><loc> ${SITE}/blog/ </loc></url></urlset>` },
  '/og.png': { type: 'image/png', body: 'png' },
  '/assets/app.css': { type: 'text/css', body: '' },
  '/assets/app.js': { type: 'text/javascript', body: '' },
  '/assets/vendor.js': { type: 'text/javascript', body: '' },
  '/robots.txt': { type: 'text/plain', body: `User-agent: *\nSitemap: ${SITE}/sitemap.xml\n` },
  '/sitemap-index.xml': { type: 'application/xml', body: '<sitemapindex/>' },
  '/feed.xml': { type: 'application/rss+xml', body: '<rss/>' },
  '/llms.txt': { type: 'text/plain', body: '# Site' },
  '/site.webmanifest': { type: 'application/manifest+json', body: '{}' },
});

// A fake fetch over a path → response table; unknown paths answer 404.
const fakeFetch = (routes) => vi.fn(async (href) => {
  const route = routes[new URL(href).pathname];
  const status = route?.status ?? (route ? 200 : 404);
  return { status, headers: { get: () => route?.type ?? 'text/html' }, text: async () => route?.body ?? 'Not found' };
});

const smoke = (routes, options = {}) => runLiveSmoke({
  site: SITE,
  fetch: fakeFetch(routes),
  sleep: async () => {},
  token: 't1',
  ...options,
});

describe('liveSmoke/parsers', () => {
  const html = page(`${SITE}/`);

  it('reads meta and link values regardless of attribute order', () => {
    expect(metaContents(html, 'property', 'og:image')).toEqual([`${SITE}/og.png`]);
    expect(metaContents(html, 'name', 'robots')).toEqual(['index, follow']);
    expect(linkHrefs(html, 'canonical')).toEqual([`${SITE}/`]);
    expect(servedCommit(html)).toBe(COMMIT);
    expect(servedCommit('<html></html>')).toBeUndefined();
  });

  it('collects the scripts, stylesheets and module preloads a page loads', () => {
    expect(assetReferences(html).sort()).toEqual(['/assets/app.css', '/assets/app.js', '/assets/vendor.js']);
    expect(linkHrefs('<link rel="preload stylesheet" href="/a.css">', 'stylesheet')).toEqual(['/a.css']);
  });

  it('extracts sitemap locations, trimming whitespace', () => {
    expect(sitemapUrls(`<loc>${SITE}/</loc><loc>\n ${SITE}/x/ \n</loc>`)).toEqual([`${SITE}/`, `${SITE}/x/`]);
  });
});

describe('liveSmoke/runLiveSmoke checks', () => {
  it('passes a healthy site and never lets the CDN answer from cache or follow redirects', async () => {
    const fetch = fakeFetch(healthySite());
    const result = await runLiveSmoke({ site: SITE, expected: COMMIT, fetch, sleep: async () => {}, token: 't1' });
    expect(result).toMatchObject({ status: 'passed', failures: [] });
    expect(result.message).toContain(COMMIT);
    for (const [href, init] of fetch.mock.calls) {
      expect(new URL(href).searchParams.get('smoke')).toBe('t1');
      expect(init).toMatchObject({ redirect: 'manual', headers: { 'cache-control': 'no-cache' } });
    }
    const requested = fetch.mock.calls.map(([href]) => new URL(href).pathname);
    expect(requested).toEqual(expect.arrayContaining(['/blog/', '/og.png', '/assets/app.js', '/assets/vendor.js', '/assets/app.css', '/feed.xml', '/smoke-missing-t1/']));
  });

  it.each([
    ['a redirecting published URL', routes => { routes['/blog/'] = { status: 301, body: '' }; }, `${SITE}/blog/: HTTP 301`],
    ['a wrong canonical', routes => { routes['/blog/'].body = page(`${SITE}/blog/`, { canonical: `${SITE}/` }); }, 'canonical is https://example.com/'],
    ['a noindex public page', routes => { routes['/blog/'].body = page(`${SITE}/blog/`, { robots: 'noindex' }); }, 'marked noindex'],
    ['one page from an older build', routes => { routes['/blog/'].body = page(`${SITE}/blog/`, { commit: NEWER }); }, `serves build ${NEWER}`],
    ['an SVG social image', routes => { routes['/og.png'].type = 'image/svg+xml'; }, 'unexpected content-type image/svg+xml'],
    ['a missing script', routes => { delete routes['/assets/app.js']; }, `${SITE}/assets/app.js: HTTP 404`],
    ['a robots file without the sitemap', routes => { routes['/robots.txt'].body = 'User-agent: *'; }, 'does not advertise the sitemap'],
    ['a missing feed', routes => { delete routes['/feed.xml']; }, `${SITE}/feed.xml: HTTP 404`],
    ['a soft-200 for unknown paths', routes => { routes['/smoke-missing-t1/'] = { type: 'text/html', body: '' }; }, 'unknown route: HTTP 200, expected 404'],
  ])('fails on %s', async (_, mutate, message) => {
    const routes = healthySite();
    mutate(routes);
    const result = await smoke(routes, { expected: COMMIT });
    expect(result.status).toBe('failed');
    expect(result.failures).toEqual([expect.stringContaining(message)]);
  });

  it('still checks the homepage when the sitemap is unreadable', async () => {
    const routes = healthySite();
    delete routes['/sitemap.xml'];
    const result = await smoke(routes);
    expect(result.failures).toEqual([`${SITE}/sitemap.xml: HTTP 404`]);
  });

  it('retries a check once before reporting it', async () => {
    const routes = healthySite();
    const fetch = fakeFetch(routes);
    const flaky = vi.fn(async (href, init) => {
      if (new URL(href).pathname === '/feed.xml' && flaky.mock.calls.filter(([h]) => h.includes('/feed.xml')).length === 1) throw new Error('ECONNRESET');
      return fetch(href, init);
    });
    const sleep = vi.fn(async () => {});
    const result = await runLiveSmoke({ site: SITE, fetch: flaky, sleep, token: 't1', retryDelayMs: 5 });
    expect(result.status).toBe('passed');
    expect(sleep).toHaveBeenCalledWith(5);

    const broken = vi.fn(async (href, init) => (href.includes('/llms.txt') ? Promise.reject(new Error('ECONNRESET')) : fetch(href, init)));
    const failed = await runLiveSmoke({ site: SITE, fetch: broken, sleep, token: 't1' });
    expect(failed.failures).toEqual([`${SITE}/llms.txt: ECONNRESET`]);
    expect(broken.mock.calls.filter(([href]) => href.includes('/llms.txt'))).toHaveLength(2);
  });
});

describe('liveSmoke/runLiveSmoke deployment wait', () => {
  it('waits until production serves the expected commit', async () => {
    const routes = healthySite();
    const current = routes['/'].body;
    routes['/'].body = page(`${SITE}/`, { commit: NEWER.replace(/b/g, 'c') });
    const sleep = vi.fn(async () => { routes['/'].body = current; });
    const result = await smoke(routes, { expected: COMMIT, sleep, mainCommit: async () => COMMIT, intervalMs: 7 });
    expect(sleep).toHaveBeenCalledWith(7);
    expect(result.status).toBe('passed');
  });

  it('skips, without failing, when main has moved past the expected commit', async () => {
    const routes = healthySite();
    routes['/'].body = page(`${SITE}/`, { commit: NEWER });
    const result = await smoke(routes, { expected: COMMIT, mainCommit: async () => NEWER });
    expect(result).toMatchObject({ status: 'superseded', failures: [] });
    expect(result.message).toContain(NEWER);
  });

  it('reports drift when production never serves the expected commit', async () => {
    const routes = healthySite();
    routes['/'].body = page(`${SITE}/`, { commit: NEWER });
    let clock = 0;
    const result = await smoke(routes, {
      expected: COMMIT,
      mainCommit: async () => COMMIT,
      now: () => clock,
      sleep: async ms => { clock += ms; },
      timeoutMs: 60_000,
      intervalMs: 20_000,
    });
    expect(result.status).toBe('failed');
    expect(result.failures).toEqual([`Production serves ${NEWER}, not ${COMMIT}, after 1 minutes`]);
  });

  it('keeps waiting through homepage fetch errors, and treats an unknown main as not superseded', async () => {
    const routes = healthySite();
    const fetch = fakeFetch(routes);
    let calls = 0;
    const flaky = async (href, init) => (new URL(href).pathname === '/' && calls++ === 0 ? Promise.reject(new Error('timeout')) : fetch(href, init));
    const log = vi.fn();
    const result = await runLiveSmoke({ site: SITE, expected: COMMIT, fetch: flaky, sleep: async () => {}, log, token: 't1' });
    expect(log).toHaveBeenCalledWith('Homepage fetch failed: timeout');
    expect(result.status).toBe('passed');
  });
});
