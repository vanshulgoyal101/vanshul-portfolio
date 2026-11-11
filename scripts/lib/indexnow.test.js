import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSitemap } from './sitemap.mjs';
import { INDEXNOW_KEY, changedUrls, indexNowPayload, sitemapEntries } from './indexnow.mjs';
import { PROJECT_PAGES } from '../../src/constants/projectStories.js';

const site = 'https://example.com';
const posts = [
  { title: 'Older', slug: 'older', date: '2025-01-01' },
  { title: 'Newer', slug: 'newer', date: '2025-08-27' },
];
const live = buildSitemap(posts, { site });

describe('indexnow/sitemapEntries', () => {
  it('reads every URL of a generated sitemap with its lastmod', () => {
    expect([...sitemapEntries(live)]).toEqual([
      [`${site}/`, '2025-08-27'],
      [`${site}/blog/`, '2025-08-27'],
      [`${site}/reading-list/`, ''],
      ...PROJECT_PAGES.map((project) => [`${site}${project.path}`, '']),
      [`${site}/blog/newer/`, '2025-08-27'],
      [`${site}/blog/older/`, '2025-01-01'],
    ]);
  });

  it('returns nothing for a page that is not a sitemap', () => {
    expect(sitemapEntries('<!doctype html><title>Error</title>').size).toBe(0);
    expect(sitemapEntries(undefined).size).toBe(0);
  });
});

describe('indexnow/changedUrls', () => {
  it('finds nothing when a deploy leaves the sitemap unchanged', () => {
    expect(changedUrls(live, buildSitemap(posts, { site }))).toEqual([]);
  });

  it('lists a new post together with the pages whose lastmod it moves', () => {
    const next = buildSitemap([...posts, { title: 'Newest', slug: 'newest', date: '2026-11-10' }], { site });
    expect(changedUrls(live, next)).toEqual([`${site}/`, `${site}/blog/`, `${site}/blog/newest/`]);
  });

  it('lists a post whose update date changed', () => {
    const next = buildSitemap([posts[0], { ...posts[1], updated: '2025-09-01' }], { site });
    expect(changedUrls(live, next)).toEqual([`${site}/`, `${site}/blog/`, `${site}/blog/newer/`]);
  });

  it('lists a removed post so engines recrawl it and drop it', () => {
    expect(changedUrls(live, buildSitemap([posts[1]], { site }))).toEqual([`${site}/blog/older/`]);
  });
});

describe('indexnow/indexNowPayload', () => {
  it('builds the bulk submission body with the root key file as proof of ownership', () => {
    expect(indexNowPayload(site, [`${site}/blog/`], 'abcdef12')).toEqual({
      host: 'example.com',
      key: 'abcdef12',
      keyLocation: `${site}/abcdef12.txt`,
      urlList: [`${site}/blog/`],
    });
  });

  it('uses a key in the protocol format that public/ serves verbatim', () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
    const keyFile = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', `${INDEXNOW_KEY}.txt`);
    expect(readFileSync(keyFile, 'utf8')).toBe(INDEXNOW_KEY);
  });
});
