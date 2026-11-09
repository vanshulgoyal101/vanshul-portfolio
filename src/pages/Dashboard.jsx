import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { HiArrowUpRight } from 'react-icons/hi2';
import { analytics, OWNER_EMAIL } from '../lib/analyticsClient';
import { SOCIAL_LINKS } from '../constants/siteConfig';
import useSeo from '../hooks/useSeo';
import PageLayout from '../components/ui/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button, TextLink } from '../components/ui/Button';
import {
  formatNumber,
  fillDailySeries,
  hourSeries,
  toBars,
  shortenUrl,
  percentDelta,
  statsToCsv,
} from '../utils/dashboardData';

// `short` names the window on range-bound metrics ("Pageviews · 30 days").
const RANGES = [
  { hours: 24, label: 'Last 24 hours', short: '24 hours' },
  { hours: 168, label: 'Last 7 days', short: '7 days' },
  { hours: 720, label: 'Last 30 days', short: '30 days' },
  { hours: 2160, label: 'Last 90 days', short: '90 days' },
  { hours: 8760, label: 'Last year', short: '12 months' },
];

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%230f172a' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;

  > :last-child {
    margin-left: auto;
  }
`;

const RangeSelect = styled.select`
  appearance: none;
  min-height: 48px;
  padding: 0 2.75rem 0 1.25rem;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-pill);
  background: var(--color-bg-card) ${CHEVRON} no-repeat right 1.125rem center / 12px 8px;
  font-family: var(--font-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink);
  cursor: pointer;
  transition: border-color var(--duration-fast) ease;

  &:hover {
    border-color: var(--color-ink);
  }
`;

const Stack = styled.div`
  display: grid;
  gap: clamp(3rem, 7vw, 4.5rem);
`;

const Status = styled.p`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
`;

const Notice = styled.p`
  padding: 0.875rem 1rem;
  border: 1px solid rgba(185, 28, 28, 0.2);
  border-left: 3px solid var(--color-danger);
  border-radius: var(--radius-md);
  background: rgba(185, 28, 28, 0.04);
  color: var(--color-danger);
  font-size: 0.9375rem;
  line-height: 1.5;
`;

// Signed-out and not-authorized states share one quiet card.
const Gate = styled.section`
  max-width: 36rem;
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  box-shadow: var(--shadow-sm);

  h2 {
    font-size: 1.25rem;
    letter-spacing: -0.015em;
  }

  > p {
    margin-top: 0.5rem;
  }

  > button {
    margin-top: 1.5rem;
  }

  > ${Notice} {
    margin-top: 1.25rem;
  }
`;

const Block = styled.section`
  min-width: 0;
`;

const BlockHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1.5rem;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    letter-spacing: -0.015em;
  }
`;

const Caption = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
`;

// Hairline-divided metric grid. On phones an odd last metric spans the row
// so the grid never ends in a gap.
const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
  background: var(--color-hairline);

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > :last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }
`;

const Stat = styled.div`
  min-width: 0;
  padding: clamp(1.125rem, 3vw, 1.5rem);
  background: var(--color-bg-card);

  dt {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  dt span {
    color: var(--color-text-muted);

    &::before {
      content: '· ';
    }

    @media (max-width: 640px) {
      display: block;
      margin-top: 0.25rem;

      &::before {
        content: none;
      }
    }
  }

  dd {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0.75rem 0 0;
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--color-ink);
  }
`;

const DELTA_TONES = {
  up: { color: 'var(--color-success)', background: 'rgba(22, 101, 52, 0.1)' },
  down: { color: 'var(--color-danger)', background: 'rgba(185, 28, 28, 0.08)' },
  flat: { color: 'var(--color-text-muted)', background: 'rgba(15, 23, 42, 0.05)' },
};

const DeltaBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0;
  white-space: nowrap;
  color: ${({ $tone }) => DELTA_TONES[$tone].color};
  background: ${({ $tone }) => DELTA_TONES[$tone].background};
