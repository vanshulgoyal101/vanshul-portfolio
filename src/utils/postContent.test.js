import { describe, it, expect } from 'vitest';
import { parseFrontmatter, parseBlogPost } from './postContent';
import { loadFullBlogPosts } from './blogPostLoader';
import { readPosts } from '../../scripts/lib/seo.mjs';
import { join } from 'node:path';

const fields = {
  title: 'Example',
  slug: 'example',
  summary: 'An original example.',
  date: '2026-11-11',
  readTime: '2 min read',
  category: 'Engineering',
};
const markdown = (data = fields, body = 'A real article body.') =>
  `---\n${Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')}\n---\n${body}`;

describe('shared publishing contract', () => {
  it('produces identical build and browser posts for every published file', () => {
    const built = readPosts(join(process.cwd(), 'src', 'blogs'));
    const runtime = loadFullBlogPosts();
    expect(built).toHaveLength(runtime.length);
    for (const { body, ...post } of built) {
      expect(runtime.find(item => item.slug === post.slug)).toEqual({ ...post, content: body });
    }
  });

  it.each(Object.keys(fields).filter(field => field !== 'category'))('rejects missing and blank %s', field => {
    for (const value of [undefined, '', '   ']) {
      const data = { ...fields, [field]: value };
      if (value === undefined) delete data[field];
      expect(() => parseBlogPost(markdown(data), 'example')).toThrow(`Invalid ${field}`);
    }
  });
  it('preserves optional categories and string-valued frontmatter', () => {
    const { category, ...uncategorized } = fields;
    expect(category).toBe('Engineering');
    expect(parseBlogPost(markdown(uncategorized), 'example')).not.toHaveProperty('category');
    expect(parseBlogPost(markdown({ ...fields, title: '1984', category: '123' }), 'example')).toMatchObject({
      title: '1984', category: '123',
    });
  });

  it.each(['../path', 'Uppercase', 'two words', 'a'.repeat(121)])('rejects unsafe slug %s', slug => {
    expect(() => parseBlogPost(markdown({ ...fields, slug }), 'example')).toThrow('Invalid URL slug');
  });
  it('rejects a mismatched filename', () => {
    expect(() => parseBlogPost(markdown(), 'another')).toThrow('Slug must match filename');
  });
  it.each(['2026-02-30', 'tomorrow'])('rejects invalid date %s', date => {
    expect(() => parseBlogPost(markdown({ ...fields, date }), 'example')).toThrow('Invalid publication date');
  });
  it.each(['2026-11-10', '2026-02-30', '', 'soon'])('rejects invalid or backdated update %s', updated => {
    expect(() => parseBlogPost(markdown({ ...fields, updated }), 'example')).toThrow('Invalid updated date');
  });
  it.each(['2026-11-11', '12 Nov, 2026'])('accepts a real update on or after publication: %s', updated => {
    expect(parseBlogPost(markdown({ ...fields, updated }), 'example').updated).toBe(updated);
  });
  it.each(['0 min read', '-2 min read', '1.5 min read', '2 minutes', '02 min read'])('rejects readTime %s', readTime => {
    expect(() => parseBlogPost(markdown({ ...fields, readTime }), 'example')).toThrow('Invalid readTime');
  });
  it('rejects an empty body', () => {
    expect(() => parseBlogPost(markdown(fields, '  \n'), 'example')).toThrow('Empty article body');
  });
  it('normalizes Windows line endings and calculates the body word count', () => {
    expect(parseBlogPost(markdown().replaceAll('\n', '\r\n'), 'example')).toEqual({
      ...fields, content: 'A real article body.', wordCount: 4, filename: 'example',
    });
  });
});

describe('frontmatter delimiters and values', () => {
  it('does not recognize an incomplete closing delimiter', () => {
    const text = '---\ntitle: Example\n---not-a-delimiter\nbody';
    expect(parseFrontmatter(text)).toEqual({ data: {}, content: text });
  });
  it('recognizes a closing delimiter at EOF', () => {
    expect(parseFrontmatter('---\ntitle: Example\n---')).toEqual({ data: { title: 'Example' }, content: '' });
  });
  it('preserves unmatched quotation marks', () => {
    expect(parseFrontmatter('---\ntitle: "Unmatched\n---\nbody').data.title).toBe('"Unmatched');
  });
  it('ignores empty keys and prose, preserving colons in values', () => {
    expect(parseFrontmatter('---\n : ignored\nprose\n: orphan\ntitle: A: B\n---\nbody').data).toEqual({ title: 'A: B' });
  });
  it('reports non-text input explicitly', () => {
    expect(() => parseBlogPost(null, 'example')).toThrow(TypeError);
  });
});
