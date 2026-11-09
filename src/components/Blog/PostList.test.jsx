import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostList from './PostList';

const posts = [
  { slug: 'taste-is-the-last-moat', title: 'Taste Is the Last Moat', date: '29 Jul, 2026', summary: 'Producing stops being rare.', category: 'Future of Work', readTime: '4 min read' },
  { slug: 'the-two-worlds', title: 'The Two Worlds', date: '12 Oct, 2025', readTime: '3 min read' },
];

const renderList = (props = {}) =>
  render(
    <MemoryRouter>
      <PostList posts={posts} {...props} />
    </MemoryRouter>
  );

describe('PostList', () => {
  it('renders one row per post with a link named by the title alone', () => {
    renderList();
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByRole('link')).toHaveAccessibleName('Taste Is the Last Moat');
    expect(screen.getByRole('link', { name: 'Taste Is the Last Moat' })).toHaveAttribute('href', '/blog/taste-is-the-last-moat/');
    expect(screen.getByRole('link', { name: 'The Two Worlds' })).toHaveAttribute('href', '/blog/the-two-worlds/');
  });

  it('titles each post with an h3 under the surrounding section heading', () => {
    renderList();
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(['Taste Is the Last Moat', 'The Two Worlds']);
  });

  it('dates each post with a machine-readable time, with or without the year', () => {
    const { unmount } = renderList();
    expect(screen.getByText('29 Jul 2026')).toHaveAttribute('datetime', '2026-07-29');
    unmount();
    renderList({ showYear: false });
    expect(screen.getByText('29 Jul')).toHaveAttribute('datetime', '2026-07-29');
    expect(screen.queryByText('29 Jul 2026')).toBeNull();
  });

  it('lists the category, read time and, once loaded, the view count', () => {
    renderList({ views: { 'taste-is-the-last-moat': 1234 } });
    expect(screen.getByText('Future of Work · 4 min read · 1.2k views')).toBeInTheDocument();
    expect(screen.getByText('3 min read')).toBeInTheDocument();
  });

  it('shows a summary only when the post has one', () => {
    renderList();
    const [first, second] = screen.getAllByRole('listitem');
    expect(within(first).getByText('Producing stops being rare.')).toBeInTheDocument();
    expect(second.querySelectorAll('p')).toHaveLength(1);
  });
});