`;

const Panels = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(3rem, 7vw, 4.5rem) clamp(2rem, 5vw, 3.5rem);

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Ranked = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-hairline);

  li {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) 4rem;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.875rem;
  }

  .k {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-primary);
  }

  .bar {
    display: block;
    height: 6px;
    overflow: hidden;
    border-radius: var(--radius-pill);
    background: var(--color-border);
  }

  .bar > span {
    display: block;
    height: 100%;
    min-width: 2px;
    border-radius: inherit;
    background: var(--color-accent-primary);
  }

  .v {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--color-ink);
  }
`;

const Empty = styled.p`
  padding: 0.875rem 0;
  border-top: 1px solid var(--color-hairline);
  font-size: 0.9375rem;
  color: var(--color-text-muted);
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(24, minmax(0, 1fr));
  grid-template-rows: clamp(120px, 16vw, 168px);
  gap: 3px;
  border-bottom: 1px solid var(--color-hairline);

  > div {
    position: relative;
    border-radius: 3px 3px 0 0;
    background: rgba(15, 23, 42, 0.04);
  }

  > div > span {
    position: absolute;
    inset: auto 0 0;
    border-radius: inherit;
    background: var(--color-accent-primary);
  }
`;

// Long ranges keep every day at a legible width and scroll sideways.
const ChartViewport = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const Axis = styled.div`
  display: grid;
  grid-template-columns: repeat(24, minmax(0, 1fr));
  gap: 3px;
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  text-align: center;
  color: var(--color-text-muted);
`;

const Foot = styled.p`
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-hairline);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--color-text-muted);
`;

const BarList = ({ title, bars, empty }) => (
  <Block>
    <BlockHead><h2>{title}</h2></BlockHead>
    {bars.items.length === 0 ? (
      <Empty>{empty}</Empty>
    ) : (
      <Ranked>
        {bars.items.map((it, i) => (
          <li key={`${it.name}-${i}`}>
            <span className="k" title={it.name}>{it.name}</span>
            <span className="bar" role="img" aria-label={`${it.name}: ${it.value}`}>
              <span style={{ width: `${(it.value / bars.max) * 100}%` }} />
            </span>
            <span className="v">{formatNumber(it.value)}</span>
          </li>
        ))}
      </Ranked>
    )}
  </Block>
);

// Trend badge comparing the current window to the previous equal-length one.
const Delta = ({ current, previous }) => {
  const pct = percentDelta(current, previous);
  if (pct === null) return <DeltaBadge $tone="up" title="No prior data">new</DeltaBadge>;
  if (pct === 0) return <DeltaBadge $tone="flat">±0%</DeltaBadge>;
  const up = pct > 0;
  return (
    <DeltaBadge $tone={up ? 'up' : 'down'} title="vs previous period">
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </DeltaBadge>
  );
};

// `scope` says which window the value covers; phones stack it under the name.
const Metric = ({ name, scope, value, children }) => (
  <Stat>
    <dt>{name} <span>{scope}</span></dt>
    <dd>{formatNumber(value)}{children}</dd>
  </Stat>
);

