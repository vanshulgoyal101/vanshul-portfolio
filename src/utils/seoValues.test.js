import { afterEach, describe, it, expect } from 'vitest';
import {
  parsePostDate,
  postDate,
  postPublishedAt,
  postTimestamp,
  compareNewestFirst,
  PUBLICATION_TIMEZONE_OFFSET,
} from './seoValues';

describe('parsePostDate', () => {
  it('reads the frontmatter style used by every post', () => {
    expect(parsePostDate('29 Jul, 2026')).toEqual({ year: 2026, month: 7, day: 29 });
    expect(parsePostDate('8 Feb, 2026')).toEqual({ year: 2026, month: 2, day: 8 });
  });

  it('accepts ISO calendar dates and full month names', () => {
    expect(parsePostDate('2025-08-27')).toEqual({ year: 2025, month: 8, day: 27 });
    expect(parsePostDate('27 August 2025')).toEqual({ year: 2025, month: 8, day: 27 });
  });

  it('rejects text, impossible dates and unknown months', () => {
    for (const value of ['', 'someday', '31 Feb, 2026', '2026-13-01', '2026-02-30', '12 Foo, 2026', undefined, null]) {
      expect(parsePostDate(value)).toBeNull();
    }
  });
});

describe('publication date formats', () => {
  it('formats the calendar date for sitemaps', () => {
    expect(postDate('29 Jul, 2026')).toBe('2026-07-29');
    expect(postDate('nope')).toBeUndefined();
  });

  it('formats an ISO 8601 publication time in the author timezone', () => {
    expect(PUBLICATION_TIMEZONE_OFFSET).toBe('+05:30');
    expect(postPublishedAt('8 Feb, 2026')).toBe('2026-02-08T00:00:00+05:30');
    expect(postPublishedAt('nope')).toBeUndefined();
  });

  it('gives the epoch time of midnight in the author timezone', () => {
    expect(new Date(postTimestamp('29 Jul, 2026')).toISOString()).toBe('2026-07-28T18:30:00.000Z');
    expect(postTimestamp('nope')).toBeNaN();
  });
});

describe('timezone independence', () => {
  const original = process.env.TZ;
  afterEach(() => {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  });

  it('produces identical values whatever the machine timezone', () => {
    const outputs = ['UTC', 'Asia/Kolkata', 'America/Los_Angeles', 'Pacific/Kiritimati'].map((zone) => {
      process.env.TZ = zone;
      return [postDate('29 Jul, 2026'), postPublishedAt('29 Jul, 2026'), postTimestamp('29 Jul, 2026')];
    });
    for (const output of outputs) expect(output).toEqual(outputs[0]);
  });
});

describe('compareNewestFirst', () => {
  it('orders posts newest first and puts undated posts last', () => {
    const posts = [
      { slug: 'old', date: '16 Nov, 2023' },
      { slug: 'undated', date: 'soon' },
      { slug: 'new', date: '29 Jul, 2026' },
      { slug: 'mid', date: '2025-08-27' },
    ];
    expect([...posts].sort(compareNewestFirst).map((post) => post.slug)).toEqual(['new', 'mid', 'old', 'undated']);
  });
});
