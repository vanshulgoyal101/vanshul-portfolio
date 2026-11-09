# Analytics & Dashboard

The repository provides a shared first-party usage beacon for participating
`vanshul.com` properties, feeding a private owner-only dashboard at
**`/dashboard`**. The beacon uses no cookies, but stores a persistent random
identifier in localStorage. This is pseudonymous usage data, not a guarantee of
anonymity or absence of personal data. Hosting and Supabase have their own data
handling policies. The separate optional GoatCounter integration is documented
below. Deployment coverage and legal consent requirements must be assessed
separately; cookie-free does not mean anonymous or automatically exempt.

## Optional GoatCounter integration

`src/components/Analytics.jsx` loads GoatCounter only when
`VITE_GOATCOUNTER_CODE` is configured. It uses the documented `no_onload` and
`no_events` settings, then manually counts the current pathname after loading.
Effect cleanup removes pending callbacks when the route changes or unmounts.
Private dashboard routes and DNT/GPC disable collection. Query strings,
fragments, document titles and referrers are not submitted by this integration;
the title field contains the pathname. Hash-only navigation is not a pageview.
The external script is requested with `referrerPolicy="no-referrer"`.
Third-party hosting still receives normal network request information.

Nine isolated component tests cover configuration, preferences, private paths,
late loading, unmount and route transitions. No live GoatCounter account was
queried. API reference: https://www.goatcounter.com/help/js.

```
 visitor's browser                      Supabase (Postgres)                owner
┌──────────────────┐   POST /rest    ┌──────────────────────┐   RPC    ┌──────────┐
│  public/a.js     │ ─────────────▶  │  web_events (RLS)    │ ◀─────── │/dashboard│
│  (beacon)        │  insert event   │  web_stats() (owner) │  stats   │  (React) │
└──────────────────┘                 └──────────────────────┘          └──────────┘
```

- **Collection** — a tiny script ([`public/a.js`](../public/a.js)) logs pseudonymous
  events straight to Supabase's REST API using the public **anon** key.
- **Storage** — the `web_events` table; Row Level Security allows anonymous
  *inserts* only, and never *reads*.
- **Reporting** — the owner-gated `web_stats()` RPC returns aggregates; the
  React [`Dashboard`](../src/pages/Dashboard.jsx) page renders them behind Google
  sign-in.

The schema and RPC live in [`supabase/web-analytics.sql`](../supabase/web-analytics.sql)
(idempotent — safe to re-apply).

---

## 1. The beacon — `public/a.js`

A dependency-free script served from `https://vanshul.com/a.js`. A participating
property opts in with a tag identifying the site:

```html
<script defer src="https://vanshul.com/a.js" data-site="tools"></script>
```

Without `data-site`, the site id comes from the hostname: `portfolio` for
`vanshul.com`, `arcade` for `games.vanshul.com`, otherwise the first subdomain
label (`tools.vanshul.com` → `tools`), cut to 32 characters.

The portfolio entry document does not currently include this beacon. Serving
the file does not prove it is installed on this or any other property.

What it records:

| Event `kind` | When | `name` holds |
| ------------ | ---- | ------------ |
| `pageview` | initial load **and** SPA route/hash changes | — |
| `link`     | click on an absolute `http(s)` `<a href>` to a different hostname | the URL (origin + path) |
| `tool`     | click on any `[data-track]` element, or `window.vtrack(id)` | the tool id |
| `action`   | `window.vtrack(id, 'action')`, or a `[data-track]` element with `data-track-kind="action"` | the action label |

Each row also carries: `site`, `path` (pathname plus a known section anchor), `referrer`
(referring **host** only — never query strings), and a pseudonymous per-device
`visitor` id (a random UUID kept in `localStorage` under `vg.vid`).

The beacon strips arbitrary fragments (including OAuth tokens) and query strings.
Outbound URLs retain only origin and pathname, never credentials, query strings,
or fragments. The private `/dashboard` subtree is excluded. Do Not Track and
Global Privacy Control disable collection before storage access or history hooks.
Custom `vtrack` names must be fixed identifiers, never user-entered text.
URL path segments themselves can contain sensitive values: avoid instrumenting
applications whose route paths contain personal or secret data without a
site-specific route allowlist. These rules do not sanitize historical records.

Design notes:

- **SPA-aware** — it patches `history.pushState`/`replaceState` and listens for
  `popstate`/`hashchange`, so client-side navigations count as pageviews
  (de-duped per path).
- **Resilient** — every call is wrapped so a blocked network or missing API
  never affects the host page.
- **Manual instrumentation** — `window.vtrack('jwt')` logs a tool event;
  `window.vtrack(name, kind)` also accepts `link`, `action` or `pageview` as
  the kind (anything else becomes `tool`). Elements with `data-track="…"` are
  auto-tracked (optionally `data-track-kind="link|action"`).

### Cross-property integration inventory

