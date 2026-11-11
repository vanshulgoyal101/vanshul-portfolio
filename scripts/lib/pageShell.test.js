// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { jsonLdScript, setMeta, setTitle, setCanonical } from './pageShell.mjs';

const value = 'Price $1, $2, $&, $`, $\' < "AI" & work';
const documentFor = html => new JSDOM(html).window.document;

describe('prerendered head values', () => {
  it.each([
    '<meta name="description" content="old">',
    '<meta content="old" name="description">',
    '<meta\nname="description"\ncontent="old">',
    '',
  ])('sets metadata literally without replacement-string expansion: %s', meta => {
    const doc = documentFor(setMeta(`<head>${meta}</head>`, 'name', 'description', value));
    expect(doc.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(doc.querySelector('meta[name="description"]').content).toBe(value);
  });
  it('preserves literal text in titles', () => {
    expect(documentFor(setTitle('<head><title>Old</title></head>', value)).title).toBe(value);
  });
  it('escapes canonical attributes without interpreting dollar signs', () => {
    const url = 'https://example.com/$1/?a="quoted"&b=2';
    expect(documentFor(setCanonical('<link rel="canonical" href="old">', url))
      .querySelector('link').getAttribute('href')).toBe(url);
  });
  it('safely embeds JSON-LD including closing script tags and dollar signs', () => {
    const data = { name: value, description: '</script><script>alert(1)</script>' };
    const doc = documentFor(`<head>${jsonLdScript(data)}</head>`);
    expect(doc.querySelectorAll('script')).toHaveLength(1);
    expect(JSON.parse(doc.querySelector('script').textContent)).toEqual(data);
    expect(doc.querySelector('script').hasAttribute('data-route-seo')).toBe(true);
  });
});
