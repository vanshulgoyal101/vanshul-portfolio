import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogCard from './BlogCard';
import { BLOG_ANIMATION_VARIANTS } from '../../constants/blogConstants';

const baseBlog = {
  id: 1,
  title: 'The New Leverage',
  summary: 'A short summary of the post.',
  date: 'Jan 1, 2024',
  readTime: '5 min read',
  slug: 'the-new-leverage',
  category: 'AI',
};

const renderCard = (blog = baseBlog, props = {}) =>
  render(
    <MemoryRouter>
      <BlogCard
        blog={blog}
        index={0}
        variants={BLOG_ANIMATION_VARIANTS.item}
        {...props}
      />
    </MemoryRouter>
  );

describe('BlogCard', () => {
  it('returns null when no blog is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <BlogCard blog={null} index={0} variants={BLOG_ANIMATION_VARIANTS.item} />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the blog title', () => {
    renderCard();
    expect(screen.getByText('The New Leverage')).toBeInTheDocument();
  });

  it('renders the blog summary', () => {
    renderCard();
    expect(screen.getByText('A short summary of the post.')).toBeInTheDocument();
  });

  it('renders the date and read time', () => {
    renderCard();
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it('renders a "Read More" affordance', () => {
    renderCard();
    expect(screen.getByText(/Read More/)).toBeInTheDocument();
  });

  it('links to the correct blog post URL', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/the-new-leverage');
  });

  it('exposes an accessible label for the post', () => {
    renderCard();
    expect(
      screen.getByLabelText('Blog post: The New Leverage')
    ).toBeInTheDocument();
  });

  it('renders correctly for a different blog', () => {
    renderCard({ ...baseBlog, title: 'Two Worlds', slug: 'the-two-worlds' });
    expect(screen.getByText('Two Worlds')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/the-two-worlds');
  });
});