The `site` column comment in the schema lists `portfolio`, `tools`, `cron`,
`json`, `regex`, `tokens`, `links`, `blog`, `solaride`, `adbrain`, `reader`
and `arcade`. Games also keep their own `arcade_events` log, which
`web_stats()` folds into the same dashboard. Installation on these other
repositories was not verified in this portfolio audit; confirm their script
tags before relying on this list as a current deployment inventory.

---

## 2. Storage — `web_events`

```sql
create table public.web_events (
  id       bigint generated by default as identity primary key,
  ts       timestamptz not null default now(),
  site     text not null,   -- 'portfolio' | 'tools' | 'cron' | …
  kind     text not null,   -- 'pageview' | 'tool' | 'link' | 'action'
  name     text,            -- tool id / outbound link / action label
  path     text,            -- location.pathname (+ hash)
  referrer text,            -- referring host (no query strings)
  visitor  text,            -- pseudonymous per-device id
  user_id  uuid             -- reserved; browser roles cannot insert this column
);
```

**Row Level Security**

- Insert policy allows anonymous writes but only for the known kinds
  (`pageview`, `tool`, `link`, `action`).
- There is **no SELECT policy** — the raw event log is never publicly readable.
  All reads go through `web_stats()`.
- A `CHECK` constraint (`web_events_bounds`) bounds the field lengths so
  anonymous inserts can't store oversized rows: `site` 32, `kind` 16, `name`
  200, `path` 300, `referrer` 200 and `visitor` 64 characters. It is added
  `not valid`, so rows stored before it existed are not re-checked.
- Indexes cover `ts`, `(site, kind)` and `(kind, name)`.

The checked-in schema grants clients INSERT only on `site`, `kind`, `name`,
`path`, `referrer`, and `visitor` (plus `usage` on the id sequence). Identity,
timestamp and `user_id` are not client-writable. Raw SELECT/UPDATE/DELETE
privileges are revoked from browser roles; the aggregate RPC grants EXECUTE to
authenticated users only and still checks the owner UID internally. Its search
path puts `pg_temp` last to prevent temporary-table shadowing of public
relations.

Repository migrations must be reviewed and applied explicitly to the intended
Supabase project. Local SQL tests do not establish the current production
policy state. Schema reapplication does not delete diagnostic rows. Anonymous
event collection remains forgeable and is not rate-limited by these grants;
abuse protection/retention quotas require a server-side ingestion boundary or
provider controls before traffic warrants that change.

---

## 3. Reporting — `web_stats(window_hours int default 720)`

A `security definer` function that **only the owner** may call. The range
totals and every breakdown are filtered to a rolling window (default 30 days =
720 h; clamped to 1 h – 365 d). The lifetime totals and the arcade
`total_visits`/`total_plays` are not.

> **Security:** the owner guard uses `auth.uid() is distinct from '<owner-uid>'`,
> **not** `<>`. With the anon key `auth.uid()` is `NULL`, and `NULL <> uuid`
> evaluates to `NULL` (falsy) — so a `<>` check would silently leak data to
> anonymous callers. `is distinct from` returns `TRUE` for `NULL` and correctly
> rejects them.

Returned JSON:

| Field | Meaning |
| ----- | ------- |
| `window_hours` | the resolved window |
| `total_pageviews`, `unique_visitors` | lifetime totals (window-independent) |
| `range_pageviews`, `range_visitors`, `range_events` | totals within the window |
| `prev_pageviews`, `prev_visitors` | the **previous** equal-length window (for deltas) |
| `pageviews_today`, `events_today` | calendar-day totals (Asia/Kolkata) |
| `per_site` | `[{ site, pageviews, visitors }]` |
| `top_pages` | `[{ site, path, pageviews }]` (top 100) |
| `per_tool` | `[{ site, name, uses }]` (top 100) |
| `per_link` | `[{ name, site, clicks }]` (top 100) |
| `top_referrers` | `[{ referrer, count }]` (top 25) |
| `by_hour` | pageviews per hour-of-day (0–23) |
| `by_day` | `[{ day, pageviews, events }]` across the window |
| `arcade` | `{ total_visits, total_plays, range_plays, per_game }` |

All times are computed in **Asia/Kolkata (IST)**.

### Applying the schema

