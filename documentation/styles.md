# Styling

How the site looks and why. Everything here is read from the code. When a
value changes, update this file in the same commit.

## Where styles live

| Layer | File | Holds |
| --- | --- | --- |
| Reset and focus | [`src/index.css`](../src/index.css) | Box sizing, margin reset, media defaults, the global `:focus-visible` ring, the custom-cursor rule, print styles |
| Tokens and element defaults | [`src/styles/GlobalStyles.js`](../src/styles/GlobalStyles.js) | CSS custom properties, heading/paragraph/link defaults, tap targets, scrollbars, reduced motion |
| Shared primitives | [`src/components/ui/`](../src/components/ui) | `SectionHeader`, `PageHeader`, `PageLayout`, `Button`/`ButtonLink`/`TextLink`, the `eyebrow` mixin |
| Component styles | `styled-components` next to each component | Layout and details local to one component |

Fonts load from Google Fonts in [`index.html`](../index.html). The page
preconnects, loads the stylesheet with `media="print"` and swaps it to `all`
on load, so it does not block rendering. `display=swap` avoids invisible text,
and a `<noscript>` link covers visitors without JavaScript.

## Visual language

- **Paper, ink, one accent.** A warm paper page (`#f6f3eb`), near-black ink
  headings, slate body text and a single blue accent (`#1d4ed8`) for links,
  labels and focus. The redesign removed gradient text, gradient buttons and
  their tokens.
- **Hairlines over shadows.** Surfaces are separated by 1px hairlines. Only
  cards that lift on hover get `--shadow-md`. Strong 1px ink rules divide major
  groups: archive years, shelf collections and "More writing".
- **Mono eyebrows.** Small uppercase JetBrains Mono labels sit above titles
  (`01 / Selected work`, `Archive · 8 posts`) and carry metadata (dates, read
  times, tech chips).
- **Display headings.** Space Grotesk for headings, Inter for text,
  `text-wrap: balance` on headings and `pretty` on paragraphs.
- **Short, small motion.** Reveals travel 14px over 0.4s. Hovers move 3–4px
  over 160–240ms. Only `transform` and `opacity` animate.

## Tokens

All tokens are defined in `:root` in `GlobalStyles.js`.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg-primary` | `#f6f3eb` | Page background |
| `--color-bg-secondary` | `#f6f3eb` | Inputs and inset panels |
| `--color-bg-tertiary` | `#edeae0` | Subtle fills, chips, inline code |
| `--color-bg-card` | `#ffffff` | Cards and panels |
| `--color-ink` | `#0f172a` | Headings, primary buttons, the shelf banner |
| `--color-text-primary` | `#1e293b` | Article body, strong text |
| `--color-text-secondary` | `#475569` | Paragraphs and ledes (default `p` colour) |
| `--color-text-muted` | `#5b6677` | Metadata and labels |
| `--color-accent-primary` | `#1d4ed8` | Links, eyebrows, focus ring, list markers |
| `--color-accent-secondary` | `#3b82f6` | Decorative only: scroll-ring gradient, background glow, boot loader |
| `--color-accent-soft` | `rgba(29, 78, 216, 0.07)` | Tinted fills (hero dot halo) |
| `--color-accent-line` | `rgba(29, 78, 216, 0.24)` | Resting underline of prose links |
| `--color-border` / `--color-border-hover` | slate at 8% / 15% | Card borders |
| `--color-hairline` | `rgba(15, 23, 42, 0.12)` | Separators, secondary buttons, pills |

Contrast, measured on white, the page and tertiary backgrounds:

- secondary text: 7.58 / 6.83 / 6.30
- muted text: 5.81 / 5.24 / 4.83
- accent on the page: 6.04

Muted was `#94a3b8` (2.56:1) until browser accessibility scans caught it. Any
replacement must stay at or above 4.5:1 on all three backgrounds. Form errors
use `#b91c1c`, because the earlier `#ef4444` failed AA on the page. Light text
on the ink shelf banner is at least 6.7:1.

### Shape, depth and motion

