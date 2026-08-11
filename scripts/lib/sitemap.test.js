import { describe, it, expect } from 'vitest';
import { buildSitemap } from './sitemap.mjs';

const site = 'https://example.com';
const posts = [
  { title: 'Older', slug: 'older', date: '2025-01-01' },
  { title: 'Newer & Bolder', slug: 'newer', date: '2025-08-27' },
  { title: 'No slug', date: '2025-06-01' }, // should be dropped
];

describe('sitemap/buildSitemap', () => {
  const xml = buildSitemap(posts, { site });

  it('is a well-formed urlset with the image namespace', () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
  });

  it('includes the homepage and the /blog hub', () => {
    expect(xml).toContain(`<loc>${site}/</loc>`);
    expect(xml).toContain(`<loc>${site}/blog</loc>`);
  });

  it('includes the reading-list page', () => {
    expect(xml).toContain(`<loc>${site}/reading-list</loc>`);
  });

  it('includes each post that has a slug and drops slug-less entries', () => {
    expect(xml).toContain(`<loc>${site}/blog/older</loc>`);
    expect(xml).toContain(`<loc>${site}/blog/newer</loc>`);
    expect(xml).not.toContain('undefined');
  });

  it('uses the newest post date as the home/blog lastmod', () => {
    expect(xml).toMatch(new RegExp(`<loc>${site}/</loc><lastmod>2025-08-27</lastmod>`));
    expect(xml).toMatch(new RegExp(`<loc>${site}/blog</loc><lastmod>2025-08-27</lastmod>`));
  });

  it('emits a per-post image entry with an escaped title', () => {
    expect(xml).toContain(`<image:loc>${site}/og/newer.png</image:loc>`);
    expect(xml).toContain('<image:title>Newer &amp; Bolder</image:title>');
  });

  it('orders posts newest-first', () => {
    const newerAt = xml.indexOf('/blog/newer');
    const olderAt = xml.indexOf('/blog/older');
    expect(newerAt).toBeLessThan(olderAt);
  });
});
