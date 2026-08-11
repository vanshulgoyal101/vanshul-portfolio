import { describe, it, expect } from 'vitest';
import {
  parseTags,
  postKeywords,
  isoDate,
  localCalendarDate,
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

describe('seo/isoDate', () => {
  it('formats a valid date as ISO 8601', () => {
    expect(isoDate('2025-08-27')).toBe(new Date('2025-08-27').toISOString());
  });

  it('parses human-written dates', () => {
    expect(isoDate('27 Aug, 2025')).toBe(new Date('27 Aug, 2025').toISOString());
  });

  it('returns undefined for invalid input', () => {
    expect(isoDate('not-a-date')).toBeUndefined();
  });
});

describe('seo/localCalendarDate', () => {
  it('formats as YYYY-MM-DD using local parts', () => {
    const d = new Date('2025-08-27T10:00:00');
    expect(localCalendarDate('2025-08-27T10:00:00')).toBe(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`,
    );
  });

  it('returns null for invalid input', () => {
    expect(localCalendarDate('nope')).toBeNull();
  });
});
