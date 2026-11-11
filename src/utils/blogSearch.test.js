import { describe, expect, it } from 'vitest';
import { filterPosts } from './blogSearch';

const posts = [
  { slug: 'first', title: 'Café AI', summary: 'Tools for work', category: 'Technology', tags: 'Robotics, Future', content: 'Agents build prototypes.' },
  { slug: 'second', title: 'Stories', summary: 'Preserving memories', category: 'Culture', content: 'A family archive.' },
];

describe('archive search', () => {
  it('returns all posts for whitespace and preserves input and order', () => {
    expect(filterPosts(posts, ' \t ')).toEqual(posts);
    expect(posts.map(post => post.slug)).toEqual(['first', 'second']);
  });
  it.each(['CAFE', 'tools', 'technology', 'robotics', 'prototypes', ' AI \t FUTURE '])('matches %s across all article fields', query => {
    expect(filterPosts(posts, query)).toEqual([posts[0]]);
  });
  it('requires every word and combines text with exact category filtering', () => {
    expect(filterPosts(posts, 'AI memories')).toEqual([]);
    expect(filterPosts(posts, 'archive', 'Culture')).toEqual([posts[1]]);
    expect(filterPosts(posts, 'archive', 'Technology')).toEqual([]);
    expect(filterPosts(posts, '', 'Culture')).toEqual([posts[1]]);
  });
  it('treats punctuation and regex characters as literal text', () => {
    expect(filterPosts(posts, '.*')).toEqual([]);
    expect(filterPosts(posts, '[')).toEqual([]);
  });
  it('handles missing optional fields and an empty collection', () => {
    expect(filterPosts([{ title: 'Minimal' }], 'minimal')).toEqual([{ title: 'Minimal' }]);
    expect(filterPosts([], 'anything')).toEqual([]);
  });
});
