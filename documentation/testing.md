# Testing

The project uses **Vitest** with **React Testing Library** and a **jsdom**
environment. Configuration lives in `vite.config.js` (the `test` block); global
setup lives in [`src/test/setup.js`](../src/test/setup.js).

Vitest and its V8 coverage adapter are upgraded together (currently 5.1.0).
Use Node 22.12+, 24, or a newer supported release; CI uses Node LTS.
The full dependency audit is `npm audit`; production-only is
`npm audit --omit=dev`. Do not expose test/dev servers to untrusted networks.

## Database and accessibility checks

`scripts/database.test.js` runs both checked-in SQL schemas in a fresh in-memory
PGlite PostgreSQL engine. It creates test-only auth roles and an `auth.uid()`
fixture, verifies owner-only aggregate reads (including NULL/non-owner rejection),
anonymous insert bounds, forbidden raw reads/mutations, server-owned timestamp
and identity columns, bounded blog RPCs, and non-destructive schema reapplication.
It makes no production connection. This is SQL behavior coverage, not a test of
Supabase hosting, deployed grants, OAuth configuration, quotas or rate limits.

`e2e/accessibility.spec.js` runs axe-core WCAG 2 A/AA and 2.1 AA checks on desktop
and mobile: home with expanded disclosures, blog index, article, shelf,
missing-route recovery and signed-out dashboard. An additional fabricated owner
session with intercepted API responses covers the year chart, 365 daily values,
scroll containment and owner-state contrast. No real authentication is used.
No rule exclusions are used.
Automated scans do not prove full accessibility; keep the keyboard, focus,
reduced-motion, geometry and screenshot checks alongside them.

Analytics tests isolate the beacon in a VM and capture fake fetch payloads;
database TLS tests use injected CA reads. No secrets or live submissions are
required. Dashboard tests cover promise rejections and out-of-order responses.

### November 2026 coverage baseline

Vitest 5.1: 487 tests in 63 files, 85.95% lines, 79.70% branches and 78.26%
functions (`npm run test:coverage`). In September 2026 it was 401 tests,
64.93% lines and 65.51% branches. The gain comes from new tests for pages,
primitives, toasts, the contact form, dates and archive grouping, and from
deleting dead modules.
App wiring, styling and decorative canvases still rely on browser verification
and are not unit-complete.
Do not exclude these files merely to inflate the percentage.

WebGL pixel tests wait until the canvas matches its reserved scene dimensions
before capturing. A visible canvas can still have its initial 300x150 dimensions
before renderer measurement. Framing, motion, dragging and offscreen pause remain
asserted, without retry-based success or relaxed pixel bounds.

## Running tests

```bash
npm test               # run once
npm run test:watch     # watch mode
npm run test:ui        # Vitest UI
npm run test:coverage  # coverage report (text + html in coverage/)
```

`coverage/` is git-ignored and excluded from linting.

## Production browser checks

```bash
npx playwright install chromium
npm run build
npm run verify:build
npm run test:e2e
```

`verify:build` parses the final sitemap and requires a matching HTML shell and
canonical URL for every listed route, including the reading list. Playwright
starts a production preview on port 4327 and tests desktop and mobile Chromium.
The suite covers unique section IDs, heading clearance under the fixed header,
reduced motion, cross-route links, skip-link focus, mobile menu focus and Escape,
case-study disclosures, image loading, and the absence of 3D requests on mobile
and reduced-motion visits. Hero checks measure shared gutters and first-viewport
project visibility across six viewport sizes. Desktop WebGL checks at 1025, 1440,
and 1920px sample screenshot pixels for a nonblank, contained sculpture, compare
frames during animation and dragging, and verify off-screen pausing.
External requests are blocked in browser tests; this does not verify live
analytics, contact submission, or authenticated services.

Footer checks exercise enabled defaults, saved on/off choices across reloads,
pointer and keyboard opening, settings fully inside the viewport, and reduced
motion overrides. Other browser checks explicitly save an ambient-motion opt-out
to isolate their layout and canvas measurements.

`e2e/rocket.spec.js` launches the real floating rocket twice using pointer
coordinates (the target intentionally never stops floating), samples canvas
pixels to verify colored smoke, checks About focus/header clearance, and waits
for the canvas to clear and the rocket to return. Smoke uses its original
frame-based fade; software rendering can take longer than a hardware browser.
Pixel readbacks stop after evidence is captured to avoid slowing every frame.
The rocket is a native button. Additional browser coverage activates it with Enter
and Space while 2D canvas contexts return null, requiring About focus without
uncaught errors. Unit tests interrupt the shake, takeoff, and pending reset to
verify all timers/frames are cancelled and late animation promises do no work.

Portfolio browser checks cover malformed hashes, direct generated-subpage entry
followed by Home navigation (canonical, title, Twitter URL, no stale route schema
or article tags), and 320px contact/article bounds. Screenshot checks wait for
scroll-reveal content to become fully opaque rather than equating DOM visibility
with painted content.

`e2e/boot.spec.js` checks visible multilingual greetings through Welcome, the
centered Projects text, inert content and scroll-lock release, About deep links
after the intro, no replay on internal navigation, and reduced-motion bypass.
It captures greeting and revealed-page screenshots on desktop and mobile.

`e2e/article.spec.js` opens a long article, follows its "On this page" links
and direct `#section` URLs, and requires each heading to land below the fixed
header. Without JavaScript, it checks that the prerendered article keeps the
same contents list and working anchors.

