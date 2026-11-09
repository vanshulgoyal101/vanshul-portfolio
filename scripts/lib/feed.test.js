// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { buildFeed } from './feed.mjs';

const site = 'https://example.com';
const posts = [
  {
    slug: 'newer',
    title: 'Newer & better',
    summary: 'A <summary>.',
    date: '29 Jul, 2026',
    category: 'AI',
    body: '## Heading\n\nSee [the archive](/blog/) and [elsewhere](https://example.org).\n\n[bad](javascript:alert(1))\n\n`]]>` stays intact.',
  },
  { slug: 'older', title: 'Older', summary: 'Old.', date: '2025-01-01', body: 'Plain text.' },
];
const options = { site, authorName: 'Jane Doe', description: 'Essays.' };
const parse = (xml) => new JSDOM(xml, { contentType: 'text/xml' }).window.document;

describe('feed/buildFeed', () => {
  const xml = buildFeed(posts, options);
  const document = parse(xml);
  const items = [...document.querySelectorAll('item')];
  const child = (item, name) => item.getElementsByTagName(name)[0]?.textContent;

  it('produces well-formed RSS with the content and Dublin Core namespaces', () => {
    expect(document.querySelector('parsererror')).toBeNull();
    const rss = document.documentElement;
    expect(rss.getAttribute('version')).toBe('2.0');
    expect(rss.getAttribute('xmlns:content')).toBe('http://purl.org/rss/1.0/modules/content/');
    expect(rss.getAttribute('xmlns:dc')).toBe('http://purl.org/dc/elements/1.1/');
  });

  it('links the channel to the canonical archive and the newest post date', () => {
    expect(child(document.querySelector('channel'), 'link')).toBe('https://example.com/blog/');
    expect(child(document.querySelector('channel'), 'lastBuildDate')).toBe('Tue, 28 Jul 2026 18:30:00 GMT');
  });

  it('lists each post with its canonical link, stable guid, author and escaped text', () => {
    expect(items).toHaveLength(2);
    expect(child(items[0], 'title')).toBe('Newer & better');
    expect(child(items[0], 'link')).toBe('https://example.com/blog/newer/');
    expect(child(items[0], 'guid')).toBe('https://example.com/blog/newer');
    expect(items[0].querySelector('guid').getAttribute('isPermaLink')).toBe('false');
    expect(child(items[0], 'dc:creator')).toBe('Jane Doe');
    expect(child(items[0], 'description')).toBe('A <summary>.');
    expect(child(items[1], 'category')).toBeUndefined();
  });

  it('includes the full article as safe HTML with absolute links', () => {
    const html = new JSDOM(child(items[0], 'content:encoded')).window.document;
    expect(html.querySelector('h2').textContent).toBe('Heading');
    const hrefs = [...html.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href'));
    expect(hrefs).toContain('https://example.com/blog/');
    expect(hrefs).toContain('https://example.org');
    expect(hrefs.some((href) => href?.startsWith('javascript:'))).toBe(false);
    expect(html.querySelector('code').textContent).toBe(']]>');
  });

  it('omits the build date when there are no posts', () => {
    const empty = parse(buildFeed([], options));
    expect(empty.querySelector('parsererror')).toBeNull();
    expect(empty.querySelectorAll('item')).toHaveLength(0);
    expect(empty.getElementsByTagName('lastBuildDate')).toHaveLength(0);
  });
});
