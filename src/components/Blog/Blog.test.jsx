import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blog from './Blog';
import { BLOG_CONTENT } from '../../constants/blogConstants';
import { loadBlogPosts } from '../../utils/blogLoader';
import { sortBlogsByDate } from '../../utils/blogUtils';

// View counts arrive from an async fetch; let it settle so React state updates
// happen inside act().
const renderBlog = async () => {
  const result = render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );
  await act(async () => {});
  return result;
};

describe('Blog section', () => {
  it('renders the section title and subtitle', async () => {
    await renderBlog();
    expect(screen.getByText(BLOG_CONTENT.sectionTitle)).toBeInTheDocument();
    expect(screen.getByText(BLOG_CONTENT.sectionSubtitle)).toBeInTheDocument();
  });

  it('renders the closing quote and author', async () => {
    await renderBlog();
    expect(screen.getByText(BLOG_CONTENT.quote.text)).toBeInTheDocument();
    expect(screen.getByText(BLOG_CONTENT.quote.author)).toBeInTheDocument();
  });

  it('renders blog cards for the loaded posts', async () => {
    await renderBlog();
    const featuredPosts = sortBlogsByDate(loadBlogPosts()).slice(0, 3);
    const postLinks = screen.getAllByRole('link').filter((link) =>
      /^\/blog\/[^/]+\/$/.test(link.getAttribute('href') ?? '')
    );

    expect(postLinks).toHaveLength(featuredPosts.length);
    featuredPosts.forEach((post) => {
      expect(screen.getByRole('link', { name: new RegExp(post.title, 'i') }))
        .toHaveAttribute('href', `/blog/${post.slug}/`);
    });
  });

  it('links to the complete writing archive when more posts are available', async () => {
    await renderBlog();
    const postCount = loadBlogPosts().length;

    expect(screen.getByRole('link', { name: `View all ${postCount} posts` }))
      .toHaveAttribute('href', '/blog/');
  });

  it('renders a section without duplicating the page-owned blog anchor', async () => {
    const { container } = await renderBlog();
    expect(screen.getByRole('heading', { name: BLOG_CONTENT.sectionTitle }).closest('section')).not.toBeNull();
    expect(container.querySelector('#blog')).toBeNull();
  });
});
