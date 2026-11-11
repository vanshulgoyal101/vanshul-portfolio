import { parseTags } from './seoValues';

const normalize = value => String(value ?? '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

/** Match every query word literally, preserving the archive's existing order. */
export const filterPosts = (posts, query, category = '') => {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return posts.filter(post => {
    if (category && post.category !== category) return false;
    const text = normalize([post.title, post.summary, post.category, ...parseTags(post.tags), post.content].join(' '));
    return terms.every(term => text.includes(term));
  });
};
