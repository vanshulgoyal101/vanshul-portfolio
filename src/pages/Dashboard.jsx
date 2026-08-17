import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { analytics, OWNER_EMAIL } from '../lib/analyticsClient';
import { SOCIAL_LINKS } from '../constants/siteConfig';
import {
  formatNumber,
  fillDailySeries,
  hourSeries,
  toBars,
  shortenUrl,
  percentDelta,
  statsToCsv,
} from '../utils/dashboardData';

// ---------------------------------------------------------------------------
// Styles (reuse the portfolio design tokens from GlobalStyles)
// ---------------------------------------------------------------------------
const Page = styled.main`
  min-height: 100vh;
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--container-padding);
`;

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: var(--text-3xl);
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const Button = styled.button`
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: var(--color-accent-primary);
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
  min-height: 44px;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: default; }
`;

const GhostButton = styled(Button)`
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
`;

const Select = styled.select`
  font: inherit;
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 8px 12px;
  min-height: 44px;
`;

const Message = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--color-text-secondary);

  h2 { color: var(--color-text-primary); margin-top: 0; }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
`;

const Card = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);

  .n { font-size: var(--text-3xl); font-weight: 800; letter-spacing: -0.02em; }
  .l { color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: 4px; }
`;

const Section = styled.section`
  margin-bottom: var(--spacing-2xl);

  h2 { font-size: var(--text-xl); margin: 0 0 var(--spacing-md); }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: 6px;
  font-size: var(--text-sm);

  .k {
    width: 180px;
    flex: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-secondary);
  }
  .bar {
    flex: 1;
    height: 22px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .bar > span {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--color-accent-primary);
    border-radius: 6px;
    min-width: 2px;
  }
  .v { width: 64px; flex: none; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
`;

const Hours = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: 120px;
  gap: 3px;

  .h { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 4px 4px 0 0; position: relative; }
  .h > span { position: absolute; inset: auto 0 0 0; background: var(--color-accent-primary); border-radius: 4px 4px 0 0; }
`;

const HourLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 3px;
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 0.58rem;
  text-align: center;
`;

const Foot = styled.p`
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-top: var(--spacing-xl);
`;

const SiteFooter = styled.footer`
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  text-align: center;
`;

const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-lg);

  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover { color: var(--color-accent-primary); }
  }
`;

// Network links shown at the bottom of every dashboard state.
const DashboardFooter = () => (
  <SiteFooter>
    <FooterLinks aria-label="Vanshul Goyal network">
      <a href="/">Home</a>
      <a href="/#blog">Blog</a>
      <a href={SOCIAL_LINKS.games} target="_blank" rel="noopener noreferrer">Games</a>
      <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://links.vanshul.com" target="_blank" rel="noopener noreferrer">Links</a>
    </FooterLinks>
  </SiteFooter>
);

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------
const BarList = ({ title, bars, empty }) => (
  <Section>
    <h2>{title}</h2>
    {bars.items.length === 0 ? (
      <Message>{empty}</Message>
    ) : (
      bars.items.map((it, i) => (
        <Row key={`${it.name}-${i}`}>
          <span className="k" title={it.name}>{it.name}</span>
          <div className="bar" role="img" aria-label={`${it.name}: ${it.value}`}>
            <span style={{ width: `${(it.value / bars.max) * 100}%` }} />
          </div>
          <span className="v">{formatNumber(it.value)}</span>
        </Row>
      ))
    )}
  </Section>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const DeltaBadge = styled.span`
  font-size: var(--text-xs);
  font-weight: 700;
  margin-left: 8px;
  white-space: nowrap;
  color: ${(p) => (p.$dir > 0 ? '#16a34a' : p.$dir < 0 ? '#dc2626' : 'var(--color-text-muted)')};
