import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blog from './Blog';
import { BLOG_CONTENT } from '../../constants/blogConstants';

const renderBlog = () =>
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );

describe('Blog section', () => {
  it('renders the section title and subtitle', () => {
    renderBlog();
    expect(screen.getByText(BLOG_CONTENT.sectionTitle)).toBeInTheDocument();
    expect(screen.getByText(BLOG_CONTENT.sectionSubtitle)).toBeInTheDocument();
  });

  it('renders the closing quote and author', () => {
    renderBlog();
    expect(screen.getByText(BLOG_CONTENT.quote.text)).toBeInTheDocument();
    expect(screen.getByText(BLOG_CONTENT.quote.author)).toBeInTheDocument();
  });

  it('renders blog cards for the loaded posts', () => {
    renderBlog();
    // At least one blog post link should be present
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    expect(links.some((l) => l.getAttribute('href')?.startsWith('/blog/'))).toBe(true);
  });

  it('has a section landmark with id "blog"', () => {
    const { container } = renderBlog();
    expect(container.querySelector('#blog')).not.toBeNull();
  });
});
