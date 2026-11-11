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

Fonts are self-hosted variable fonts from Fontsource 5.3.0 in
[`public/fonts/`](../public/fonts), next to their SIL OFL 1.1 licences: Inter
(body, weights 100–900), Space Grotesk (headings, 300–700) and JetBrains Mono
(labels, 100–800). [`src/index.css`](../src/index.css) declares a latin and a
latin-ext `@font-face` per family with `unicode-range`, so the latin-ext file
downloads only when a page uses one of its characters, and `font-display: swap`
avoids invisible text. [`index.html`](../index.html) preloads the latin Inter
and Space Grotesk files, so the above-the-fold faces download alongside the
document instead of after the stylesheet. Nothing is requested from a third
party. To update a font, copy the `*-latin-wght-normal.woff2` and
`*-latin-ext-wght-normal.woff2` files and the licence from the package's
`files/` folder and keep the `unicode-range` values in step with its CSS.

## Visual language

- **Paper, ink, one accent.** A warm paper page (`#f6f3eb`), near-black ink
  headings, slate body text and a single blue accent (`#1d4ed8`) for links,
  labels and focus. The redesign removed gradient text, gradient buttons and
  their tokens.
- **Hairlines over shadows.** Surfaces are separated by 1px hairlines. Cards
  rest on `--shadow-sm` and take `--shadow-md` on hover; only the contact form
  card, the About photo, the shelf banner and toasts carry `--shadow-md` at
  rest. Strong 1px ink rules divide major groups: archive years, shelf
  collections and "More writings".
- **Mono eyebrows.** Small uppercase JetBrains Mono labels sit above titles
  (`01 / Selected work`, `Archive · 8 posts`) and carry metadata (dates, read
  times, tech chips).
- **Display headings.** Space Grotesk for headings, Inter for text,
  `text-wrap: balance` on headings and `pretty` on paragraphs.
- **Short, small motion.** Most reveals fade in while travelling 12–16px over
  0.4s (14px in the shared variants). Hover nudges move 2–6px over the
  160–240ms duration tokens, and cards lift 4px. Movement uses only
  `transform` and `opacity`; colours, borders and shadows change with short
  transitions, mostly on the duration tokens.

## Tokens

All tokens are defined in `:root` in `GlobalStyles.js`.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg-primary` | `#f6f3eb` | Page background, contact-form fields, Work tech chips |
| `--color-bg-secondary` | `#f6f3eb` | Footer switch track (same value as the page) |
| `--color-bg-tertiary` | `#edeae0` | Subtle fills: image frames, Work icon tiles, avatar placeholders, inline code |
| `--color-bg-card` | `#ffffff` | Cards and panels |
| `--color-ink` | `#0f172a` | Headings, primary buttons, the shelf banner |
| `--color-text-primary` | `#1e293b` | Article body, strong text |
| `--color-text-secondary` | `#475569` | Paragraphs and ledes (default `p` colour) |
| `--color-text-muted` | `#5b6677` | Metadata and labels |
| `--color-accent-primary` | `#1d4ed8` | Links, eyebrows, focus ring, list markers |
| `--color-accent-secondary` | `#3b82f6` | Decorative only: scroll-ring gradient, background glow, boot loader |
| `--color-accent-soft` | `rgba(29, 78, 216, 0.07)` | Tinted fills (hero dot halo, form-field focus halo) |
| `--color-accent-line` | `rgba(29, 78, 216, 0.24)` | Resting underline of prose links; hover border of project, post and work cards |
| `--color-border` / `--color-border-hover` | slate at 8% / 15% | Card and field borders / form-field hover border |
| `--color-hairline` | `rgba(15, 23, 42, 0.12)` | Separators, secondary buttons, pills |
| `--color-success` / `--color-danger` | `#166534` / `#b91c1c` | Status tones: toasts, dashboard deltas and notices, form errors |

Contrast, measured on white, the page and tertiary backgrounds:

- secondary text: 7.58 / 6.83 / 6.30
- muted text: 5.81 / 5.24 / 4.83
- accent on the page: 6.04

Muted was `#94a3b8` (2.56:1) until browser accessibility scans caught it. Any
replacement must stay at or above 4.5:1 on all three backgrounds. Form errors
use `--color-danger` (`#b91c1c`), because the earlier `#ef4444` failed AA on
the page. Both status tones stay at or above 5.3:1 on white, the page, the
tertiary background and a 10% tint of themselves (the dashboard's delta
chips); `#15803d`, the earlier success green, fell to 4.39:1 on its chip. Light text
on the ink shelf banner is at least 6.7:1.

### Shape, depth and motion

| Token | Value |
| --- | --- |
| `--radius-sm` / `-md` / `-lg` / `-pill` | 8px / 12px / 18px / 999px |
| `--shadow-sm` | `0 1px 2px rgba(15, 23, 42, 0.05)` |
| `--shadow-md` | `0 18px 40px -24px rgba(15, 23, 42, 0.35)` (card hover; resting depth of the contact form, About photo, shelf banner and toasts) |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--duration-fast` / `-base` | 160ms / 240ms |

### Spacing and layout

- `--spacing-xs` … `--spacing-2xl`: fluid `clamp()` steps from 4px to 128px.
- `--container-padding`: `clamp(1rem, 5vw, 3rem)`, the page gutter everywhere.
- `--container-xl` (1280px) bounds homepage sections and the navigation.
  `--container-lg` (1024px) is the `PageLayout` "wide" width (see below).
- `--header-offset` on `html` (`clamp(5rem, 8vw, 7rem)`) is the
  `scroll-padding-top`, so native anchor jumps clear the fixed header.
  `Navigation` overwrites it at runtime with the nav's bottom edge plus 20px.
- About, Work, Writings and Contact pad `clamp(3.5rem, 7vw, 6rem)` top and
  bottom. Projects pads 2rem on top (1rem at 768px and below) and the same
  clamp below.
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
- Long-form articles: 18px on a 1.8 line-height (17px on 1.75 at 768px and
  below) in `--color-text-primary`, on a ~70 character measure (see
  `PageLayout`).

Responsive breakpoints are plain media queries; CSS variables cannot be used in
them. The `max-width` values in use are 1024px (hero scene, two-column grids),
900px, 768px (the main mobile switch), 640px, 600px and 480px. Their
counterparts are `min-width: 769px` (desktop navigation links) and the hero's
`matchMedia('(min-width: 1025px)')` scene gate.

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

- **Cards** (projects, homepage posts, work timeline, contact form): white, a
  1px `--color-border` border and `--radius-lg`. Project and post cards lift
  4px on hover; work cards only change border and shadow; the contact card
  does not react. Hover lifts use Framer Motion `whileHover={{ y: -4 }}`,
  never CSS `:hover` transforms, because Framer's inline transform would
  override them.
- **Editorial lists** (`Blog/PostList` in the archive and "More writings"; the
  shelf's essay list):
  - rows are separated by hairlines with an h3 title
  - `PostList` adds a mono date column and stretches the title link over the
    row with `::after`, so the whole row is clickable while the link's name
    stays the title alone
  - its focus ring is drawn on that `::after`, around the row
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
  focus shows no outline. Many components restate the 3px ring with their own
  offset (2px to 4px, or -3px inside the 44px directory icon links).
  `PostList` draws it around the whole row. Focus moved to section headings by in-page navigation
  (`[data-section-focus]`) and `#main-content` shows no outline.
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