| Token | Value |
| --- | --- |
| `--radius-sm` / `-md` / `-lg` / `-pill` | 8px / 12px / 18px / 999px |
| `--shadow-sm` | `0 1px 2px rgba(15, 23, 42, 0.05)` |
| `--shadow-md` | `0 18px 40px -24px rgba(15, 23, 42, 0.35)` (hover lift) |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--duration-fast` / `-base` | 160ms / 240ms |

### Spacing and layout

- `--spacing-xs` … `--spacing-2xl`: fluid `clamp()` steps from 4px to 128px.
- `--container-padding`: `clamp(1rem, 5vw, 3rem)`, the page gutter everywhere.
- `--container-xl` (1280px) bounds homepage sections and the navigation.
  `--container-lg` (1024px) is the `PageLayout` "wide" width (see below).
- `--header-offset` on `html` (`clamp(5rem, 8vw, 7rem)`) is the
  `scroll-padding-top`, so native anchor jumps clear the fixed header.
- Homepage sections pad `clamp(3.5rem, 7vw, 6rem)` top and bottom.
- `--z-fixed` (300) is the only shared layer. Components set other z-indexes
  locally.

### Type

- Families: `--font-primary` (Inter), `--font-display` (Space Grotesk) and
  `--font-mono` (JetBrains Mono).
- Fluid scale: `--text-xs` … `--text-6xl` (`clamp()`; base 16–18px).
- `--text-section-title`: 2.5rem, and 2rem at 768px and below. Every homepage
  section title uses it, Work included (40px desktop / 32px mobile, an e2e
  contract).
- `--text-lede`: 1.125rem, and 1rem at 768px and below.
- Headings: display font, 700, `-0.02em` tracking, ink, balanced wrapping.
- Paragraphs: secondary colour, line-height 1.7, `text-wrap: pretty`.
- Long-form articles: 18px (17px mobile) on a 1.8 line-height in
  `--color-text-primary`, on a ~70 character measure (see `PageLayout`).

Responsive breakpoints are plain media queries; CSS variables cannot be used in
them. The values in use are 1024px (hero scene, two-column grids), 900px,
768px (the main mobile switch, 37 uses), 640px, 600px and 480px.

## Shared primitives (`src/components/ui`)

| Primitive | Renders | Notes |
| --- | --- | --- |
| `SectionHeader` | `header > h2 + p` | Centered homepage title. The `NN / label` eyebrow is an `aria-hidden` span *inside* the h2, so hash navigation (which aligns the h2 below the header) keeps it visible and the accessible name stays the title. |
| `PageHeader` | `header > p? + h1 + p? + children` | Left-aligned subpage title with an optional eyebrow `label`, a lede and extras (byline, feed links, collection index). Extra props (e.g. `id`) go on the `header`. |
| `PageLayout` | `Navigation` + `main` | The single `<main>` landmark for subpages. `width="wide"` (1024px) for listings, `width="reading"` (46rem) for articles and the 404. Top padding 8rem (6.5rem mobile) clears the floating header. |
| `ButtonLink` / `Button` | router `Link` / `button` | Pill, 48px tall. `$variant="primary"` (ink, accent on hover) or `"secondary"` (hairline outline). |
| `TextLink` | router `Link` | Quiet secondary-colour link ("Back to Blog", "All posts"). Use `as="a"` for in-page anchors and files (`#shelf-top`, `/feed.xml`). |
| `eyebrow` (`typography.js`) | css mixin | Mono 12px uppercase, 0.14em tracking, accent colour. Override `color` for muted labels. |

Icons with `data-arrow="forward" | "back" | "up"` inside `Button`,
`ButtonLink` or `TextLink` nudge 3px in that direction on hover.

## Recurring patterns

- **Cards** (projects, homepage posts, contact form): white, a 1px
  `--color-border` border and `--radius-lg`. Hover lifts use Framer Motion
  `whileHover={{ y: -4 }}`, never CSS `:hover` transforms, because Framer's
  inline transform would override them.
- **Editorial lists** (`Blog/PostList`, the archive, "More writing", the
  shelf):
  - rows are separated by hairlines, with a mono date column and an h3 title
  - the title link stretches over the row with `::after`, so the whole row is
    clickable while the link's name stays the title alone
  - the focus ring is drawn on that `::after`, around the row
- **Chips**: a 1px `--color-border` outline. Work tech chips are mono 12px on
  the page colour; About skill chips are 14px Inter on white.
- **Text clamping**: `-webkit-line-clamp` on card and list summaries (2–3
  lines). Real overflow is still tested at 320px in e2e.
- **Prose** (`BlogPost`):
  - accent links with a soft underline that turns solid on hover
  - accent list markers
  - display-font block quotes with a 2px accent rule
  - ink code blocks
  - `hr` drawn as a centred `· · ·`

## Global behaviour

- **Focus**: `src/index.css` gives every `:focus-visible` element a 3px
  `#1d4ed8` outline (offset 3px on links and buttons, 2px on fields). Mouse
  focus shows no outline. Components override it only when the ring needs a
  different shape (`PostList` rows). Focus moved to section headings by
  in-page navigation (`[data-section-focus]`) and `#main-content` shows no
  outline.
- **Tap targets**: `button, a, input, textarea, select` have
  `min-height: 44px`. Only buttons also get `min-width: 44px`, so short text
  links ("Blog") keep natural spacing. Icon-only links size themselves to 44px.
  Inline links inside text are unaffected because `min-height` does not apply
  to inline boxes.
- **Scrollbars**: thin with an accent thumb on desktop, hidden at 768px and
  below (scrolling still works).
- **Background**: `body` paints a faint 80px engineering-paper grid
  (`background-attachment: fixed`).
- **Selection**: accent background, white text.

## Motion

- Variants live in
  [`src/constants/motionVariants.js`](../src/constants/motionVariants.js):
  - `containerVariants` staggers children by 0.06s
  - `itemVariants` fades in and rises 14px over 0.4s on `--ease-out`
- The app is wrapped in `<MotionConfig reducedMotion="user">`. With reduced
  motion, Framer drops transforms but keeps opacity fades. Browser tests that
  check visibility therefore wait for opacity to settle.
- The CSS reduced-motion block sets `transition-duration` and
  `transition-delay` to `0s` and shortens animations to one 0.01ms run. A
  non-zero transition duration there would turn every property of every
  element into a one-frame transition, because the initial
  `transition-property` is `all`. That leaves stale layout for a frame after
  breakpoint changes.
- The navigation pill's frosted blur is on a `::before` pseudo-element.
  `backdrop-filter` on the `nav` itself would become the containing block for
  the fixed mobile drawer and clip it.
- The mobile drawer hides with `visibility 0s linear 0.35s` (after the slide
  out) and shows with no delay, so its first link can take focus in the same
  frame it opens.

## Extending

1. Reach for a token before a literal. If a new colour is needed, add a
   semantic token in `:root`, check contrast on all three backgrounds and list
   it above.
2. Build pages from `PageLayout` + `PageHeader`, actions from `Button`,
   `ButtonLink` and `TextLink`, and homepage sections from `SectionHeader`.
3. Animate only `transform` and `opacity`. Use Framer `whileHover` for lifts
   on motion elements, and keep durations within the motion tokens.
4. Run `npm run check`. The axe scans and layout contracts in `e2e/` catch
   contrast, overflow and alignment regressions.