const Dashboard = () => {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [windowHours, setWindowHours] = useState(720); // default: last 30 days
  const [busy, setBusy] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const requestRef = useRef(0);
  const mountedRef = useRef(false);
  useSeo({ title: 'Dashboard', description: 'Private analytics dashboard.', path: '/dashboard', robots: 'noindex, nofollow' });

  useEffect(() => {
    let active = true;
    let authChanged = false;
    mountedRef.current = true;
    analytics.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || authChanged) return;
      if (sessionError) throw sessionError;
      setSession(data?.session ?? null);
    }).catch(() => {
      if (!active || authChanged) return;
      setSession(null);
      setError('Could not restore your session. Please sign in again.');
    });
    const { data: sub } = analytics.auth.onAuthStateChange((_e, s) => {
      if (active) {
        authChanged = true;
        setSession(s ?? null);
      }
    });
    return () => {
      active = false;
      mountedRef.current = false;
      requestRef.current += 1;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const email = session?.user?.email ?? null;
  const isOwner = email === OWNER_EMAIL;

  const loadStats = useCallback(async () => {
    if (!isOwner) return;
    const request = ++requestRef.current;
    setBusy(true);
    setError(null);
    setStats(null);
    try {
      const { data, error: rpcError } = await analytics.rpc('web_stats', { window_hours: windowHours });
      if (rpcError) throw rpcError;
      if (!data) throw new Error('No stats were returned.');
      if (mountedRef.current && request === requestRef.current) setStats(data);
    } catch (failure) {
      if (mountedRef.current && request === requestRef.current) setError(failure.message || 'Failed to load stats. Please retry.');
    } finally {
      if (mountedRef.current && request === requestRef.current) setBusy(false);
    }
  }, [isOwner, windowHours]);

  useEffect(() => {
    if (isOwner) loadStats();
    else {
      setStats(null);
      setBusy(false);
    }
    return () => { requestRef.current += 1; };
  }, [isOwner, loadStats]);

  const changeAuth = async (signingOut) => {
    setAuthBusy(true);
    setError(null);
    try {
      const result = signingOut
        ? await analytics.auth.signOut()
        : await analytics.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
      if (result?.error) throw result.error;
      if (mountedRef.current && signingOut) {
        requestRef.current += 1;
        setStats(null);
        setSession(null);
      }
    } catch {
      if (mountedRef.current) setError(signingOut ? 'Could not sign out. Please retry.' : 'Could not start sign-in. Please retry.');
    } finally {
      if (mountedRef.current) setAuthBusy(false);
    }
  };
  const signIn = () => changeAuth(false);
  const signOut = () => changeAuth(true);

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

  const range = RANGES.find((r) => r.hours === windowHours);
  let body;

  if (session === undefined) {
    body = <Status role="status">Loading…</Status>;
  } else if (!session) {
    body = (
      <Gate aria-labelledby="dashboard-gate">
        <h2 id="dashboard-gate">Sign in required</h2>
        <p>This dashboard is private. Sign in with the owner Google account to continue.</p>
        <Button type="button" onClick={signIn} disabled={authBusy}>Sign in with Google</Button>
        {error && <Notice role="alert">{error}</Notice>}
      </Gate>
    );
  } else if (!isOwner) {
    body = (
      <Gate aria-labelledby="dashboard-gate">
        <h2 id="dashboard-gate">Not authorized</h2>
        <p>{email} does not have access to this dashboard.</p>
        <Button type="button" $variant="secondary" onClick={signOut} disabled={authBusy}>Sign out</Button>
        {error && <Notice role="alert">{error}</Notice>}
      </Gate>
    );
  } else {
    const hourMax = derived ? Math.max(1, ...derived.hours.map((h) => h.pageviews)) : 1;
    const dayMax = derived ? Math.max(1, ...derived.daily.map((d) => d.pageviews)) : 1;

    body = (
      <Stack>
        {error && <Notice role="alert">{error}</Notice>}
        {!stats && !error && <Status role="status">Loading stats…</Status>}

        {stats && derived && (
          <>
            <Stats>
              <Metric name="Pageviews" scope={range.short} value={stats.range_pageviews}>
                <Delta current={stats.range_pageviews} previous={stats.prev_pageviews} />
              </Metric>
              <Metric name="Visitors" scope={range.short} value={stats.range_visitors}>
                <Delta current={stats.range_visitors} previous={stats.prev_visitors} />
              </Metric>
              <Metric name="Events" scope={range.short} value={stats.range_events} />
              <Metric name="Pageviews" scope="today" value={stats.pageviews_today} />
              <Metric name="Pageviews" scope="all-time" value={stats.total_pageviews} />
              <Metric name="Visitors" scope="all-time" value={stats.unique_visitors} />
            </Stats>

            <Block>
              <BlockHead>
                <h2>Daily pageviews</h2>
                <Caption>{derived.daily[0].label} – {derived.daily[derived.daily.length - 1].label}</Caption>
              </BlockHead>
              <ChartViewport role="region" aria-label="Daily pageviews chart" tabIndex={0}>
                <Columns style={{ gridTemplateColumns: `repeat(${derived.daily.length}, minmax(4px, 1fr))` }}>
                  {derived.daily.map((d) => (
                    <div key={d.day} role="img" aria-label={`${d.label} — ${d.pageviews} pageviews`} title={`${d.label}: ${d.pageviews}`}>
                      <span style={{ height: `${(d.pageviews / dayMax) * 100}%` }} />
                    </div>
                  ))}
                </Columns>
              </ChartViewport>
            </Block>

            <Block>
              <BlockHead>
                <h2>Pageviews by hour (IST)</h2>
                <Caption>{range.short}</Caption>
              </BlockHead>
              <Columns>
                {derived.hours.map((h) => (
                  <div key={h.hour} role="img" aria-label={`${h.hour}:00 — ${h.pageviews} pageviews`} title={`${h.hour}:00: ${h.pageviews}`}>
                    <span style={{ height: `${(h.pageviews / hourMax) * 100}%` }} />
                  </div>
                ))}
              </Columns>
              <Axis aria-hidden="true">
                {derived.hours.map((h) => (
                  <span key={h.hour}>{h.hour % 3 === 0 ? h.hour : ''}</span>
                ))}
              </Axis>
            </Block>

            <BarList title="Top pages" bars={derived.topPages} empty="No page views yet." />

            <Panels>
              <BarList title="Pageviews by site" bars={derived.perSite} empty="No pageviews yet." />
              <BarList title="Top referrers" bars={derived.referrers} empty="No referrers yet." />
              <BarList title="Top outbound links" bars={derived.perLink} empty="No link clicks yet." />
              <BarList title="Top tools used" bars={derived.perTool} empty="No tool usage yet." />
            </Panels>

            {/* Arcade totals come from the same RPC; the arcade hosts a richer dashboard. */}
            <Block>
              <BlockHead>
                <h2>Arcade</h2>
                <TextLink as="a" href={`${SOCIAL_LINKS.games}/stats/`} target="_blank" rel="noopener noreferrer">
                  Open the full arcade dashboard
                  <HiArrowUpRight aria-hidden="true" data-arrow="forward" />
                </TextLink>
              </BlockHead>
              <Stats>
                <Metric name="Game plays" scope={range.short} value={stats.arcade?.range_plays ?? 0} />
                <Metric name="Game plays" scope="all-time" value={stats.arcade?.total_plays ?? 0} />
                <Metric name="Arcade visits" scope="all-time" value={stats.arcade?.total_visits ?? 0} />
              </Stats>
            </Block>

            <BarList title="Plays per game" bars={derived.perGame} empty="No game plays in this range." />

            <Foot>Private · pseudonymous analytics · times in IST (Asia/Kolkata). Signed in as {email}.</Foot>
          </>
        )}
      </Stack>
    );
  }

  return (
    <PageLayout>
      <PageHeader label="Analytics" title="Dashboard" lede="Private usage analytics for the vanshul.com network.">
        {isOwner && (
          <Toolbar>
            <RangeSelect
              aria-label="Time range"
              value={windowHours}
              onChange={(e) => setWindowHours(Number(e.target.value))}
            >
              {RANGES.map((r) => <option key={r.hours} value={r.hours}>{r.label}</option>)}
            </RangeSelect>
            <Button type="button" $variant="secondary" onClick={loadStats} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh'}</Button>
            <Button type="button" $variant="secondary" onClick={exportCsv} disabled={!stats}>Export CSV</Button>
            <Button type="button" $variant="secondary" onClick={signOut} disabled={authBusy}>Sign out</Button>
          </Toolbar>
        )}
      </PageHeader>
      {body}
    </PageLayout>
  );
};

export default Dashboard;
