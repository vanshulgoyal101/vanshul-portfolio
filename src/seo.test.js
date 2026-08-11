import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AUTHOR_SAME_AS, SITE_URL } from './constants/siteConfig';

// Guards the home page's SEO structured data so a stray edit can't silently
// break the knowledge-panel signal.
const html = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'),
  'utf8'
);

const jsonLdBlocks = [
  ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
].map((m) => JSON.parse(m[1]));

describe('home structured data', () => {
  it('exposes exactly one valid JSON-LD @graph block', () => {
    expect(jsonLdBlocks).toHaveLength(1);
    expect(Array.isArray(jsonLdBlocks[0]['@graph'])).toBe(true);
  });

  const graph = jsonLdBlocks[0]['@graph'];
  const byType = (t) => graph.find((node) => node['@type'] === t);

  it('describes the Person with the canonical sameAs profiles', () => {
    const person = byType('Person');
    expect(person.name).toBe('Vanshul Goyal');
    expect(person.sameAs).toEqual(expect.arrayContaining(AUTHOR_SAME_AS));
    expect(person.knowsAbout.length).toBeGreaterThan(0);
  });

  it('cross-links WebSite, Person and ProfilePage by @id', () => {
    expect(byType('WebSite')['@id']).toBe(`${SITE_URL}/#website`);
    expect(byType('WebSite').publisher['@id']).toBe(byType('Person')['@id']);
    expect(byType('ProfilePage').isPartOf['@id']).toBe(byType('WebSite')['@id']);
    expect(byType('ProfilePage').about['@id']).toBe(byType('Person')['@id']);
  });
});