The SQL is applied via the Supabase Management API (or the SQL editor). It is
idempotent: the table uses `create if not exists`, the function is
`drop`+`create` (Postgres can't rename a parameter via `create or replace`).

---

## 4. The dashboard — `/dashboard`

A lazy-loaded React route ([`src/pages/Dashboard.jsx`](../src/pages/Dashboard.jsx))
that is `noindex, nofollow` while mounted. It uses a dedicated Supabase client
([`src/lib/analyticsClient.js`](../src/lib/analyticsClient.js)) with the public
project URL + publishable (anon) key hardcoded, so it works regardless of
build-time env vars. The module also exports `OWNER_EMAIL`, the address the UI
compares with the signed-in user. The client uses supabase-js defaults, so the
signed-in session persists in `localStorage` (`sb-<project-ref>-auth-token`).
The page has its own `main`, header and footer links (Home, Blog, Games,
LinkedIn, GitHub, Links) instead of the site navigation and footer.

**Auth flow**

1. `getSession()` on mount; `onAuthStateChange` keeps it live.
2. Signed out → "Sign in with Google" (`signInWithOAuth`, redirect back to
   `/dashboard`).
3. Signed in but not the owner email → "Not authorized".
4. Owner → calls `web_stats({ window_hours })` and renders.

The client-side owner check is only for UX; the real enforcement is the
server-side RPC guard.

> Sign-in redirects to `window.location.origin + '/dashboard'`
> (`https://vanshul.com/dashboard` in production), which must be allow-listed in
> Supabase (**Auth → URL Configuration**). Prefer that exact URL to a wildcard
> such as `https://vanshul.com/**`. The repository cannot show which value is
> configured. The GitHub Pages SPA 404-redirect preserves the URL hash, so the
> OAuth token survives the bounce to the virtual `/dashboard` route.

The beacon and the GoatCounter loader both exclude this route from collection.
Server-side UID checks remain the authorization boundary; matching the owner
email in React is presentation logic only.

Session, OAuth, sign-out and RPC failures render recoverable errors. Request
generation tracking rejects stale range responses and completions after unmount
or sign-out. Loading a range clears old statistics so a new range label cannot
be paired with previous data. Dashboard metadata uses the shared `useSeo` hook.

**Features**

- **Layout**: the site navigation, a page header ("Analytics" / "Dashboard")
  and the site footer, like every other page. Signed-out and not-authorized
  visitors see one card with the sign-in or sign-out action. The owner view
  has a toolbar (range, Refresh, Export CSV, Sign out) and then, in order: the
  metric grid, daily pageviews, pageviews by hour, top pages, a two-column
  group (pageviews by site, top referrers, top outbound links, top tools), the
  arcade and plays per game.
- **Time range** selector: last 24 hours / 7 / 30 / 90 days / 1 year
  (default 30 days). Changing it, or pressing **Refresh**, re-queries
  `web_stats()` for that window.
- **Metric grid**: pageviews, visitors and events in the range, pageviews
  today, and all-time pageviews and visitors, in a hairline grid (three
  columns, two on phones, where an odd last metric spans the row). Each label
  names the window it covers, e.g. "Pageviews · 30 days" (phones stack the
  window under the name). Range pageviews and visitors carry
  **period-over-period deltas** (▲/▼ % vs the previous equal-length window;
  "new" when there's no prior baseline) as tinted chips.
- **Breakdowns**: ranked lists (label, bar, value) for pageviews by site, top
  pages, top tools, top outbound links, top referrers and plays per game.
- **Arcade section**: metrics for game plays (current range + all-time) and
  all-time arcade visits (from `web_stats().arcade`), above the per-game breakdown.
  Shows `0` (not "absent") when the games log is empty, so it's clear whether
  there's no data vs. no plays in the selected window. Links out to the arcade's
  own richer stats dashboard at `games.vanshul.com/stats/`.
- **Charts**: daily and hour-of-day pageview columns. The daily chart's heading
  shows its first and last day, and the chart is a keyboard-focusable region
  that scrolls sideways when a long range needs more width.
- **CSV export** of the current stats (`statsToCsv` →
  `vanshul-analytics-YYYY-MM-DD.csv`). It covers the scalar metrics, every
  breakdown and the arcade totals, not the hourly or daily series.
- **Sign out** clears the statistics and the session.

CSV strings that could be interpreted as spreadsheet formulas are prefixed with
an apostrophe before normal CSV quoting; numeric metrics remain numeric. Daily
chart keys and labels use Asia/Kolkata, matching SQL, including UTC date-boundary
and year-boundary cases.

The pure data-shaping logic lives in
[`src/utils/dashboardData.js`](../src/utils/dashboardData.js) (`formatNumber`,
`fillDailySeries`, `hourSeries`, `toBars`, `shortenUrl`, `percentDelta`,
`statsToCsv`) and is unit-tested independently of the DOM.

---

## 5. Extending it

**Add a new breakdown** (e.g. "top countries"):

1. Log the extra dimension from the beacon (add a column + `CHECK` bound, keep
   the insert policy).
2. Add an aggregate key inside `web_stats()`'s `jsonb_build_object`, filtered by
   `ts >= since`.
3. Re-apply the SQL.
4. Map it to bars in `Dashboard`'s `derived` memo and render a `<BarList>`.
5. Add it to `statsToCsv` and cover it with a test.

**Privacy checklist** — never log raw input, full referrer URLs, IPs, or any
identifier beyond the random per-device `visitor`. Keep the field-length
`CHECK` constraint in place.
