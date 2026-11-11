// @vitest-environment node
import { afterEach, describe, it, expect, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { blogIndex, blogIndexPlugin } from './blogIndexPlugin.mjs';

let directory;
afterEach(() => rmSync(directory, { recursive: true, force: true }));
const prepare = (files) => {
  directory = mkdtempSync(join(tmpdir(), 'blog-index-'));
  for (const [name, text] of Object.entries(files)) writeFileSync(join(directory, name), text);
};
const post = (slug) => `---\ntitle: "Post ${slug}"\nslug: "${slug}"\nsummary: "A post summary"\nreadTime: "1 min read"\ndate: "2026-11-11"\n---\nThree body words`;

describe('blogIndex', () => {
  it('keeps metadata and word counts and drops the bodies', () => {
    prepare({ 'a.md': post('a'), 'notes.txt': 'ignored' });
    expect(blogIndex(directory)).toEqual([{
      title: 'Post a', slug: 'a', summary: 'A post summary', readTime: '1 min read',
      date: '2026-11-11', wordCount: 3, filename: 'a',
    }]);
  });

  it('fails like the build does on an invalid post', () => {
    prepare({ 'a.md': post('Bad Slug') });
    expect(() => blogIndex(directory)).toThrow('Invalid URL slug');
  });
});

describe('blogIndexPlugin', () => {
  it('serves the index as the virtual:blog-index module and watches every post', () => {
    prepare({ 'a.md': post('a'), 'b.md': post('b') });
    const plugin = blogIndexPlugin({ blogsDir: directory });
    const id = plugin.resolveId('virtual:blog-index');
    expect(plugin.resolveId('./other')).toBeUndefined();
    const context = { addWatchFile: vi.fn() };
    const code = plugin.load.call(context, id);
    expect(JSON.parse(code.replace(/^export default |;$/g, '')).map((entry) => entry.slug)).toEqual(['a', 'b']);
    expect(context.addWatchFile).toHaveBeenCalledTimes(2);
    expect(plugin.load.call(context, 'src/main.jsx')).toBeUndefined();
  });
});
