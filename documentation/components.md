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
`div` whose `id` is the in-page anchor. Every section except the hero opens
with `SectionHeader` ([styles.md](styles.md#shared-primitives-srccomponentsui)):
a numbered mono eyebrow inside a centred h2, followed by a lede.

### Hero — `components/Hero/Hero.jsx`
- A mono eyebrow (`PROFILE.headline`) with an accent dot, the h1 name and
  `PROFILE.summary`.
- A credentials line linking United Airlines, the NASA Space Apps Collective
  and HERC 2023.
- `ButtonLink` calls to action: primary "Explore My Work" (`/#projects`) and
  secondary "Get In Touch" (`/#contact`).
- 44px hairline social circles from `SOCIAL_PROFILES` (icons in
  `components/socialIcons.js`), each wrapped in `Magnetic`.
- Left-aligned above 768px, with the CTA and first social icon aligned to the
  h1. Centred at 768px and below; stacked 280px buttons at 480px and below.
  These are e2e contracts.
- `HeroScene.jsx` (lazy) mounts the three.js sculpture (`FloatingShape.jsx`)
  only on desktop (≥1025px), after idle, without reduced motion. It pauses
  rendering when off-screen or when the tab is hidden.

### Projects — `components/Projects/Projects.jsx` (01 / Selected work)
- Three featured cards from `FEATURED_PROJECTS`. Each has:
  - an 8:5 image frame (`object-position: 50% 100%`) with an icon fallback
  - a mono role label, a title with an optional brand mark, a description
    and a stats list
  - a native `<details>` case study (fields from `CASE_STUDY_FIELDS`) and a
    "Visit Website" link
- Cards lift 4px on hover with Framer `whileHover`. The image itself never
  transforms.
- "More things I've built": a collapsed native `<details>` labelled with the
  project count. It renders `PROJECT_DIRECTORY` groups as compact rows with
  44px live/source icon links.
- Icons are resolved from keys in the data through a local `ICONS` map.

### About — `components/About/About.jsx` (02 / Background)
- Biography from `PROFILE` and the current `EXPERIENCE` role, with highlights
  set as ink `strong` text.
- A hairline-framed profile photo with a placeholder until it loads.
- Four `HIGHLIGHTS` stat tiles (`ul`) and `SKILL_GROUPS` as neutral chips.

### Work — `components/Work/Work.jsx` (03 / Experience)
- An ordered timeline (`ol`) of `EXPERIENCE` cards:
  - an icon, the title (h3) and company/department (h4)
  - dates and location, then the description
  - mono technology chips and a hostname link (for example "united.com")
    labelled "Visit the … website"
- Typography sizes are e2e contracts (see [homepage.md](homepage.md)).

### Blog — `components/Blog/Blog.jsx` (04 / Essays)
- The homepage writing preview has:
  - the three newest `BlogCard`s in a three-up grid
  - a secondary "View all N posts" button to `/blog/` when more exist
  - the `ReadingList` banner and a closing pull quote from `BLOG_CONTENT`
  - an empty state when there are no posts
- `BlogCard.jsx`: a hairline card linking to `postPath(slug)`. It shows a mono
  meta row (formatted `<time>`, read time, optional view count), the title, a
  clamped summary and "Read More".
- `ReadingList.jsx`: a dark ink banner linking to `/reading-list/`, labelled
  "Reading list: From My Shelf", with book and essay counts.

### Contact — `components/Contact/Contact.jsx` (05 / Say hello)
- A definition list (`dl`) of location, current position and languages from
  `PROFILE`, plus social icon links.
- The Formspree form card, driven by `useContactForm`:
  - validation, a duplicate-submit guard, cancellation and toasts
  - `noValidate`, so the form's own messages replace the browser bubbles
  - invalid fields set `aria-invalid` and show `#b91c1c` messages, which meet
    AA contrast

## Pages

Subpages render inside `PageLayout`, which supplies the navigation and the
page's single `<main>`. Their titles use `PageHeader`.

| Page | File | Notes |
| --- | --- | --- |
| Archive | `pages/BlogIndex.jsx` | "Archive · N posts" eyebrow; links to the RSS feed (`/feed.xml`) and the reading list. Posts are grouped by year (h2, sticky on wide screens) and listed newest first with `PostList`. Uses the shared `blogIndexJsonLd`. |
| Article | `pages/BlogPost.jsx` | Opens with "Back to Blog" (`/blog/`), the category eyebrow, the title and the summary as a dek. Then a byline (avatar, author, `<time>`, read time, live view count, Share via the Web Share API or clipboard) and an "On this page" list for posts with three or more sections. The markdown body has stable `h2`/`h3` ids. It ends with an author card linking to `/#about` and "More writing" (three related posts and an "All posts" link). Emits `postJsonLd`. Unknown slugs get a noindex "Blog Post Not Found" state. |
| Reading list | `pages/ReadingList.jsx` | "Back to Writings" (`/#blog`), a header with Books/Essays pills, a numbered two-column book catalogue and an essay list with source hostnames from `constants/books.js`. Deep links to `#books`, `#essays` and `#shelf-top`. |
| Dashboard | `pages/Dashboard.jsx` | Private analytics UI; see [analytics.md](analytics.md). |
| Not found | `pages/NotFound.jsx` | noindex 404 with a large "404", "This page wandered off." and buttons home, to the blog and to the shelf. |

## Shared UI

- **Primitives** (`components/ui/`): `SectionHeader`, `PageHeader`,
  `PageLayout`, `Button`/`ButtonLink`/`TextLink` and the `eyebrow` mixin.
  See [styles.md](styles.md#shared-primitives-srccomponentsui).
- **PostList** (`components/Blog/PostList.jsx`): the editorial post list shared
  by the archive and "More writing".
  - each row has a mono `<time>` (with or without the year), an h3 title link,
    a two-line summary and "category · read time · views"
  - the title link covers the whole row but is named by the title alone
- **Navigation** (`components/Navigation/Navigation.jsx`):
  - a floating frosted pill with a scroll-progress ring around the "VG" logo
    and an underline indicator on the active link
  - the active item comes from scroll-spy on `/` only; "Blog" is active on
    `/blog*` and `/reading-list`, and nothing on other routes
  - at 768px and below, a numbered drawer that locks body scroll, focuses its
    first link, traps focus, closes on Escape and is `inert` while closed
  - it keeps `--header-offset` in sync with its height for anchor scrolling
- **SiteFooter** (`components/SiteFooter.jsx`):
  - name, "© YEAR · vanshul.com" and the four footer links
  - a "Display settings" disclosure holding `CursorToggle` and the
    ambient-motion switch
  - `App` renders it after every public route through `RouteFooter`; the
    private dashboard has its own chrome
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

- Hover lifts move only `transform`, through Framer `whileHover` on motion
  elements. Interactive targets are at least 44px tall.
- The global `:focus-visible` ring in `src/index.css` covers every control.
  Override it only to change its shape.
- Text clamping (`-webkit-line-clamp`) keeps card grids even. Image frames
  reserve space with `aspect-ratio`.
- New content belongs in a `src/constants/` data module. Components map icon
  keys to icons locally.
- Subpages use `PageLayout` and `PageHeader`; actions use the `Button`
  primitives.

## Adding a section

1. Create `src/components/<Name>/<Name>.jsx` and a co-located test.
2. Put its content in a data module under `src/constants/`.
3. Render it in `App.jsx` inside `<ErrorBoundary><SectionWrapper id="…">`, add
   the id to `navItems` in `Navigation.jsx` if it should be navigable, and add
   it to `homeContent` in `scripts/lib/prerenderContent.mjs` so it is
   crawler-readable.
