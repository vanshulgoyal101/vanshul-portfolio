import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogIndex from './BlogIndex';
import { loadBlogPosts } from '../utils/blogLoader';
import { sortBlogsByDate } from '../utils/blogUtils';
import { parsePostDate } from '../utils/seoValues';

// View counts arrive from an async fetch; let it settle so React state updates
// happen inside act().
const renderPage = async () => {
  const result = render(
    <MemoryRouter initialEntries={['/blog/']}>
      <BlogIndex />
    </MemoryRouter>
  );
  await act(async () => {});
  return result;
};

const posts = loadBlogPosts();

describe('BlogIndex', () => {
  it('sets a blog-specific document title and canonical', async () => {
    await renderPage();
    expect(document.title).toBe('Blog — Vanshul Goyal');
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://vanshul.com/blog/');
  });

  it('lists every published post with a link to its page', async () => {
    await renderPage();
    for (const post of posts) {
      const link = screen.getByRole('link', { name: new RegExp(post.title, 'i') });
      expect(link).toHaveAttribute('href', `/blog/${post.slug}/`);
    }
  });

  it('emits Blog + BreadcrumbList structured data covering all posts', async () => {
    await renderPage();
    const ld = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.textContent))
      .flat();
    const blog = ld.find((x) => x['@type'] === 'Blog');
    const crumbs = ld.find((x) => x['@type'] === 'BreadcrumbList');
    expect(blog).toBeTruthy();
    expect(blog.blogPost).toHaveLength(posts.length);
    expect(crumbs.itemListElement.at(-1).item).toBe('https://vanshul.com/blog/');
  });

  it('groups the archive by year, newest first, with posts newest first inside', async () => {
    await renderPage();
    const years = [...new Set(sortBlogsByDate(posts).map((post) => String(parsePostDate(post.date).year)))];
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(years);
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(sortBlogsByDate(posts).map((post) => post.title));
  });

  it('counts the posts and links to the RSS feed and the reading list', async () => {
    await renderPage();
    expect(screen.getByText(`Archive · ${posts.length} posts`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'RSS feed' })).toHaveAttribute('href', '/feed.xml');
    expect(screen.getByRole('link', { name: 'Reading list' })).toHaveAttribute('href', '/reading-list/');
  });

  it('puts the archive in the main landmark', async () => {
    await renderPage();
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1, name: 'Writings' }));
  });
});
