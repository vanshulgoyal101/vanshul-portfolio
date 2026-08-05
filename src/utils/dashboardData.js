// Pure data-shaping helpers for the analytics dashboard. Kept separate from the
// React component so they can be unit tested without a DOM.

/** Compact number formatting: 1200 -> "1.2k", 3_000_000 -> "3M". */
export const formatNumber = (n) => {
  if (n == null || Number.isNaN(Number(n))) return '0';
  const num = Number(n);
  if (Math.abs(num) < 1000) return String(num);
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

/**
 * Build a gap-free daily series for the last `days` days (oldest → newest),
 * zero-filling missing days, from web_stats().by_day rows ({ day, pageviews, events }).
 */
export const fillDailySeries = (byDay, days = 30) => {
  const map = new Map(
    (byDay || []).map((d) => [d.day, { pageviews: d.pageviews || 0, events: d.events || 0 }])
  );
  const out = [];
  const raw = Number(days);
  const n = Math.max(1, Math.min(Number.isFinite(raw) ? raw : 30, 365));
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 86400000);
    const key = dt.toISOString().slice(0, 10);
    const hit = map.get(key) || { pageviews: 0, events: 0 };
    out.push({
      day: key,
      label: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      pageviews: hit.pageviews,
      events: hit.events,
    });
  }
  return out;
};

/** Normalise web_stats().by_hour into a fixed 24-slot array (hour 0→23). */
export const hourSeries = (byHour) => {
  const map = new Map((byHour || []).map((h) => [h.hour, h.pageviews || 0]));
  return Array.from({ length: 24 }, (_, h) => ({ hour: h, pageviews: map.get(h) || 0 }));
};

/**
 * Map arbitrary rows to bar-chart items and attach the series max, so a caller
 * can size bars as a percentage without recomputing the maximum.
 */
export const toBars = (rows, nameFn, valueKey) => {
  const items = (rows || []).map((r) => ({ name: nameFn(r), value: Number(r[valueKey]) || 0 }));
  const max = items.reduce((m, i) => Math.max(m, i.value), 0);
  return { items, max: Math.max(1, max) };
};

/** Shorten an outbound URL for display (drop protocol, trim length). */
export const shortenUrl = (url) => {
  const s = String(url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return s.length > 48 ? s.slice(0, 47) + '…' : s;
};
