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

export const isoDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};