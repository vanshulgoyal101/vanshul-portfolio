# Components

Every component lives in `src/components/` (sections and shared UI) or
`src/pages/` (routes). Styling is co-located with styled-components. Facts
(profile, projects, jobs, shelf, blog copy, posts) come from the plain data
modules in `src/constants/` and the Markdown posts in `src/blogs/` (see
[data.md](data.md#portfolio-content-modules)), so the prerendered fallback
HTML and the React UI share them. Some copy is still written in JSX and does
not appear in the fallback HTML: the Projects, About, Work and Contact ledes,
the About greeting and its last two paragraphs, the Contact introduction, the
shelf's "Books and essays that shaped how I think." line and the hero's
credentials line beyond "Associate Analyst at United Airlines".

## App shell — `src/App.jsx`

- Wraps the app in `MotionConfig reducedMotion="user"`, `BrowserRouter` and
  `ToastProvider`, renders `GlobalStyles`, the boot loader, a skip link, the
  custom cursor (once the boot loader has finished), one `BackgroundElements`
  wash for every route and the deferred decorative layer. The GoatCounter
  loader (`Analytics`, below) is mounted inside the router.
- Routes: `/` (portfolio), `/blog/` (archive), `/blog/:slug` (article),
  `/reading-list/`, `/projects/:id` (a featured project's story; unknown ids
  render the noindex 404), `/dashboard` (private), `/blogs` and `/blogs/:slug`
  (redirect aliases) and `*` (noindex 404). Long-form pages, project stories
  and the dashboard are lazy-loaded. React Router matches each path with or without the
  trailing slash.
- While a lazy page loads, `PageLoading` (a `role="status"` "Loading page..."
  block, 70vh tall so the footer does not jump) fills the page. Every lazy
  route, the dashboard included, shares it. It deliberately has no navigation:
  each page renders its own, so a menu opened in the placeholder would close
  when the page replaced it. React Router runs client-side navigations in a
  transition, so the current page stays on screen until the next one is ready
  and the fallback mostly shows on cold visits.
- All routes sit inside `RouteBoundary`: an `ErrorBoundary` whose fallback is
  `RouteError` and whose `resetKey` is the pathname, so navigating anywhere
  else clears a failed page. Each homepage section has its own boundary.
- `HomeMetadata` sets the homepage title, description, canonical and the
  homepage-only JSON-LD graph through `useSeo`.
- `ScrollToHash` scrolls to `#section` targets after the boot loader and fonts
  are ready.
- `IdleBackground` lazy-loads the rocket, smoke, telemetry and starfield after
  the browser is idle (`useIdle(1200)`), only once the boot loader has
  finished, ambient motion is enabled and the visitor has not asked for
  reduced motion.
- The "Ambient motion" preference is stored in `localStorage` (`vg.ambient`).
- `KonamiCode` (inside `ToastProvider`) listens for the Konami code on every
  route, and `useAwayTitle` swaps the tab title while the tab is hidden (see
  [Playful touches](#playful-touches)).

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
  only on desktop (≥1025px), after the boot loader and browser idle, without
  reduced motion. It pauses rendering when off-screen or when the tab is
  hidden. `FloatingShape` is a gradient torus knot with a wireframe overlay
  and two rings; visitors can drag to rotate it (`OrbitControls`, no zoom or
  pan).

### Projects — `components/Projects/Projects.jsx` (01 / Selected work)
- Three featured cards from `FEATURED_PROJECTS`. Each has:
  - an 8:5 image frame (`object-position: 50% 100%`) with an icon fallback
  - a mono role label, a title with an optional brand mark, a description
    and a stats list
  - a "Read the full story" router link to `/projects/<id>/` (named "Read
    the full story: ⟨project⟩") and a "Visit Website" link. The case study
    itself lives on the project page, so the card stays short.
- Cards lift 4px on hover with Framer `whileHover`. The image itself never
  transforms.
- "More things I've built": a collapsed native `<details>` labelled with the
  project count. It renders `PROJECT_DIRECTORY` groups as compact rows with
  44px live/source icon links.
- Icons are resolved from keys in the data through a local `ICONS` map.

### About — `components/About/About.jsx` (02 / Background)
- Biography from `PROFILE` and the current `EXPERIENCE` role, with highlights
  set as semibold `strong` text in `--color-text-primary` (emphasis, not
  links).
- A hairline-framed profile photo with a placeholder until it loads.
- Four `HIGHLIGHTS` stat tiles (`ul`) and `SKILL_GROUPS` as neutral chips.

### Work — `components/Work/Work.jsx` (03 / Experience)
- An ordered timeline (`ol`) of full `EXPERIENCE` cards:
  - an icon, the title (h3) and company/department (h4)
  - dates and location, then the description
  - mono technology chips and a hostname link (for example "united.com")
    labelled "Visit the … website"
- A compact "Earlier" list (`ul` labelled by its mono label) of
  `EARLIER_EXPERIENCE`: title · company, dates and a one-line summary per row.
  It uses no h3/h4, so the full cards stay the only role headings.
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
| Archive | `pages/BlogIndex.jsx` | "Archive · N posts" eyebrow above the "Writings" title; links to the RSS feed (`/feed.xml`) and the reading list. Posts are grouped by year (h2, sticky above 640px) and listed newest first with `PostList`, with view counts when available. Uses the shared `blogIndexJsonLd`. |
| Article | `pages/BlogPost.jsx` | Opens with "Back to Blog" (`/blog/`), the category eyebrow, the title and the summary as a dek. Then a byline (avatar, author, `<time>`, read time, live view count, Share via the Web Share API or clipboard) and an "On this page" list for posts with three or more `h2`/`h3` headings. The markdown body has stable `h2`/`h3` ids. It ends with an author card linking to `/#about` and "More writings" (three related posts from `getRelatedPosts` and an "All posts" link). Emits `postJsonLd`. Unknown slugs get a noindex "Blog Post Not Found" state with a "Browse all posts" button. |
| Project story | `pages/ProjectPage.jsx` | `/projects/<id>/` for each `FEATURED_PROJECTS` entry. "All projects" (`/#projects`), the role as eyebrow, the title, the story summary as lede, the 8:5 project image, "Key facts" (the card stats plus `story.facts`), "In short" (the four `CASE_STUDY_FIELDS`), the story sections, the live link and source code link (when public), and a "More projects" nav linking to the other stories and back to `/#projects`. Copy comes from `constants/projectStories.js`. Emits `projectJsonLd`. Unknown ids render `NotFound`. |
| Reading list | `pages/ReadingList.jsx` | "Back to Writings" (`/#blog`), a header with Books/Essays pills, a numbered two-column book catalogue and an essay list with source hostnames from `constants/books.js`. Deep links to `#books`, `#essays` and `#shelf-top`. |
| Dashboard | `pages/Dashboard.jsx` | Private analytics UI; see [analytics.md](analytics.md). |
| Not found | `pages/NotFound.jsx` | noindex 404 with a large "404", "This page wandered off.", a random quip from `NOT_FOUND_QUIPS`, the missing path (decoded, in `<code>`) and buttons home, to the blog and to the shelf. |

## Shared UI

- **Primitives** (`components/ui/`): `SectionHeader`, `PageHeader`,
  `PageLayout`, `Button`/`ButtonLink`/`TextLink` and the `eyebrow` mixin.
  See [styles.md](styles.md#shared-primitives-srccomponentsui).
- **PostList** (`components/Blog/PostList.jsx`): the editorial post list shared
  by the archive and "More writings".
  - each row has a mono `<time>` (with or without the year), an h3 title link,
    a two-line summary and "category · read time · views"
  - the title link covers the whole row but is named by the title alone
- **Navigation** (`components/Navigation/Navigation.jsx`):
  - a floating pill (frosted once the page scrolls past 50px) with a
    scroll-progress ring around the "VG" logo and an underline indicator on
    the active link, which also gets `aria-current`
  - the active item comes from scroll-spy on `/` only; "Blog" is active on
    `/blog*` and `/reading-list`, "Projects" on `/projects/*`, and nothing on
    other routes
  - every link is a `/#section` URL; a plain click calls
    `navigate('/#section')` and `ScrollToHash` in `App` does the scrolling
  - at 768px and below, a numbered drawer that locks body scroll, focuses its
    first link, traps focus, closes on Escape or a click on the overlay and is
    `inert` while closed; widening past 768px closes it
  - it keeps `--header-offset` in sync with its height for anchor scrolling
- **SiteFooter** (`components/SiteFooter.jsx`):
  - name, "© YEAR · vanshul.com", a quip from `FOOTER_QUIPS` (one per page
    load) and the four footer links
  - a "Display settings" disclosure holding `CursorToggle` and the
    ambient-motion switch
  - `App` renders it after every route, the private dashboard included
- **CursorToggle** (`components/CursorToggle.jsx`): custom-cursor switch, shown
  only for fine pointers and disabled under reduced motion. It is stored
  through `utils/cursorPreference.js`: `getCursorPreference()` reads
  `vg.cursor` (`on`, `off` or `auto` when unset), `setCursorPreference()`
  writes it and dispatches the `vg:cursorpref` event (`CURSOR_PREF_EVENT`),
  and `isCustomCursorEnabled()` is true for a hover-capable fine pointer
  without reduced motion unless the preference is `off`.
- **socialIcons** (`components/socialIcons.js`): `SOCIAL_ICONS`, the
  react-icons component for each `SOCIAL_PROFILES` id (X, LinkedIn,
  Instagram, GitHub, games controller), shared by the hero and Contact.
- **ToastProvider** (`components/Toast/ToastProvider.jsx`, re-exported with
  `useToast` from `components/Toast/index.js`): context exposing
  `showSuccess`, `showError`, `showInfo` and `removeToast` via `useToast()`;
  toasts auto-dismiss after five seconds by default.
- **ErrorBoundary** (`components/ErrorBoundary.jsx`): per-section fallback with
  a reload button, or a custom `fallback` prop (`null` around the 3D scene,
  `RouteError` around the routes). A new `resetKey` value clears the error and
  renders the children again.
- **RouteError** (`components/RouteError.jsx`): the page-level fallback. It
  renders inside `PageLayout` (navigation, one `main` and the `h1` "This page
  didn't load") with "Reload page" and "Back home" actions. Each GitHub Pages
  deploy deletes the previous build's hashed chunks, so a tab opened before a
  release fails on its next lazy route; on mount `RouteError` therefore reloads
  once when `shouldRetry()` from `utils/routeRetry.js` allows it. That stores
  the attempt time in `sessionStorage` (`vg.routeRetryAt`) and refuses another
  automatic reload within a minute, while offline, or when storage is
  unavailable.
- **BackgroundElements** (`components/BackgroundElements.jsx`): fixed,
  `aria-hidden`, pointer-transparent gradient wash rendered once by `App`.
- **Analytics** (`components/Analytics.jsx`): renders nothing. When
  `VITE_GOATCOUNTER_CODE` is set (letters, digits and hyphens only) it injects
  GoatCounter's `count.js` once and counts each new pathname. It stays off on
  `/dashboard` and when Do Not Track or Global Privacy Control is on. See
  [analytics.md](analytics.md#optional-goatcounter-integration).

## Decorative elements — `components/FunElements/`

Each one is skipped or switched off under reduced motion. The smoke canvas,
the rocket's flame and tooltip, and the greeting words are `aria-hidden`; the
boot overlay is a labelled `role="status"` and the rocket is a real button.
The starfield canvas and the cursor dot and ring carry no content. The
telemetry overlay is `aria-hidden`, so its text glyphs (π, Σ, `{ }`, binary
digits, a haiku and a code fragment) stay out of the accessibility tree.

- **BootLoader**: multilingual greeting shown before the page is revealed;
  completes immediately for reduced-motion visitors.
- **CustomCursor**: dot-and-ring cursor for fine pointers when enabled. It
  adds `has-custom-cursor` to `body` (which hides the native cursor) only once
  it has a pointer position. The ring grows over pointer targets: links,
  buttons, disclosure summaries, selects, `[role="button"]`, `.interactive`,
  labels that toggle a checkbox or radio (the footer switches) and inline
  `cursor: pointer`. Because `has-custom-cursor` forces every computed cursor
  to `none`, this list mirrors the `cursor: pointer` rules; extend it when a
  new kind of control gets one.
- **Magnetic**: pulls its child toward the pointer on hover-capable,
  fine-pointer devices without reduced motion; elsewhere it renders the child
  unchanged. The child follows 15% of the cursor's offset from its centre
  (`FOLLOW_RATIO`), and the pull stops growing once the cursor is `range` px
  away (default 40). `magneticOffset` in `utils/magnetic.js` does the maths.
- **FloatingRocket**: three taps launch the rocket (keyboard accessible); it
  dispatches `rocket-launch` and `rocket-emit-smoke` events.
- **SmokeTransition**: canvas smoke driven by those events, then scrolls to and
  focuses About.
- **InteractiveSpaceBackground**: canvas starfield (90 stars and two faint
  planets) with occasional shooting stars and click "tracking" rings; pauses
  while the tab is hidden.
- **RandomTelemetry**: up to seven subtle code/maths glyphs at a time, spawned
  every 700ms across eight screen zones (a 3×3 grid without the centre). Each
  glyph lives 3.2–4.8s from its own spawn, whatever else appears meanwhile, and
  never repeats one of the seven most recent shapes.
- **KonamiCode**: renders nothing. Typing ↑ ↑ ↓ ↓ ← → ← → B A (outside form
  fields) shows a "Cheat code accepted" info toast and spins the page's
  `<main>` once around the middle of the viewport. Unlike the layers above it
  stays mounted under reduced motion and with ambient motion off, but then
  only the toast appears (`App` passes the ambient switch as `motionEnabled`).

## Playful touches

All playful copy lives in `constants/wit.js`. Jokes may only draw on what the
site already shows (the rocket, NASA and the rover, cricket, the shelf, the
panda favicon); never invent facts about the author for a punchline.

- `FOOTER_QUIPS` and `NOT_FOUND_QUIPS`: one line is chosen with
  `utils/pickRandom.js` when the footer or 404 page mounts.
- `AWAY_TITLES`: `hooks/useAwayTitle.js` sets one as the tab title while the
  tab is hidden and restores the real title on return, unless something (a
  route change) set a new title meanwhile. Analytics records the pathname,
  not `document.title`, so the away title never reaches the stats.
- `KONAMI_TOAST`: the Konami toast (above).
- `CONSOLE_GREETING`: `utils/consoleGreeting.js` logs it once from
  `main.jsx`, with a link to the public source (`SOURCE_REPO_URL`) and a hint
  about the Konami code.
- Contact copy is space-themed but keeps plain instructions: "Launching..."
  while sending, "Message launched 🚀", "Not quite ready for launch",
  "Houston, we have a problem" and "Lost signal".

## Conventions

- Hover lifts move only `transform`: Framer `whileHover` on motion elements
  (project and post cards), CSS on the shelf banner, which is not a motion
  element. Interactive targets are at least 44px tall.
- The global `:focus-visible` ring in `src/index.css` covers every control.
  Several components restate it with their own offset; `PostList` draws it on
  the row, and the footer and the dashboard chart use a 2px ring (see
  [styles.md](styles.md#global-behaviour)).
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