`;

// Trend badge comparing the current window to the previous equal-length one.
const Delta = ({ current, previous }) => {
  const pct = percentDelta(current, previous);
  if (pct === null) return <DeltaBadge $dir={1} title="No prior data">new</DeltaBadge>;
  if (pct === 0) return <DeltaBadge $dir={0}>±0%</DeltaBadge>;
  const dir = pct > 0 ? 1 : -1;
  return (
    <DeltaBadge $dir={dir} title="vs previous period">
      {dir > 0 ? '▲' : '▼'} {Math.abs(pct)}%
    </DeltaBadge>
  );
};

const Dashboard = () => {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [windowHours, setWindowHours] = useState(720); // default: last 30 days
  const [busy, setBusy] = useState(false);

  // Keep this private route out of search indexes while mounted.
  useEffect(() => {
    document.title = 'Dashboard — Vanshul Goyal';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    let active = true;
    analytics.auth.getSession().then(({ data }) => {
      if (active) setSession(data?.session ?? null);
    });
    const { data: sub } = analytics.auth.onAuthStateChange((_e, s) => {
      if (active) setSession(s ?? null);
    });
    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const email = session?.user?.email ?? null;
  const isOwner = email === OWNER_EMAIL;

  const loadStats = useCallback(async () => {
    setBusy(true);
    setError(null);
    const { data, error: rpcError } = await analytics.rpc('web_stats', { window_hours: windowHours });
    if (rpcError) setError(rpcError.message || 'Failed to load stats.');
    else setStats(data);
    setBusy(false);
  }, [windowHours]);

  useEffect(() => {
    if (isOwner) loadStats();
  }, [isOwner, loadStats]);

  const signIn = () =>
    analytics.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
  const signOut = async () => {
    await analytics.auth.signOut();
    setStats(null);
  };

  const exportCsv = () => {
    const csv = statsToCsv(stats);
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanshul-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const derived = useMemo(() => {
    if (!stats) return null;
    return {
      perSite: toBars(stats.per_site, (r) => r.site, 'pageviews'),
      topPages: toBars(stats.top_pages, (r) => `${r.site}${r.path}`, 'pageviews'),
      perTool: toBars(stats.per_tool, (r) => `${r.site} · ${r.name}`, 'uses'),
      perLink: toBars(stats.per_link, (r) => shortenUrl(r.name), 'clicks'),
      referrers: toBars(stats.top_referrers, (r) => r.referrer, 'count'),
      perGame: toBars(stats.arcade?.per_game, (r) => r.game, 'plays'),
      hours: hourSeries(stats.by_hour),
      daily: fillDailySeries(stats.by_day, Math.max(1, Math.ceil(windowHours / 24))),
    };
  }, [stats, windowHours]);

  // ---- render states ----
  if (session === undefined) {
    return <Page><Message>Loading…</Message></Page>;
  }

  if (!session) {
    return (
      <Page>
        <Header><h1>📊 Dashboard</h1></Header>
        <Message>
          <h2>Sign in required</h2>
          <p>This dashboard is private. Sign in with the owner Google account to continue.</p>
          <Button onClick={signIn}>Sign in with Google</Button>
        </Message>
        <DashboardFooter />
      </Page>
    );
  }

  if (!isOwner) {
    return (
      <Page>
        <Header>
          <h1>📊 Dashboard</h1>
          <Actions><GhostButton onClick={signOut}>Sign out</GhostButton></Actions>
        </Header>
        <Message>
          <h2>Not authorized</h2>
          <p>{email} does not have access to this dashboard.</p>
        </Message>
        <DashboardFooter />
      </Page>
    );
  }

  const hourMax = derived ? Math.max(1, ...derived.hours.map((h) => h.pageviews)) : 1;
  const dayMax = derived ? Math.max(1, ...derived.daily.map((d) => d.pageviews)) : 1;

  return (
    <Page>
      <Header>
        <h1>📊 Dashboard</h1>
        <Actions>
          <Select
            aria-label="Time range"
            value={windowHours}
            onChange={(e) => setWindowHours(Number(e.target.value))}
          >
            <option value={24}>Last 24 hours</option>
            <option value={168}>Last 7 days</option>
            <option value={720}>Last 30 days</option>
            <option value={2160}>Last 90 days</option>
            <option value={8760}>Last year</option>
          </Select>
          <GhostButton onClick={loadStats} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh'}</GhostButton>
          <GhostButton onClick={exportCsv} disabled={!stats}>Export CSV</GhostButton>
          <GhostButton onClick={signOut}>Sign out</GhostButton>
        </Actions>
      </Header>

      {error && <Message><h2>Error</h2><p>{error}</p></Message>}

      {!stats && !error && <Message>Loading stats…</Message>}

      {stats && derived && (
        <>
          <Cards>
            <Card><div className="n">{formatNumber(stats.range_pageviews)}<Delta current={stats.range_pageviews} previous={stats.prev_pageviews} /></div><div className="l">Pageviews · range</div></Card>
            <Card><div className="n">{formatNumber(stats.range_visitors)}<Delta current={stats.range_visitors} previous={stats.prev_visitors} /></div><div className="l">Visitors · range</div></Card>
            <Card><div className="n">{formatNumber(stats.range_events)}</div><div className="l">Events · range</div></Card>
            <Card><div className="n">{formatNumber(stats.pageviews_today)}</div><div className="l">Pageviews today</div></Card>
            <Card><div className="n">{formatNumber(stats.total_pageviews)}</div><div className="l">Pageviews · all-time</div></Card>
            <Card><div className="n">{formatNumber(stats.unique_visitors)}</div><div className="l">Visitors · all-time</div></Card>
          </Cards>

          <BarList title="Pageviews by site" bars={derived.perSite} empty="No pageviews yet." />
          <BarList title="Top pages" bars={derived.topPages} empty="No page views yet." />
          <BarList title="Top tools used" bars={derived.perTool} empty="No tool usage yet." />
          <BarList title="Top outbound links" bars={derived.perLink} empty="No link clicks yet." />
          <BarList title="Top referrers" bars={derived.referrers} empty="No referrers yet." />

          {/* Arcade / games — surface the totals the RPC returns, not just the breakdown. */}
          <Section>
            <h2>🎮 Arcade</h2>
            <Cards>
              <Card><div className="n">{formatNumber(stats.arcade?.range_plays ?? 0)}</div><div className="l">Game plays · range</div></Card>
              <Card><div className="n">{formatNumber(stats.arcade?.total_plays ?? 0)}</div><div className="l">Game plays · all-time</div></Card>
              <Card><div className="n">{formatNumber(stats.arcade?.total_visits ?? 0)}</div><div className="l">Arcade visits · all-time</div></Card>
            </Cards>
          </Section>
          <BarList title="Plays per game" bars={derived.perGame} empty="No game plays in this range." />

          <Section>
            <h2>Pageviews by hour (IST)</h2>
            <Hours>
              {derived.hours.map((h) => (
                <div className="h" key={h.hour} role="img" aria-label={`${h.hour}:00 — ${h.pageviews} pageviews`}>
                  <span style={{ height: `${(h.pageviews / hourMax) * 100}%` }} />
                </div>
              ))}
            </Hours>
            <HourLabels>
              {derived.hours.map((h) => (
                <span key={h.hour}>{h.hour % 3 === 0 ? h.hour : ''}</span>
              ))}
            </HourLabels>
          </Section>

          <Section>
            <h2>Daily pageviews</h2>
            <Hours style={{ gridTemplateColumns: `repeat(${derived.daily.length}, 1fr)` }}>
              {derived.daily.map((d) => (
                <div className="h" key={d.day} role="img" aria-label={`${d.label} — ${d.pageviews} pageviews`} title={`${d.label}: ${d.pageviews}`}>
                  <span style={{ height: `${(d.pageviews / dayMax) * 100}%` }} />
                </div>
              ))}
            </Hours>
          </Section>

          <Foot>Private · anonymous analytics · times in IST (Asia/Kolkata). Signed in as {email}.</Foot>
        </>
      )}
      <DashboardFooter />
    </Page>
  );
};

export default Dashboard;
