import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';
import { NOT_FOUND_QUIPS } from '../constants/wit';

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

  it('adds a random quip and names the missing path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = renderAt('/caf%C3%A9/menu');
    expect(container.querySelector('[data-not-found-quip]')).toHaveTextContent(NOT_FOUND_QUIPS[0]);
    expect(container.querySelector('code')).toHaveTextContent('/café/menu');
    vi.restoreAllMocks();
  });

  it('shows a path that cannot be decoded as it is', () => {
    const { container } = renderAt('/bad%E0%A4%A');
    expect(container.querySelector('code')).toHaveTextContent('/bad%E0%A4%A');
  });

  it('marks the page noindex', () => {
    renderAt('/nope');
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toMatch(/noindex/);
  });
});
