import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the analytics client so no network/auth happens in tests.
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));
const mockRpc = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock('../lib/analyticsClient', () => ({
  OWNER_EMAIL: 'vanshulg101@gmail.com',
  analytics: {
    auth: {
      getSession: (...a) => mockGetSession(...a),
      onAuthStateChange: (...a) => mockOnAuthStateChange(...a),
      signInWithOAuth: (...a) => mockSignIn(...a),
      signOut: (...a) => mockSignOut(...a),
    },
    rpc: (...a) => mockRpc(...a),
  },
}));

import Dashboard from './Dashboard';

// Metric labels read "<name> <scope>", e.g. "Game plays all-time".
const metric = (label) => screen.getByText((_, element) => element.tagName === 'DT' && element.textContent === label);

// The page renders inside the shared layout, whose navigation needs a router.
const renderDashboard = () => render(<MemoryRouter initialEntries={['/dashboard']}><Dashboard /></MemoryRouter>);

const sessionFor = (email) => ({ data: { session: email ? { user: { email } } : null } });

const sampleStats = {
  window_hours: 720,
  total_pageviews: 1234,
  unique_visitors: 321,
  range_pageviews: 500,
  range_visitors: 120,
  range_events: 800,
  prev_pageviews: 400,
  prev_visitors: 150,
  pageviews_today: 12,
  events_today: 20,
  per_site: [{ site: 'portfolio', pageviews: 900, visitors: 200 }],
  top_pages: [{ site: 'portfolio', path: '/', pageviews: 300 }],
  per_tool: [{ site: 'tools', name: 'jwt', uses: 42 }],
  per_link: [{ name: 'https://games.vanshul.com/', site: 'links', clicks: 10 }],
  top_referrers: [{ referrer: 'google.com', count: 50 }],
  by_hour: [{ hour: 9, pageviews: 30 }],
  by_day: [],
  arcade: { total_visits: 5, total_plays: 400, range_plays: 40, per_game: [{ game: 'wordle', plays: 20 }] },
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it('prompts for sign-in when signed out', async () => {
    mockGetSession.mockResolvedValue(sessionFor(null));
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Sign in with Google')).toBeInTheDocument());
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('blocks a non-owner account', async () => {
    mockGetSession.mockResolvedValue(sessionFor('someone@else.com'));
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Not authorized')).toBeInTheDocument());
    expect(screen.getByText('someone@else.com does not have access to this dashboard.')).toBeInTheDocument();
    expect(screen.queryByLabelText('Time range')).not.toBeInTheDocument();
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('lets a non-owner account sign out', async () => {
    mockGetSession.mockResolvedValue(sessionFor('someone@else.com'));
    mockSignOut.mockResolvedValueOnce({ error: null });
    renderDashboard();
    fireEvent.click(await screen.findByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('button', { name: 'Sign in with Google' })).toBeEnabled();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('names the selected window on range-bound metrics', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    renderDashboard();
    await screen.findByText('Pageviews by site');
    expect(metric('Pageviews 30 days')).toBeInTheDocument();
    expect(metric('Game plays 30 days')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Time range'), { target: { value: '24' } });
    await waitFor(() => expect(metric('Pageviews 24 hours')).toBeInTheDocument());
    expect(metric('Visitors 24 hours')).toBeInTheDocument();
    expect(screen.queryByText((_, element) => element.tagName === 'DT' && element.textContent === 'Pageviews 30 days')).not.toBeInTheDocument();
  });

  it('loads and renders stats for the owner', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    renderDashboard();

    await waitFor(() => expect(screen.getByText('Pageviews by site')).toBeInTheDocument());
    expect(mockRpc).toHaveBeenCalledWith('web_stats', { window_hours: 720 });
    expect(screen.getByText('Top pages')).toBeInTheDocument();
    expect(screen.getByText('Top tools used')).toBeInTheDocument();
    expect(screen.getByText('Plays per game')).toBeInTheDocument();
    // Arcade totals surfaced as cards (not just the per-game breakdown).
    expect(screen.getByText('Arcade')).toBeInTheDocument();
    expect(metric('Game plays all-time')).toBeInTheDocument();
    expect(metric('Arcade visits all-time')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /full arcade dashboard/i })).toHaveAttribute(
      'href',
      'https://games.vanshul.com/stats/'
    );
    // Period-over-period delta on the range card: 500 vs 400 = +25%.
    expect(screen.getByText(/25%/)).toBeInTheDocument();
  });

  it('re-queries with a 24-hour window when the range changes', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Pageviews by site')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Time range'), { target: { value: '24' } });
    await waitFor(() => expect(mockRpc).toHaveBeenCalledWith('web_stats', { window_hours: 24 }));
  });

  it('surfaces an RPC error', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: null, error: { message: 'not authorized' } });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('not authorized')).toBeInTheDocument());
  });

  it('retains all daily values in a keyboard-focusable year chart', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    renderDashboard();
    await screen.findByText('Pageviews by site');
    fireEvent.change(screen.getByLabelText('Time range'), { target: { value: '8760' } });
    const chart = await screen.findByRole('region', { name: 'Daily pageviews chart' });
    expect(chart).toHaveAttribute('tabindex', '0');
    expect(chart.querySelectorAll('[role="img"]')).toHaveLength(365);
    expect(chart.firstElementChild).toHaveStyle({ gridTemplateColumns: 'repeat(365, minmax(4px, 1fr))' });
  });

  it('exports the current stats as a CSV download', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    const createURL = vi.fn(() => 'blob:mock');
    URL.createObjectURL = createURL;
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderDashboard();
    // Wait for the stats to load — the Export button is disabled until then.
    await waitFor(() => expect(screen.getByText('Pageviews by site')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Export CSV'));

    expect(createURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('recovers from a rejected session restore', async () => {
    mockGetSession.mockRejectedValueOnce(new Error('offline'));
    renderDashboard();
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not restore your session');
    expect(screen.getByText('Sign in with Google')).toBeEnabled();
  });

  it('handles rejected stats and permits retry', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ data: sampleStats });
    renderDashboard();
    expect(await screen.findByRole('alert')).toHaveTextContent('offline');
    fireEvent.click(screen.getByText('Refresh'));
    expect(await screen.findByText('Pageviews by site')).toBeInTheDocument();
  });

  it('ignores an old range response after a newer range has loaded', async () => {
    let resolveOld;
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
      .mockResolvedValue({ data: { ...sampleStats, total_pageviews: 987 } });
    renderDashboard();
    fireEvent.change(await screen.findByLabelText('Time range'), { target: { value: '24' } });
    expect(await screen.findByText('987')).toBeInTheDocument();
    await act(async () => resolveOld({ data: sampleStats }));
    expect(screen.getByText('987')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeEnabled();
  });

  it('does not let session restoration overwrite a newer auth event', async () => {
    let resolveSession;
    mockGetSession.mockImplementationOnce(() => new Promise(resolve => { resolveSession = resolve; }));
    renderDashboard();
    act(() => mockOnAuthStateChange.mock.calls[0][0]('SIGNED_OUT', null));
    await act(async () => resolveSession(sessionFor('vanshulg101@gmail.com')));
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('clears private stats after sign-out even when an RPC resolves late', async () => {
    let resolveStats;
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockImplementationOnce(() => new Promise(resolve => { resolveStats = resolve; }));
    mockSignOut.mockResolvedValueOnce({ error: null });
    renderDashboard();
    fireEvent.click(await screen.findByText('Sign out'));
    await screen.findByText('Sign in with Google');
    await act(async () => resolveStats({ data: sampleStats }));
    expect(screen.queryByText('Pageviews by site')).not.toBeInTheDocument();
  });

  it('surfaces OAuth errors instead of silently failing', async () => {
    mockGetSession.mockResolvedValue(sessionFor(null));
    mockSignIn.mockRejectedValueOnce(new Error('offline'));
    renderDashboard();
    fireEvent.click(await screen.findByText('Sign in with Google'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not start sign-in');
    expect(screen.getByText('Sign in with Google')).toBeEnabled();
  });
});
