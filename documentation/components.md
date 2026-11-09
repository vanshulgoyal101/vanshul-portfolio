# Components

Every component lives in `src/components/` (sections and shared UI) or
`src/pages/` (routes). Styling is co-located with styled-components; content
comes from the plain data modules in `src/constants/` (see
[data.md](data.md#portfolio-content-modules)), never from JSX literals, so the
prerendered fallback HTML and the React UI cannot drift apart.

## App shell — `src/App.jsx`

- Wraps the app in `MotionConfig reducedMotion="user"`, `BrowserRouter` and
  `ToastProvider`, renders `GlobalStyles`, the boot loader, a skip link, the
  custom cursor, one `BackgroundElements` wash for every route and the deferred
  decorative layer.
- Routes: `/` (portfolio), `/blog/` (archive), `/blog/:slug` (article),
  `/reading-list/`, `/dashboard` (private), `/blogs` and `/blogs/:slug`
  (redirect aliases) and `*` (noindex 404). Long-form pages and the dashboard
  are lazy-loaded.
- `HomeMetadata` sets the homepage title, description, canonical and the
  homepage-only JSON-LD graph through `useSeo`.
- `ScrollToHash` scrolls to `#section` targets after the boot loader and fonts
  are ready.
- `IdleBackground` lazy-loads the rocket, smoke, telemetry and starfield after
  the browser is idle, only when ambient motion is enabled and the visitor has
  not asked for reduced motion.
- The "Ambient motion" preference is stored in `localStorage` (`vg.ambient`).

## Homepage sections

The sections render in this order, each wrapped in an `ErrorBoundary` and a
`div` whose `id` is the in-page anchor.

### Hero — `components/Hero/Hero.jsx`
- Headline, role and summary from `PROFILE`; social icon links from
  `SOCIAL_PROFILES` (icons in `components/socialIcons.js`), wrapped in
  `Magnetic`.
- Calls to action link to `/#projects` and `/#contact`.
- `HeroScene.jsx` (lazy) mounts the three.js sculpture (`FloatingShape.jsx`)
  only on desktop (≥1025px), after idle, without reduced motion, and pauses
  rendering when off-screen or when the tab is hidden.

### Projects — `components/Projects/Projects.jsx`
- Three featured cards from `FEATURED_PROJECTS`: image with icon fallback, role,
  description, a native `<details>` case study (fields from
  `CASE_STUDY_FIELDS`), stats and an external link.
- "More things I've built": a collapsed native `<details>` directory rendering
  `PROJECT_DIRECTORY` groups as compact rows with live/source icon links.
- Icons are resolved from keys in the data through a local `ICONS` map.

### About — `components/About/About.jsx`
- Biography built from `PROFILE` and the current role in `EXPERIENCE`, the
  profile photo with a placeholder until it loads, `HIGHLIGHTS` cards and
  `SKILL_GROUPS`.

### Work — `components/Work/Work.jsx`
- One card per `EXPERIENCE` entry: title, company and department, dates,
  location, description, technology tags and company link.

### Blog — `components/Blog/Blog.jsx`
- Homepage writing preview: the `ReadingList` card, the three newest
  `BlogCard`s and a "View all N posts" link to `/blog/` when more exist; an
  empty state when there are no posts; a closing quote from `BLOG_CONTENT`.
- `BlogCard.jsx`: a link to `postPath(slug)` showing date, read time, optional
  view count, title and clamped summary.
- `ReadingList.jsx`: the "From My Shelf" card linking to `/reading-list/` with
  book and essay counts.

### Contact — `components/Contact/Contact.jsx`
- Location, current employer and languages from `PROFILE`, social icon links,
  and the Formspree form driven by `useContactForm` (validation, duplicate
  submit guard, cancellation, toasts).

## Pages

| Page | File | Notes |
| --- | --- | --- |
| Archive | `pages/BlogIndex.jsx` | All posts newest first; shared `blogIndexJsonLd`. |
| Article | `pages/BlogPost.jsx` | Markdown body with stable `h2`/`h3` ids, a "Contents" list for posts with three or more sections, metadata, share button (Web Share API or clipboard), related posts, view count, `postJsonLd`; noindex "not found" state for unknown slugs. |
| Reading list | `pages/ReadingList.jsx` | Numbered book catalogue and essay list from `constants/books.js`; deep links to `#books` and `#essays`. |
| Dashboard | `pages/Dashboard.jsx` | Private analytics UI; see [analytics.md](analytics.md). |
| Not found | `pages/NotFound.jsx` | noindex 404 with links home, to the archive and to the shelf. |

## Shared UI

- **Navigation** (`components/Navigation/Navigation.jsx`): fixed header with a
  scroll-progress ring around the "VG" logo, scroll-spy highlighting, and a
  mobile drawer that locks body scroll, traps focus and closes on Escape. It
  keeps `--header-offset` in sync with its height for anchor scrolling.
- **SiteFooter** (`components/SiteFooter.jsx`): name, year, footer links and a
  "Display settings" disclosure holding `CursorToggle` and the ambient-motion
  switch.
- **CursorToggle** (`components/CursorToggle.jsx`): custom-cursor switch, shown
  only for fine pointers; stored through `utils/cursorPreference.js`.
- **ToastProvider** (`components/Toast/ToastProvider.jsx`): context exposing
  `showSuccess`, `showError`, `showInfo` and `removeToast` via `useToast()`;
  toasts auto-dismiss after five seconds by default.
- **ErrorBoundary** (`components/ErrorBoundary.jsx`): per-section fallback with
  a reload button, or a custom `fallback` prop (used as `null` around the 3D
  scene).
- **BackgroundElements** (`components/BackgroundElements.jsx`): fixed,
  `aria-hidden`, pointer-transparent gradient wash rendered once by `App`.

## Decorative elements — `components/FunElements/`

All are hidden from assistive technology and skipped for reduced motion.

- **BootLoader**: multilingual greeting shown before the page is revealed;
  completes immediately for reduced-motion visitors.
- **CustomCursor**: dot-and-ring cursor for fine pointers when enabled.
- **Magnetic**: pulls its child toward the pointer on hover-capable devices.
- **FloatingRocket**: three taps launch the rocket (keyboard accessible); it
  dispatches `rocket-launch` and `rocket-emit-smoke` events.
- **SmokeTransition**: canvas smoke driven by those events, then scrolls to and
  focuses About.
- **InteractiveSpaceBackground**: canvas starfield with occasional shooting
  stars and click "tracking" rings; pauses while the tab is hidden.
- **RandomTelemetry**: up to seven subtle code/maths glyphs spawned across a
  3×3 grid of screen zones.

## Conventions

- Hover lifts use `transform` only; interactive targets are at least 44px.
- Visible `:focus-visible` outlines on every control.
- Text clamping (`-webkit-line-clamp`) with reserved heights keeps card grids
  even; image frames reserve space with `aspect-ratio`.
- New content belongs in a `src/constants/` data module; components map icon
  keys to icons locally.

## Adding a section

1. Create `src/components/<Name>/<Name>.jsx` and a co-located test.
2. Put its content in a data module under `src/constants/`.
3. Render it in `App.jsx` inside `<ErrorBoundary><SectionWrapper id="…">`, add
   the id to `navItems` in `Navigation.jsx` if it should be navigable, and add
   it to `homeContent` in `scripts/lib/prerenderContent.mjs` so it is
   crawler-readable.
