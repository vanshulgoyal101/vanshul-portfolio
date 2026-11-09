import { describe, it, expect } from 'vitest';
import {
  parseTags,
  postKeywords,
  postDate,
  postPublishedAt,
} from './seo.mjs';

describe('seo/parseTags', () => {
  it('splits a comma-separated string and trims', () => {
    expect(parseTags('AI, Robotics , Future of Work')).toEqual([
      'AI',
      'Robotics',
      'Future of Work',
    ]);
  });

  it('accepts an array', () => {
    expect(parseTags(['AI', 'Robotics'])).toEqual(['AI', 'Robotics']);
  });

  it('de-duplicates case-insensitively, keeping first spelling', () => {
    expect(parseTags('AI, ai, Ai')).toEqual(['AI']);
  });

  it('strips surrounding quotes', () => {
    expect(parseTags('"AI", \'Robotics\'')).toEqual(['AI', 'Robotics']);
  });

  it('returns [] for empty/missing input', () => {
    expect(parseTags(undefined)).toEqual([]);
    expect(parseTags('')).toEqual([]);
    expect(parseTags('  ,  ')).toEqual([]);
  });
});

describe('seo/postKeywords', () => {
  it('puts the category first, then tags', () => {
    expect(postKeywords({ category: 'AI', tags: 'Robotics, Agents' })).toEqual([
      'AI',
      'Robotics',
      'Agents',
    ]);
  });

  it('de-duplicates a tag that repeats the category', () => {
    expect(postKeywords({ category: 'AI', tags: 'ai, Agents' })).toEqual([
      'AI',
      'Agents',
    ]);
  });

  it('works with only a category', () => {
    expect(postKeywords({ category: 'AI' })).toEqual(['AI']);
  });

  it('returns [] when neither category nor tags exist', () => {
    expect(postKeywords({})).toEqual([]);
  });
});

describe('seo date re-exports', () => {
  it('exposes the shared publication date helpers to the build scripts', () => {
    expect(postDate('27 Aug, 2025')).toBe('2025-08-27');
    expect(postPublishedAt('27 Aug, 2025')).toBe('2025-08-27T00:00:00+05:30');
  });
});
