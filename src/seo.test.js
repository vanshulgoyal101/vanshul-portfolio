import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AUTHOR_NAME, AUTHOR_SAME_AS, SITE_URL } from './constants/siteConfig';
import { PROFILE } from './constants/profile';
import { homeJsonLd } from '../scripts/lib/structuredData.mjs';

const template = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'),
  'utf8'
);

describe('index.html template', () => {
  // Every prerendered page is built from this template, so page-specific
  // structured data here would leak onto articles, the archive and the shelf.
  it('carries no structured data of its own', () => {
    expect(template).not.toMatch(/application\/ld\+json/);
  });

  // Every shell inherits these tags; scrapers render only raster cards.
  it('declares a 1200x630 PNG social card with its type and alt text', () => {
    const head = new DOMParser().parseFromString(template, 'text/html').head;
    const og = (key) => head.querySelector(`meta[property="og:${key}"]`)?.getAttribute('content');
    expect(og('image')).toMatch(/^https:\/\/vanshul\.com\/.+\.png$/);
    expect(og('image:type')).toBe('image/png');
    expect([og('image:width'), og('image:height')]).toEqual(['1200', '630']);
    expect(og('image:alt')).toBeTruthy();
    expect(head.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(og('image'));
  });
});

describe('homepage structured data', () => {
  const graph = homeJsonLd({
    site: SITE_URL,
    authorName: AUTHOR_NAME,
    authorSameAs: AUTHOR_SAME_AS,
    profile: PROFILE,
  })['@graph'];
  const byType = (t) => graph.find((node) => node['@type'] === t);

  it('describes the Person with the canonical sameAs profiles', () => {
    const person = byType('Person');
    expect(person.name).toBe('Vanshul Goyal');
    expect(person.sameAs).toEqual(AUTHOR_SAME_AS);
    expect(person.knowsAbout.length).toBeGreaterThan(0);
  });

  it('cross-links WebSite, Person and ProfilePage by @id', () => {
    expect(byType('WebSite')['@id']).toBe(`${SITE_URL}/#website`);
    expect(byType('WebSite').publisher['@id']).toBe(byType('Person')['@id']);
    expect(byType('ProfilePage').isPartOf['@id']).toBe(byType('WebSite')['@id']);
    expect(byType('ProfilePage').about['@id']).toBe(byType('Person')['@id']);
    expect(byType('ProfilePage').mainEntity['@id']).toBe(byType('Person')['@id']);
  });

  it('points the person image at a published photo', () => {
    const photo = new URL(byType('Person').image);
    expect(photo.origin).toBe(SITE_URL);
    const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', photo.pathname);
    expect(() => readFileSync(file)).not.toThrow();
  });
});
