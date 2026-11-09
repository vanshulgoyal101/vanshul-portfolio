import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NotFound />
    </MemoryRouter>
  );

describe('NotFound', () => {
  it('shows a 404 with a heading and recovery links', () => {
    renderAt('/does-not-exist');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /wandered off/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /read the blog/i })).toHaveAttribute('href', '/blog/');
    expect(screen.getByRole('link', { name: /reading list/i })).toHaveAttribute('href', '/reading-list/');
  });

  it('renders inside the main landmark', () => {
    renderAt('/missing');
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }));
  });

  it('marks the page noindex', () => {
    renderAt('/nope');
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toMatch(/noindex/);
  });
});
