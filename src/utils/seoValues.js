// Browser-safe value helpers shared by the React app and the Node build
// scripts, so runtime metadata and prerendered metadata are identical.

export const parseTags = value => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  const seen = new Set();
  return list.map(value => String(value).trim().replace(/^["']|["']$/g, '')).filter(tag => {
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const postKeywords = post => parseTags([post.category || '', ...parseTags(post.tags)]);

// Post dates are calendar dates in the author's timezone (India Standard Time,
// the same zone the analytics dashboard reports in). Parsing them explicitly,
// instead of with `new Date(string)`, keeps every output identical whatever the
// timezone of the build machine or the reader.
export const PUBLICATION_TIMEZONE_OFFSET = '+05:30';
const OFFSET_MINUTES = 5 * 60 + 30;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Parse a frontmatter date ("29 Jul, 2026" or "2026-07-29") into calendar
 * parts, or null when it is not a real date.
 * @param {unknown} value
 * @returns {{ year: number, month: number, day: number } | null}
 */
export const parsePostDate = value => {
  const text = String(value ?? '').trim();
  let year;
  let month;
  let day;
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const human = text.match(/^(\d{1,2}) ([A-Za-z]{3,9}),? (\d{4})$/);
  if (iso) {
    [year, month, day] = iso.slice(1).map(Number);
  } else if (human) {
    day = Number(human[1]);
    month = MONTHS.indexOf(human[2].slice(0, 3).toLowerCase()) + 1;
    year = Number(human[3]);
  } else {
    return null;
  }
  const check = new Date(Date.UTC(year, month - 1, day));
  if (month < 1 || check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day };
};

const pad = number => String(number).padStart(2, '0');

/** Calendar date as `YYYY-MM-DD` (sitemap `<lastmod>`), or undefined. */
export const postDate = value => {
  const parts = parsePostDate(value);
  return parts ? `${parts.year}-${pad(parts.month)}-${pad(parts.day)}` : undefined;
};

/** ISO 8601 publication time with offset (JSON-LD, Open Graph), or undefined. */
export const postPublishedAt = value => {
  const date = postDate(value);
  return date ? `${date}T00:00:00${PUBLICATION_TIMEZONE_OFFSET}` : undefined;
};

/**
 * The date a post last changed meaningfully: its optional `updated` date when
 * that is a real date, otherwise its publication `date`.
 */
export const postLastModified = post => (parsePostDate(post?.updated) ? post.updated : post?.date);

/** Epoch milliseconds of the publication instant (sorting, RSS), or NaN. */
export const postTimestamp = value => {
  const parts = parsePostDate(value);
  return parts ? Date.UTC(parts.year, parts.month - 1, parts.day) - OFFSET_MINUTES * 60000 : NaN;
};

/** Last substantive revision, falling back to publication for unchanged posts. */
export const postModifiedDate = postLastModified;

/** Comparator ordering posts newest first; undated posts sort last. */
export const compareNewestFirst = (a, b) => {
  const time = post => {
    const value = postTimestamp(post?.date);
    return Number.isNaN(value) ? -Infinity : value;
  };
  return time(b) === time(a) ? 0 : time(b) > time(a) ? 1 : -1;
};
