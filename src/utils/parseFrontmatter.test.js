import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from './blogLoader';

describe('parseFrontmatter', () => {
  it('returns empty data and the raw body when there is no frontmatter', () => {
    const { data, content } = parseFrontmatter('# Hello\n\nBody text');
    expect(data).toEqual({});
    expect(content).toContain('# Hello');
  });

  it('parses simple key/value pairs', () => {
    const md = `---\ntitle: My Post\nslug: my-post\n---\nBody text`;
    const { data, content } = parseFrontmatter(md);
    expect(data.title).toBe('My Post');
    expect(data.slug).toBe('my-post');
    expect(content).toBe('Body text');
  });

  it('strips surrounding single and double quotes', () => {
    const md = `---\ntitle: "Quoted Title"\nsummary: 'single quoted'\n---\nx`;
    const { data } = parseFrontmatter(md);
    expect(data.title).toBe('Quoted Title');
    expect(data.summary).toBe('single quoted');
  });

  it('coerces purely numeric values to numbers', () => {
    const { data } = parseFrontmatter(`---\nwordCount: 2400\n---\nx`);
    expect(data.wordCount).toBe(2400);
    expect(typeof data.wordCount).toBe('number');
  });

  it('keeps non-numeric values (dates, read time) as strings', () => {
    const { data } = parseFrontmatter(`---\ndate: 2025-01-10\nreadTime: 8 min read\n---\nx`);
    expect(data.date).toBe('2025-01-10');
    expect(data.readTime).toBe('8 min read');
  });

  it('only splits on the first colon so values may contain colons', () => {
    const { data } = parseFrontmatter(`---\ntitle: Taste: the last moat\n---\nx`);
    expect(data.title).toBe('Taste: the last moat');
  });

  it('normalizes CRLF line endings', () => {
    const md = `---\r\ntitle: CRLF Title\r\n---\r\nBody`;
    const { data, content } = parseFrontmatter(md);
    expect(data.title).toBe('CRLF Title');
    expect(content).toBe('Body');
  });

  it('trims leading/trailing whitespace from the content', () => {
    const { content } = parseFrontmatter(`---\ntitle: T\n---\n\n  spaced body  \n`);
    expect(content).toBe('spaced body');
  });
});
