import { describe, it, expect } from 'vitest';
import { buildSitemap } from './sitemap.mjs';
import { PROJECT_PAGES } from '../../src/constants/projectStories.js';

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

  it('includes the homepage and the /blog/ hub', () => {
    expect(xml).toContain(`<loc>${site}/</loc>`);
    expect(xml).toContain(`<loc>${site}/blog/</loc>`);
  });

  it('includes the reading-list page', () => {
    expect(xml).toContain(`<loc>${site}/reading-list/</loc>`);
  });

  it('includes every project page with its image and no invented lastmod', () => {
    expect(PROJECT_PAGES.length).toBeGreaterThan(0);
    for (const project of PROJECT_PAGES) {
      const entry = xml.match(new RegExp(`<url><loc>${site}${project.path}</loc>.*?</url>`))?.[0];
      expect(entry).toBeDefined();
      expect(entry).not.toContain('<lastmod>');
      expect(entry).toContain(`<image:loc>${site}${project.image}</image:loc>`);
    }
  });

  it('builds project entries from the projects passed in', () => {
    const custom = buildSitemap(posts, { site, projects: [{ id: 'rover', title: 'Rover & Co', image: '/rover.webp?v=1&x=2' }] });
    expect(custom).toContain(`<loc>${site}/projects/rover/</loc>`);
    expect(custom).toContain(`<image:loc>${site}/rover.webp?v=1&amp;x=2</image:loc><image:title>Rover &amp; Co</image:title>`);
    expect(custom).not.toContain('/projects/adbrain/');
  });

  it('includes each post that has a slug and drops slug-less entries', () => {
    expect(xml).toContain(`<loc>${site}/blog/older/</loc>`);
    expect(xml).toContain(`<loc>${site}/blog/newer/</loc>`);
    expect(xml).not.toContain('undefined');
  });

  it('uses the newest post date as the home/blog lastmod', () => {
    expect(xml).toMatch(new RegExp(`<loc>${site}/</loc><lastmod>2025-08-27</lastmod>`));
    expect(xml).toMatch(new RegExp(`<loc>${site}/blog/</loc><lastmod>2025-08-27</lastmod>`));
  });

  it('dates an updated post by its update, and the home/blog by the latest change', () => {
    const updatedXml = buildSitemap([...posts, { title: 'Revised', slug: 'revised', date: '2024-05-01', updated: '2026-11-01' }], { site });
    expect(updatedXml).toMatch(new RegExp(`<loc>${site}/blog/revised/</loc><lastmod>2026-11-01</lastmod>`));
    expect(updatedXml).toMatch(new RegExp(`<loc>${site}/blog/newer/</loc><lastmod>2025-08-27</lastmod>`));
    expect(updatedXml).toMatch(new RegExp(`<loc>${site}/</loc><lastmod>2026-11-01</lastmod>`));
    expect(updatedXml).toMatch(new RegExp(`<loc>${site}/blog/</loc><lastmod>2026-11-01</lastmod>`));
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
