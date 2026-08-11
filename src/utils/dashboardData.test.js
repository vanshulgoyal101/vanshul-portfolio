import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  fillDailySeries,
  hourSeries,
  toBars,
  shortenUrl,
  percentDelta,
  statsToCsv,
} from './dashboardData';

describe('formatNumber', () => {
  it('returns small numbers verbatim', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });
  it('compacts thousands and millions', () => {
    expect(formatNumber(1200)).toBe('1.2K');
    expect(formatNumber(3_000_000)).toBe('3M');
  });
  it('handles null/NaN safely', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
    expect(formatNumber('abc')).toBe('0');
  });
});

describe('fillDailySeries', () => {
  it('always returns exactly `days` entries oldest → newest', () => {
    const s = fillDailySeries([], 7);
    expect(s).toHaveLength(7);
    for (let i = 1; i < s.length; i++) {
      expect(s[i].day >= s[i - 1].day).toBe(true);
    }
  });
  it('zero-fills missing days', () => {
    const s = fillDailySeries([], 30);
    expect(s.every((d) => d.pageviews === 0 && d.events === 0)).toBe(true);
  });
  it('places a known day’s counts on the matching slot', () => {
    const today = new Date().toISOString().slice(0, 10);
    const s = fillDailySeries([{ day: today, pageviews: 5, events: 9 }], 3);
    const last = s[s.length - 1];
    expect(last.day).toBe(today);
    expect(last.pageviews).toBe(5);
    expect(last.events).toBe(9);
  });
  it('clamps the window to a sane range', () => {
    expect(fillDailySeries([], 0)).toHaveLength(1);
    expect(fillDailySeries([], 10000)).toHaveLength(365);
  });
});

describe('hourSeries', () => {
  it('always returns 24 slots hour 0→23', () => {
    const s = hourSeries([{ hour: 5, pageviews: 3 }]);
    expect(s).toHaveLength(24);
    expect(s[0].hour).toBe(0);
    expect(s[23].hour).toBe(23);
    expect(s[5].pageviews).toBe(3);
    expect(s[6].pageviews).toBe(0);
  });
});

describe('toBars', () => {
  it('maps rows and reports the max (min 1)', () => {
    const { items, max } = toBars(
      [{ site: 'a', v: 2 }, { site: 'b', v: 7 }],
      (r) => r.site,
      'v'
    );
    expect(items).toEqual([{ name: 'a', value: 2 }, { name: 'b', value: 7 }]);
    expect(max).toBe(7);
  });
  it('never returns a zero max (avoids divide-by-zero)', () => {
    expect(toBars([], (r) => r.x, 'v').max).toBe(1);
  });
});

describe('shortenUrl', () => {
  it('drops protocol and trailing slash', () => {
    expect(shortenUrl('https://games.vanshul.com/')).toBe('games.vanshul.com');
  });
  it('truncates very long urls', () => {
    const long = 'https://example.com/' + 'a'.repeat(100);
    const out = shortenUrl(long);
    expect(out.length).toBeLessThanOrEqual(48);
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('percentDelta', () => {
  it('computes a rounded percentage change', () => {
    expect(percentDelta(120, 100)).toBe(20);
    expect(percentDelta(80, 100)).toBe(-20);
    expect(percentDelta(150, 100)).toBe(50);
  });
  it('returns 0 when both are zero and no change', () => {
    expect(percentDelta(0, 0)).toBe(0);
    expect(percentDelta(100, 100)).toBe(0);
  });
  it('returns null when there is no prior baseline (avoids +Infinity)', () => {
    expect(percentDelta(50, 0)).toBeNull();
    expect(percentDelta(undefined, undefined)).toBe(0);
  });
});

describe('statsToCsv', () => {
  const stats = {
    window_hours: 720,
    range_pageviews: 500,
    per_site: [{ site: 'portfolio', pageviews: 900, visitors: 200 }],
    top_pages: [{ site: 'portfolio', path: '/', pageviews: 300 }],
    per_tool: [{ site: 'tools', name: 'jwt', uses: 42 }],
    per_link: [{ name: 'https://games.vanshul.com/', site: 'links', clicks: 10 }],
    top_referrers: [{ referrer: 'google.com', count: 50 }],
    arcade: { per_game: [{ game: 'wordle', plays: 20 }] },
  };

  it('produces a header and one row per metric and breakdown entry', () => {
    const csv = statsToCsv(stats);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('section,label,value');
    expect(csv).toContain('metric,range_pageviews,500');
    expect(csv).toContain('site,portfolio,900');
    expect(csv).toContain('page,portfolio/,300');
    expect(csv).toContain('tool,tools/jwt,42');
    expect(csv).toContain('referrer,google.com,50');
    expect(csv).toContain('game,wordle,20');
  });

  it('escapes values containing commas or quotes', () => {
    const csv = statsToCsv({ per_link: [{ name: 'a,b"c', site: 'x', clicks: 1 }] });
    expect(csv).toContain('"a,b""c"');
  });

  it('returns an empty string for nullish input', () => {
    expect(statsToCsv(null)).toBe('');
    expect(statsToCsv(undefined)).toBe('');
  });
});
