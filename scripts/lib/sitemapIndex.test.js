import { describe, it, expect } from 'vitest';
import { buildSitemapIndex } from './sitemapIndex.mjs';

describe('sitemapIndex/buildSitemapIndex', () => {
  const xml = buildSitemapIndex(
    ['https://a.com/sitemap.xml', 'https://b.com/sitemap.xml'],
    { today: '2026-08-13' }
  );

  it('is a well-formed sitemapindex', () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('lists every site with a lastmod', () => {
    expect(xml).toContain('<loc>https://a.com/sitemap.xml</loc>');
    expect(xml).toContain('<loc>https://b.com/sitemap.xml</loc>');
    expect((xml.match(/<sitemap>/g) || []).length).toBe(2);
    expect(xml).toContain('<lastmod>2026-08-13</lastmod>');
  });

  it('skips falsy entries', () => {
    const xml2 = buildSitemapIndex(['https://a.com/sitemap.xml', '', null, undefined], {
      today: '2026-08-13',
    });
    expect((xml2.match(/<sitemap>/g) || []).length).toBe(1);
  });
});
