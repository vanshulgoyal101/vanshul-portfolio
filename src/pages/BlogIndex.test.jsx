import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogIndex from './BlogIndex';
import { loadBlogPosts } from '../utils/blogLoader';

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/blog']}>
      <BlogIndex />
    </MemoryRouter>
  );

const posts = loadBlogPosts();

describe('BlogIndex', () => {
  it('sets a blog-specific document title and canonical', () => {
    renderPage();
    expect(document.title).toBe('Blog — Vanshul Goyal');
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://vanshul.com/blog');
  });

  it('lists every published post with a link to its page', () => {
    renderPage();
    for (const post of posts) {
      const link = screen.getByRole('link', { name: new RegExp(post.title, 'i') });
      expect(link).toHaveAttribute('href', `/blog/${post.slug}`);
    }
  });

  it('emits Blog + BreadcrumbList structured data covering all posts', () => {
    renderPage();
    const ld = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.textContent))
      .flat();
    const blog = ld.find((x) => x['@type'] === 'Blog');
    const crumbs = ld.find((x) => x['@type'] === 'BreadcrumbList');
    expect(blog).toBeTruthy();
    expect(blog.blogPost).toHaveLength(posts.length);
    expect(crumbs.itemListElement.at(-1).item).toBe('https://vanshul.com/blog');
  });
});