`e2e/shelf.spec.js` covers the homepage shelf card, separate Books and Essays
collections, source link semantics and target sizes, collection hash navigation
and reloads, and the return to Writings. A 1440/768/390/320px matrix checks text
bounds and horizontal overflow and captures full-page screenshots. External essay
destinations are asserted from the curated data, not loaded by these tests.

Homepage and selected-work screenshots are written under `test-results/` for
visual inspection. Failures retain screenshots and traces. These are not pixel
baseline comparisons. CI runs lint, unit tests, build verification, and browser
tests before uploading the Pages artifact.

## Layout & conventions

- Tests are colocated with the code they cover, named `*.test.js` / `*.test.jsx`.
- Pure functions and hooks are tested directly; components are rendered with
  Testing Library and asserted via accessible queries where practical.
- `globals: true` means `describe`/`it`/`expect`/`vi` are available without
  imports (they are still imported explicitly in most files for clarity). The
  ESLint test override provides the matching globals.

## Global setup (`src/test/setup.js`)

- Registers `@testing-library/jest-dom` matchers and runs `cleanup()` after each
  test.
- **Mocks `framer-motion`** globally: `motion.*` render as plain DOM elements and
  `AnimatePresence` renders children immediately. This removes animation timing
  from tests (real exit animations otherwise keep nodes mounted and make removal
  assertions flaky). Real hooks such as `useScroll`/`useSpring` are preserved via
  `importOriginal`.
- Stubs browser APIs jsdom lacks: `matchMedia`, `IntersectionObserver`,
  `ResizeObserver`, `Element.scrollIntoView`, and `window.scrollTo`.
- **`matchMedia` is re-installed before *every* test** (via a `beforeEach`), so a
  prior test's `vi.restoreAllMocks()` can never leave it returning `undefined` —
  which would otherwise crash `matchMedia`-dependent components such as
  `Magnetic` on the next render.

## Useful gotcha

Because `css: true` lets jsdom apply styled-components styles, an element that is
`display: none` at the current viewport (e.g. the mobile menu button on desktop)
can compute an **empty accessible name**, so `getByRole('button', { name })`
won't find it. Query such elements by attribute instead:

```javascript
container.querySelector('button[aria-label="Toggle mobile menu"]');
```

## What is covered

| Area | Files |
| ---- | ----- |
| App routing, redirects, footer on public routes, lazy pages | `src/App.test.jsx` |
| Homepage sections | `src/components/{Hero,Projects,About,Work,Contact}/*.test.jsx`, `src/components/Blog/{Blog,BlogCard,ReadingList}.test.jsx` |
| Shared primitives: section/page headers, page layout landmark, buttons and links | `src/components/ui/*.test.jsx` |
| Editorial post list (titles, dates, facts) | `src/components/Blog/PostList.test.jsx` |
| Pages: archive (year groups, feed link), article (byline, contents, author card, related, 404 state), shelf, 404, dashboard | `src/pages/*.test.jsx` |
| Navigation (scroll-spy, route-aware active item, mobile menu) and footer settings | `src/components/Navigation/Navigation.test.jsx`, `src/components/SiteFooter.test.jsx`, `src/components/CursorToggle.test.jsx` |
| Toasts (API, auto-dismiss, live region, close button) | `src/components/Toast/ToastProvider.test.jsx` |
| Contact form (validation, focus to first invalid field, submission) | `src/components/Contact/Contact.test.jsx`, `src/hooks/useContactForm.test.jsx` |
| Hooks: SEO tags, idle, view counts | `src/hooks/{useSeo,useIdle,useBlogViews}.test.jsx` |
| Blog data: loader, frontmatter, content integrity, sorting/related/date formatting/year grouping, headings and ids | `src/utils/{blogLoader,parseFrontmatter,blogUtils,articleHeadings}.test.*`, `src/blogs/blogContent.test.js` |
| Dates and SEO values (timezone-independent) | `src/utils/seoValues.test.js`, `src/seo.test.js` |
| View counting (unconfigured and fake-client paths) | `src/utils/blogViews.test.js`, `src/utils/blogViews.configured.test.js` |
| Analytics beacon and dashboard data shaping | `src/utils/analyticsBeacon.test.js`, `src/utils/dashboardData.test.js`, `src/components/Analytics.test.jsx` |
| Scrolling, cursor preference and magnetic maths | `src/utils/{scrollToSection,cursorPreference,magnetic}.test.js` |
| Decorative elements (boot greeting, rocket, smoke, starfield, cursor, magnetic) | `src/components/FunElements/*.test.jsx`, `src/components/BackgroundElements.test.jsx` |
| Constants (routes, site config, blog copy, motion variants) | `src/constants/*.test.js` |
| Error boundary | `src/components/ErrorBoundary.test.jsx` |
| Build pipeline: frontmatter/escaping, tags, sitemap and index, RSS, structured data, prerendered content, database config | `scripts/lib/*.test.js` |
| SQL schema and authorization in PGlite | `scripts/database.test.js` |
| Browser contracts (layout, a11y, rocket, boot, article, shelf) | `e2e/*.spec.js` |

Hero unit tests cover idle and media-preference gates, including preference
changes and listener cleanup. Its real WebGL scene is covered by the production
browser checks above. Ambient canvases are covered for lifecycle and cleanup;
their visuals are verified in the browser.

## Adding tests

1. Create `*.test.jsx` next to the module.
2. For components that need routing, wrap them in `<MemoryRouter>`; for anything
   using toasts, wrap in `<ToastProvider>`.
3. Prefer accessible queries (`getByRole`, `getByText`, `getByLabelText`); fall
   back to attribute queries only when necessary (see the gotcha above).
