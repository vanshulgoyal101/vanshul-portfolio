import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

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
  range_days: 30,
  total_pageviews: 1234,
  unique_visitors: 321,
  total_events: 2000,
  pageviews_today: 12,
  events_today: 20,
  per_site: [{ site: 'portfolio', pageviews: 900, visitors: 200 }],
  per_tool: [{ site: 'tools', name: 'jwt', uses: 42 }],
  per_link: [{ name: 'https://games.vanshul.com/', site: 'links', clicks: 10 }],
  top_referrers: [{ referrer: 'google.com', count: 50 }],
  by_hour: [{ hour: 9, pageviews: 30 }],
  by_day: [],
  arcade: { total_visits: 5, total_plays: 400, per_game: [{ game: 'wordle', plays: 20 }] },
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

    await waitFor(() => expect(screen.getByText('Total pageviews')).toBeInTheDocument());
    expect(mockRpc).toHaveBeenCalledWith('web_stats', { days: 30 });
    expect(screen.getByText('Pageviews by site')).toBeInTheDocument();
    expect(screen.getByText('Top tools used')).toBeInTheDocument();
    expect(screen.getByText('Plays per game')).toBeInTheDocument();
  });

  it('surfaces an RPC error', async () => {
    mockGetSession.mockResolvedValue(sessionFor('vanshulg101@gmail.com'));
    mockRpc.mockResolvedValue({ data: null, error: { message: 'not authorized' } });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('not authorized')).toBeInTheDocument());
  });
});
