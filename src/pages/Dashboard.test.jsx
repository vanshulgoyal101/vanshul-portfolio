import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

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
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Sign in with Google')).toBeInTheDocument());
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('blocks a non-owner account', async () => {
    mockGetSession.mockResolvedValue(sessionFor('someone@else.com'));
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Not authorized')).toBeInTheDocument());
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('loads and renders stats for the owner', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    render(<Dashboard />);

    await waitFor(() => expect(screen.getByText('Pageviews by site')).toBeInTheDocument());
    expect(mockRpc).toHaveBeenCalledWith('web_stats', { window_hours: 720 });
    expect(screen.getByText('Top pages')).toBeInTheDocument();
    expect(screen.getByText('Top tools used')).toBeInTheDocument();
    expect(screen.getByText('Plays per game')).toBeInTheDocument();
    // Arcade totals surfaced as cards (not just the per-game breakdown).
    expect(screen.getByText('🎮 Arcade')).toBeInTheDocument();
    expect(screen.getByText('Game plays · all-time')).toBeInTheDocument();
    expect(screen.getByText('Arcade visits · all-time')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    // Period-over-period delta on the range card: 500 vs 400 = +25%.
    expect(screen.getByText(/25%/)).toBeInTheDocument();
  });

  it('re-queries with a 24-hour window when the range changes', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Pageviews by site')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Time range'), { target: { value: '24' } });
    await waitFor(() => expect(mockRpc).toHaveBeenCalledWith('web_stats', { window_hours: 24 }));
  });

  it('surfaces an RPC error', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: null, error: { message: 'not authorized' } });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('not authorized')).toBeInTheDocument());
  });

  it('exports the current stats as a CSV download', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: sampleStats, error: null });
    const createURL = vi.fn(() => 'blob:mock');
    URL.createObjectURL = createURL;
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<Dashboard />);
    // Wait for the stats to load — the Export button is disabled until then.
    await waitFor(() => expect(screen.getByText('Pageviews by site')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Export CSV'));

    expect(createURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });
});
