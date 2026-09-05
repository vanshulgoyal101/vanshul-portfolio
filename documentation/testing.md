# Testing

The project uses **Vitest** with **React Testing Library** and a **jsdom**
environment. Configuration lives in `vite.config.js` (the `test` block); global
setup lives in [`src/test/setup.js`](../src/test/setup.js).

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

`e2e/boot.spec.js` checks visible multilingual greetings through Welcome, the
centered Projects text, inert content and scroll-lock release, About deep links
after the intro, no replay on internal navigation, and reduced-motion bypass.
It captures greeting and revealed-page screenshots on desktop and mobile.

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

| Area | File |
| ---- | ---- |
| Blog sorting + related-posts utils | `src/utils/blogUtils.test.js` |
| Blog loader | `src/utils/blogLoader.test.js` |
| Frontmatter parser | `src/utils/parseFrontmatter.test.js` |
| Blog content integrity (unique ids/slugs, valid dates) | `src/blogs/blogContent.test.js` |
| Blog view counting | `src/utils/blogViews.test.js` |
| Idle hook | `src/hooks/useIdle.test.jsx` |
| SEO hook (title/meta/OG/canonical/JSON-LD) | `src/hooks/useSeo.test.jsx` |
| Contact form hook | `src/hooks/useContactForm.test.jsx` |
| Toast provider/context | `src/components/Toast/ToastProvider.test.jsx` |
| Blog UI (section, card, modal) | `src/components/Blog/*.test.jsx` |
| Navigation | `src/components/Navigation/Navigation.test.jsx` |
| Error boundary | `src/components/ErrorBoundary.test.jsx` |
| Magnetic wrapper | `src/components/FunElements/Magnetic.test.jsx` |
| About / Work / Projects sections | `src/components/{About,Work,Projects}/*.test.jsx` |
| Contact form (integration) | `src/components/Contact/Contact.test.jsx` |
| Analytics (no-op when unconfigured) | `src/components/Analytics.test.jsx` |
| Blog post page (render, 404, SEO, related) | `src/pages/BlogPost.test.jsx` |
| Blog constants | `src/constants/blogConstants.test.js` |
| Site config integrity | `src/constants/siteConfig.test.js` |
| SEO build helpers (frontmatter/escape/rfc822/readPosts) | `scripts/lib/seo.test.js` |

Hero unit tests cover idle and media-preference gates, including preference
changes and listener cleanup. Its real WebGL scene is covered by the production
browser checks above. Other ambient canvas components are not deeply tested.

## Adding tests

1. Create `*.test.jsx` next to the module.
2. For components that need routing, wrap them in `<MemoryRouter>`; for anything
   using toasts, wrap in `<ToastProvider>`.
3. Prefer accessible queries (`getByRole`, `getByText`, `getByLabelText`); fall
   back to attribute queries only when necessary (see the gotcha above).
