import { describe, it, expect } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('searches article text, announces results, and clears both filters with focus restored', async () => {
    const user = userEvent.setup();
    await renderPage();
    const search = screen.getByRole('searchbox', { name: 'Search writings' });
    const topic = screen.getByRole('combobox', { name: 'Topic' });
    const clear = screen.getByRole('button', { name: 'Clear filters' });
    expect(clear).toBeDisabled();
    await user.selectOptions(topic, posts[0].category);
    await user.type(search, posts[0].title);
    expect(screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual([posts[0].title]);
    expect(screen.getByRole('status')).toHaveTextContent(`1 of ${posts.length} posts`);
    await user.click(clear);
    expect(search).toHaveValue('');
    expect(search).toHaveFocus();
    expect(topic).toHaveValue('');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(posts.length);
    expect(clear).toBeDisabled();
  });

  it('shows a useful empty state without changing the canonical or full archive schema', async () => {
    const user = userEvent.setup();
    await renderPage();
    await user.type(screen.getByRole('searchbox'), 'no-article-has-this-phrase');
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent(`0 of ${posts.length} posts`);
    expect(screen.getByText(/No writings match these filters/)).toBeInTheDocument();
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe('https://vanshul.com/blog/');
    const schemas = JSON.parse(document.head.querySelector('script[data-route-seo]').textContent);
    expect(schemas.find(schema => schema['@type'] === 'Blog').blogPost).toHaveLength(posts.length);
  });

  it('offers every actual topic once, sorted, and filters without reordering posts', async () => {
    const user = userEvent.setup();
    await renderPage();
    const select = screen.getByRole('combobox');
    const topics = [...new Set(posts.map(post => post.category))].sort();
    expect(within(select).getAllByRole('option').map(option => option.value)).toEqual(['', ...topics]);
    await user.selectOptions(select, topics[0]);
    expect(screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual(
      sortBlogsByDate(posts).filter(post => post.category === topics[0]).map(post => post.title),
    );
  });
});
