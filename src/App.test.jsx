import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// The private dashboard talks to Supabase auth; routing tests only need its shell.
vi.mock('./pages/Dashboard', () => ({ default: () => <h1>Owner dashboard</h1> }));

// Reduced motion completes the greeting immediately and skips decorative work,
// so the tests exercise routing and page composition only.
const preferReducedMotion = () => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

const renderAt = async (path) => {
  window.history.pushState({}, '', path);
  const result = render(<App />);
  await act(async () => {});
  return result;
};

// Subpages are lazy chunks; their first import can take over a second when the
// whole suite transforms in parallel, so lookups allow for that cold start.
const LAZY = { timeout: 5000 };
const findPageHeading = (name) => screen.findByRole('heading', { level: 1, name }, LAZY);

const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content');

describe('App routing', () => {
  beforeEach(preferReducedMotion);

  it('composes every homepage section at /', async () => {
    await renderAt('/');
    for (const id of ['home', 'projects', 'about', 'work', 'blog', 'contact']) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Vanshul Goyal' })).toBeInTheDocument();
    expect(document.title).toBe('Vanshul Goyal');
    expect(canonical()).toBe('https://vanshul.com/');
  });

  it('serves the writing archive at its canonical URL', async () => {
    await renderAt('/blog/');
    expect(await findPageHeading('Writings')).toBeInTheDocument();
    expect(canonical()).toBe('https://vanshul.com/blog/');
  });

  it('redirects the legacy /blogs alias to the archive', async () => {
    await renderAt('/blogs');
    await waitFor(() => expect(window.location.pathname).toBe('/blog/'));
    expect(await findPageHeading('Writings')).toBeInTheDocument();
  });

  it('redirects legacy /blogs/:slug links to the canonical post URL', async () => {
    await renderAt('/blogs/the-new-leverage');
    await waitFor(() => expect(window.location.pathname).toBe('/blog/the-new-leverage/'));
    expect(await findPageHeading('The New Leverage')).toBeInTheDocument();
    expect(canonical()).toBe('https://vanshul.com/blog/the-new-leverage/');
  });

  it('serves the reading list', async () => {
    await renderAt('/reading-list/');
    expect(await findPageHeading('From My Shelf')).toBeInTheDocument();
    expect(canonical()).toBe('https://vanshul.com/reading-list/');
  });

  it('renders a noindex page for unknown paths', async () => {
    await renderAt('/definitely-not-a-page');
    expect(await screen.findByRole('heading', { name: /wandered off/i }, LAZY)).toBeInTheDocument();
    expect(robots()).toMatch(/noindex/);
  });

  it('marks an unknown post as noindex', async () => {
    await renderAt('/blog/not-a-real-post/');
    expect(await findPageHeading('Blog Post Not Found')).toBeInTheDocument();
    expect(robots()).toMatch(/noindex/);
  });
});

const schemaTypes = () =>
  [...document.head.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((script) => [JSON.parse(script.textContent)].flat())
    .flatMap((schema) => schema['@graph'] ?? [schema])
    .map((schema) => schema['@type']);

describe('App structured data', () => {
  beforeEach(preferReducedMotion);

  it('describes the person and profile page only on the homepage', async () => {
    const { unmount } = await renderAt('/');
    expect(schemaTypes()).toEqual(expect.arrayContaining(['WebSite', 'Person', 'ProfilePage']));
    unmount();

    await renderAt('/blog/the-new-leverage/');
    await findPageHeading('The New Leverage');
    expect(schemaTypes()).toContain('BlogPosting');
    expect(schemaTypes()).not.toContain('ProfilePage');
  });
});

describe('App footer', () => {
  beforeEach(preferReducedMotion);

  it.each(['/', '/blog/', '/blog/the-new-leverage/', '/reading-list/', '/no-such-page', '/dashboard'])('ends %s with the site footer', async (path) => {
    await renderAt(path);
    expect(await screen.findByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Footer links' })).toBeInTheDocument();
  });
});
