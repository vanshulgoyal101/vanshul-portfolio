import { describe, it, expect } from 'vitest';
import { postJsonLd, blogIndexJsonLd, breadcrumbList } from './structuredData.mjs';

const identity = {
  site: 'https://example.com',
  authorName: 'Jane Doe',
  authorSameAs: ['https://github.com/jane', 'https://x.com/jane'],
};

const post = {
  title: 'Hello World',
  slug: 'hello-world',
  summary: 'A short summary.',
  date: '27 Aug, 2025',
  readTime: '4 min read',
  category: 'AI',
  tags: 'Robotics, Agents',
  wordCount: 1200,
};

describe('structuredData/breadcrumbList', () => {
  it('numbers positions from 1 and maps name/item', () => {
    const bc = breadcrumbList([
      ['Home', 'https://example.com/'],
      ['Blog', 'https://example.com/blog'],
    ]);
    expect(bc['@type']).toBe('BreadcrumbList');
    expect(bc.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://example.com/blog' },
    ]);
  });
});

describe('structuredData/postJsonLd', () => {
  const [posting, breadcrumb] = postJsonLd(post, identity);

  it('produces a BlogPosting and a BreadcrumbList', () => {
    expect(posting['@type']).toBe('BlogPosting');
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
  });

  it('sets the canonical url and image', () => {
    expect(posting.url).toBe('https://example.com/blog/hello-world');
    expect(posting.image).toEqual(['https://example.com/og/hello-world.png']);
    expect(posting.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://example.com/blog/hello-world',
    });
  });

  it('cross-links author and publisher to the site Person entity via @id', () => {
    expect(posting.author['@id']).toBe('https://example.com/#person');
    expect(posting.publisher['@id']).toBe('https://example.com/#person');
    expect(posting.author.sameAs).toEqual(identity.authorSameAs);
  });

  it('links the post to the WebSite via isPartOf', () => {
    expect(posting.isPartOf).toEqual({
      '@type': 'WebSite',
      '@id': 'https://example.com/#website',
    });
  });

  it('merges category + tags into keywords, category first', () => {
    expect(posting.keywords).toBe('AI, Robotics, Agents');
    expect(posting.articleSection).toBe('AI');
  });

  it('encodes readTime as an ISO-8601 duration and carries wordCount', () => {
    expect(posting.timeRequired).toBe('PT4M');
    expect(posting.wordCount).toBe(1200);
  });

  it('sets datePublished/dateModified from the post date', () => {
    const iso = new Date('27 Aug, 2025').toISOString();
    expect(posting.datePublished).toBe(iso);
    expect(posting.dateModified).toBe(iso);
  });

  it('breadcrumb trail is Home → Blog → post', () => {
    const names = breadcrumb.itemListElement.map((i) => i.name);
    expect(names).toEqual(['Home', 'Blog', 'Hello World']);
    expect(breadcrumb.itemListElement[2].item).toBe(
      'https://example.com/blog/hello-world',
    );
  });

  it('omits date/time fields for an unparseable date', () => {
    const [p2] = postJsonLd({ ...post, date: 'someday', readTime: 'a while' }, identity);
    expect(p2.datePublished).toBeUndefined();
    expect(p2.timeRequired).toBeUndefined();
  });
});

describe('structuredData/blogIndexJsonLd', () => {
  const posts = [
    { title: 'Newer', slug: 'newer', date: '2025-08-27', category: 'AI' },
    { title: 'Older', slug: 'older', date: '2025-01-01' },
  ];
  const [blog, breadcrumb] = blogIndexJsonLd(posts, {
    ...identity,
    title: 'Blog — Jane Doe',
    description: 'Essays.',
  });

  it('produces a Blog and a BreadcrumbList', () => {
    expect(blog['@type']).toBe('Blog');
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
  });

  it('lists every post as a BlogPosting with a url', () => {
    expect(blog.blogPost).toHaveLength(2);
    expect(blog.blogPost[0]).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Newer',
      url: 'https://example.com/blog/newer',
      articleSection: 'AI',
    });
  });

  it('links the blog to the WebSite and author to the Person', () => {
    expect(blog.isPartOf['@id']).toBe('https://example.com/#website');
    expect(blog.author['@id']).toBe('https://example.com/#person');
  });
});
