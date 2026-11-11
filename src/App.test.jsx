import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import App from './App';
import { RETRY_KEY } from './utils/routeRetry';
// Keep cold source transforms outside routing assertion timeouts. The browser
// performance suite separately checks the actual lazy chunk boundary.
import './pages/Home';

// The private dashboard talks to Supabase auth; routing tests only need its
// shell. `fail` makes it throw like a page whose code could not be loaded.
const dashboard = vi.hoisted(() => ({ fail: false }));
vi.mock('./pages/Dashboard', () => ({
  default: () => {
    if (dashboard.fail) throw new Error('Failed to fetch dynamically imported module');
    return <h1>Owner dashboard</h1>;
  },
}));

// Route composition does not need decorative idle work; the shell suite tests it.
vi.mock('./hooks/useIdle', () => ({ useIdle: () => false }));

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
  await act(() => vi.dynamicImportSettled());
  return result;
};

// Subpages are lazy chunks; their first import can take over a second when the
// whole suite transforms in parallel, so lookups allow for that cold start.
const LAZY = { timeout: 5000 };
// Routing checks need the actual h1, not jsdom's expensive accessible-name and
// computed-visibility scan of the entire styled homepage. Browser tests verify
// painted visibility and accessibility separately.
const findPageHeading = (name) => screen.findByText(name, { selector: 'h1' }, LAZY);

// A lazy page can be found in the DOM before its effects (which write the head
// tags) have run, so head assertions after a lazy load wait for them.
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content');

describe('App routing', () => {
  beforeEach(preferReducedMotion);

  it('composes every homepage section at /', async () => {
    await renderAt('/');
    await findPageHeading('Vanshul Goyal');
    for (const id of ['home', 'projects', 'about', 'work', 'blog', 'contact']) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(await findPageHeading('Vanshul Goyal')).toBeInTheDocument();
    expect(document.title).toBe('Vanshul Goyal');
    expect(canonical()).toBe('https://vanshul.com/');
  });

  it('serves the writing archive at its canonical URL', async () => {
    await renderAt('/blog/');
    expect(await findPageHeading('Writings')).toBeInTheDocument();
    await waitFor(() => expect(canonical()).toBe('https://vanshul.com/blog/'));
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
    await waitFor(() => expect(canonical()).toBe('https://vanshul.com/blog/the-new-leverage/'));
  });

  it('serves the reading list', async () => {
    await renderAt('/reading-list/');
    expect(await findPageHeading('From My Shelf')).toBeInTheDocument();
    await waitFor(() => expect(canonical()).toBe('https://vanshul.com/reading-list/'));
  });

  it('renders a noindex page for unknown paths', async () => {
    await renderAt('/definitely-not-a-page');
    expect(await screen.findByRole('heading', { name: /wandered off/i }, LAZY)).toBeInTheDocument();
    expect(robots()).toMatch(/noindex/);
  });

  it('marks an unknown post as noindex', async () => {
    await renderAt('/blog/not-a-real-post/');
    expect(await findPageHeading('Blog Post Not Found')).toBeInTheDocument();
    await waitFor(() => expect(robots()).toMatch(/noindex/));
  });

  it('serves a featured project story at its canonical URL', async () => {
    await renderAt('/projects/nasa-herc/');
    expect(await findPageHeading('NASA Human Exploration Rover Challenge')).toBeInTheDocument();
    await waitFor(() => expect(canonical()).toBe('https://vanshul.com/projects/nasa-herc/'));
    expect(robots()).not.toMatch(/noindex/);
  });

  it('renders the noindex 404 state for an unknown project', async () => {
    await renderAt('/projects/not-a-project/');
    expect(await screen.findByRole('heading', { name: /wandered off/i }, LAZY)).toBeInTheDocument();
    await waitFor(() => expect(robots()).toMatch(/noindex/));
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
    await findPageHeading('Vanshul Goyal');
    await waitFor(() => expect(schemaTypes()).toEqual(expect.arrayContaining(['WebSite', 'Person', 'ProfilePage'])));
    unmount();

    await renderAt('/blog/the-new-leverage/');
    await findPageHeading('The New Leverage');
    await waitFor(() => expect(schemaTypes()).toContain('BlogPosting'));
    expect(schemaTypes()).not.toContain('ProfilePage');
  });
});

describe('App page failures', () => {
  beforeEach(() => {
    preferReducedMotion();
    dashboard.fail = true;
    // Pretend the one automatic reload already happened.
    sessionStorage.setItem(RETRY_KEY, String(Date.now()));
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    dashboard.fail = false;
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('replaces a failed page with an error page that keeps the navigation', async () => {
    await renderAt('/dashboard');
    expect(await findPageHeading("This page didn't load")).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('recovers as soon as the visitor navigates elsewhere', async () => {
    await renderAt('/dashboard');
    fireEvent.click(await screen.findByRole('link', { name: 'Back home' }, LAZY));
    expect(await findPageHeading('Vanshul Goyal')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: "This page didn't load" })).toBeNull();
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
