import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { prerenderContent } from './prerenderContent.mjs';
import { BOOKS, ESSAYS } from '../../src/constants/books.js';

const posts = [{ slug: 'example', title: 'An example', summary: 'A summary', body: '## A section\n\nActual **article** text.\n\n[Unsafe](javascript:alert%281%29)\n\n<script>alert(1)</script>' }];
const parse = options => new JSDOM(prerenderContent(options)).window.document;

describe('crawler-readable content', () => {
  it('renders article content with semantic headings and safe Markdown', () => {
    const document = parse({ post: posts[0], posts });
    expect(document.querySelector('h1').textContent).toBe('An example');
    expect(document.querySelector('article strong').textContent).toBe('article');
    expect(document.querySelector('script')).toBeNull();
    expect([...document.querySelectorAll('a')].some(anchor => anchor.href.startsWith('javascript:'))).toBe(false);
  });
  it('publishes homepage and index links without requiring JavaScript', () => {
    for (const page of ['home', 'blog']) {
      const document = parse({ page, posts });
      expect(document.querySelector('a[href="/blog/example/"]').textContent).toBe('An example');
      expect(document.querySelectorAll('h1')).toHaveLength(1);
      expect(document.querySelector('main')).not.toBeNull();
    }
  });
  it('publishes both shelf collections and preserves all essay destinations', () => {
    const document = parse({ page: 'reading-list' });
    expect(document.querySelectorAll('#books li')).toHaveLength(BOOKS.length);
    expect(document.querySelectorAll('#essays li')).toHaveLength(ESSAYS.length);
    expect([...document.querySelectorAll('#essays a')].map(anchor => anchor.href)).toEqual(ESSAYS.map(essay => essay.url));
  });
  it('escapes authored titles and attributes instead of interpreting HTML', () => {
    const document = parse({ posts: [{ slug: 'quoted"slug', title: '<img src=x onerror=alert(1)>', summary: '<script>bad</script>' }] });
    expect(document.querySelector('img, script')).toBeNull();
    expect(document.querySelector('main a[href*="quoted"]').getAttribute('href')).toBe('/blog/quoted"slug/');
  });
});