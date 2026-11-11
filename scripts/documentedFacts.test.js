// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOOKS, ESSAYS } from '../src/constants/books.js';

// Prose has no compiler: every version or count the docs quote is compared
// with the registry that defines it, so the next dependency bump or shelf
// addition fails here instead of drifting silently.
const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const manifest = JSON.parse(read('package.json'));
const declaredMajor = (name) => {
  const range = manifest.dependencies[name] ?? manifest.devDependencies[name];
  return Number(range.match(/\d+/)[0]);
};

// The stack summaries that name major versions.
const STACK_DOCS = ['README.md', 'FEATURES.md', 'documentation/architecture.md'];
const STACK = [
  ['React', 'react'],
  ['Vite', 'vite'],
  ['`@vitejs/plugin-react`', '@vitejs/plugin-react'],
  ['Framer Motion', 'framer-motion'],
  ['react-router(?:-dom)?', 'react-router-dom'],
  ['styled-components', 'styled-components'],
  ['Vitest', 'vitest'],
  ['ESLint', 'eslint'],
];

// A bare major ("Vite 8"), not a minor ("Vitest 5.1") or another word ("React Testing").
const quotedMajors = (text, label) =>
  [...text.matchAll(new RegExp(`(?<![\\w-])${label} (\\d+)(?![\\d.]*\\d)`, 'g'))].map(match => Number(match[1]));

describe('documented facts', () => {
  it.each(STACK_DOCS)('%s quotes the declared major versions', (doc) => {
    const text = read(doc);
    const stale = STACK.flatMap(([label, pkg]) => quotedMajors(text, label)
      .filter(major => major !== declaredMajor(pkg))
      .map(major => `${doc} says ${pkg} ${major}; package.json declares ${declaredMajor(pkg)}`));
    expect(stale).toEqual([]);
  });

  // Guards the guard: a mistyped label would match nothing and pass vacuously.
  it('finds every tracked package in the stack summaries', () => {
    const docs = STACK_DOCS.map(read).join('\n');
    expect(STACK.filter(([label]) => quotedMajors(docs, label).length === 0).map(([, pkg]) => pkg)).toEqual([]);
  });

  it('quotes the current shelf counts', () => {
    const features = read('FEATURES.md');
    expect(features.match(/Books \((\d+)\)/)?.[1], 'FEATURES.md book count is stale').toBe(String(BOOKS.length));
    expect(features.match(/Essays \((\d+)\)/)?.[1], 'FEATURES.md essay count is stale').toBe(String(ESSAYS.length));
  });

  it('quotes the current post count in the styles guide example', () => {
    const posts = readdirSync(join(process.cwd(), 'src/blogs')).filter(file => file.endsWith('.md')).length;
    expect(read('documentation/styles.md').match(/Archive · (\d+) posts/)?.[1], 'documentation/styles.md post count is stale').toBe(String(posts));
  });
});
