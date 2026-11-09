import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { JSDOM } from 'jsdom';
import { articleHeadings, headingSlug, rehypeHeadingIds } from './articleHeadings';
import { loadBlogPosts } from './blogLoader';

const render = (markdown) =>
  new JSDOM(renderToStaticMarkup(<ReactMarkdown rehypePlugins={[rehypeHeadingIds]}>{markdown}</ReactMarkdown>)).window.document;

describe('headingSlug', () => {
  it('lowercases, strips punctuation and accents, and hyphenates', () => {
    expect(headingSlug('Physical: mastering the vessel')).toBe('physical-mastering-the-vessel');
    expect(headingSlug('Why judgment gets more valuable, not less')).toBe('why-judgment-gets-more-valuable-not-less');
    expect(headingSlug('Café — déjà vu!')).toBe('cafe-deja-vu');
  });
});

describe('articleHeadings', () => {
  it('lists h2 and h3 sections with levels, ignoring other heading depths', () => {
    expect(articleHeadings('# Title\n\n## First\n\ntext\n\n### Nested *emphasis*\n\n#### Too deep')).toEqual([
      { id: 'first', text: 'First', level: 2 },
      { id: 'nested-emphasis', text: 'Nested emphasis', level: 3 },
    ]);
  });

  it('keeps ids unique when headings repeat or have no letters', () => {
    expect(articleHeadings('## Notes\n\n## Notes\n\n## ???').map((heading) => heading.id)).toEqual(['notes', 'notes-1', 'section']);
  });

  it('returns no headings for empty input', () => {
    expect(articleHeadings('')).toEqual([]);
    expect(articleHeadings(undefined)).toEqual([]);
  });
});

describe('rehypeHeadingIds', () => {
  it('renders the same ids articleHeadings reports', () => {
    const markdown = '## Agentic AI\n\nText with [a link](https://example.com).\n\n## The *bottleneck* moves\n\n## Agentic AI';
    const document = render(markdown);
    expect([...document.querySelectorAll('h2')].map((heading) => heading.id)).toEqual(
      articleHeadings(markdown).map((heading) => heading.id),
    );
  });

  it('matches for every published post', () => {
    for (const post of loadBlogPosts()) {
      const document = render(post.content);
      expect([...document.querySelectorAll('h2, h3')].map((heading) => heading.id), post.slug).toEqual(
        articleHeadings(post.content).map((heading) => heading.id),
      );
    }
  });
});
