import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blog from './Blog';
import { BLOG_CONTENT } from '../../constants/blogConstants';

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
    // At least one blog post link should be present
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    expect(links.some((l) => l.getAttribute('href')?.startsWith('/blog/'))).toBe(true);
  });

  it('renders a section without duplicating the page-owned blog anchor', async () => {
    const { container } = await renderBlog();
    expect(screen.getByRole('heading', { name: BLOG_CONTENT.sectionTitle }).closest('section')).not.toBeNull();
    expect(container.querySelector('#blog')).toBeNull();
  });
});
