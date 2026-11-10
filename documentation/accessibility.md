# Accessibility

The target is WCAG 2.1 AA. Automated axe scans and keyboard and layout
browser tests enforce it on every route. This file records what the site
does and which test protects it. Keep both in step when behaviour changes.

## Automated checks

| Check | Where | What it asserts |
| --- | --- | --- |
| axe (`wcag2a`, `wcag2aa`, `wcag21aa`) | `e2e/accessibility.spec.js` | Zero violations on `/`, `/blog/`, an article, `/reading-list/`, a 404 and `/dashboard/`, on desktop and mobile. The project directory and footer settings are opened first. Each scan waits until no element's opacity changes, because contrast measured mid-fade is meaningless. |
| Owner dashboard | `e2e/accessibility.spec.js` | Same axe tags with data loaded. The year chart is a focusable, keyboard-scrollable region. |
| Keyboard and focus contracts | `e2e/portfolio.spec.js`, `e2e/shelf.spec.js`, `e2e/article.spec.js` | Mobile menu focus handling; hash and skip-link focus without page-sized outlines; headings clear of the fixed header; 44px targets in the project directory and essay list; no horizontal overflow at 320px. |
| Unit checks | `src/**/*.test.jsx` | Landmarks (one `main` per page), heading levels, accessible names, form error wiring, toast live region. |

Manual spot checks for releases: tab through every route, test with VoiceOver
(`Cmd+F5`) using heading and landmark navigation, and zoom to 200%.

## Document structure

- `<html lang="en">`. The viewport meta allows pinch zoom: there is no
  `maximum-scale` and no `user-scalable=no`.
- **Landmarks**: the header `nav` is labelled "Primary navigation" and each
  page has exactly one `main`. The homepage's comes from `App`; subpages get
  theirs from `PageLayout`, the dashboard included. The footer
  (`contentinfo`) contains a "Footer links" nav. Named regions include "More
  things I've built", "More writing", and the Books and Essays collections.
- **Headings**: one `h1` per page (the name on the homepage; the page or
  article title elsewhere). Then `h2` for sections (homepage sections, archive
  years, article sections, "More writing") and `h3` for items. Section
  eyebrows inside homepage `h2`s are `aria-hidden`, so a heading's name is just
  its title. Toast titles are paragraphs, not headings, so notifications never
  change the outline.
- **Lists**: timelines, post lists, the shelf and stat tiles are real
  `ol`/`ul` elements. Contact facts are a `dl`.
- **Lazy routes**: while a page chunk loads, the fallback is a `role="status"`
  "Loading page..." message. Once loaded, the dashboard shows a `role="status"` "Loading…" while
  it restores the session. A page that fails to load becomes `RouteError`,
  which keeps the navigation and one `h1`.

## Keyboard and focus

- **Skip link**: "Skip to content" is the first tab stop. It slides into view
  on focus and targets `#main-content` (`tabindex="-1"`).
- **Focus ring**: `src/index.css` gives every `:focus-visible` element a 3px
  `#1d4ed8` outline (6.04:1 on the page). The offset is 3px on links and
  buttons and 2px on fields, and mouse focus shows none. Several components
  restate the ring with a different offset. `PostList` rows redraw the ring
  around the whole row, because their title link stretches over it.
- **In-page navigation**: `/#section` links and the hash handler scroll the
  section's `h1`/`h2` below the fixed header and move focus to it. Focused
  headings, section fallbacks and `#main-content` carry `data-section-focus`
  or are matched by the skip-link rule, so they never draw a page-sized
  outline. Reduced-motion visitors scroll instantly.
- **Mobile menu** (768px and below):
  - the closed drawer is `inert`
  - opening it focuses the first link, wraps Tab and Shift+Tab within the
    drawer and toggle, and locks body scroll
  - Escape closes it and returns focus to the toggle
  - the drawer is visible from the first frame, so that focus call cannot fail
- **Disclosures** are native `details`/`summary` (case studies, the project
  directory, Display settings), so Enter and Space work without scripting.
  Case-study summaries are named "Read case study: ⟨project⟩".
- **Boot greeting**: the app behind it is `inert` and cannot scroll. The
  overlay is a `role="status"` whose rotating greetings are `aria-hidden`.
  Reduced motion skips the sequence entirely.

## Forms (Contact)

- Every field has a visible `<label for>`, and every field is `required`.
- The form sets `noValidate`, so the site's own messages replace browser
  bubbles. On a failed submit:
  - focus moves to the first invalid field
  - invalid fields get `aria-invalid="true"`
  - each message is linked through `aria-describedby`, so it is read with its
    field
  - a "Missing details" toast is announced
- The email format is checked live as you type; empty fields are flagged only
  on submit.
- Error text is `--color-danger` (`#b91c1c`, at least 4.5:1 on white and the
  input background);
  `#ef4444` failed AA. The submit button disables and reads "Sending..."
  during a request, and double submits are ignored.

## Status messages

Toasts render inside an always-mounted `aria-live="polite"` container. Contact
results, "Missing details" and "Link copied" are therefore announced without
moving focus (WCAG 4.1.3). Each toast has a 44px "Close notification" button;
toasts auto-dismiss after five seconds. Tone colours (`--color-success`
`#166534`, `--color-danger` `#b91c1c`, info accent) meet 4.5:1 on white. The
dashboard's delta chips use the same tones on 10% tints of themselves (6.12:1
and 5.46:1).

## Colour and contrast

Tokens are in `src/styles/GlobalStyles.js` (see [styles.md](styles.md#colour)).

- Body text `#475569` measures 7.58 / 6.83 / 6.30 on white, the page and
  tertiary backgrounds. Muted metadata `#5b6677` measures 5.81 / 5.24 / 4.83.
  The accent `#1d4ed8` measures 6.04 on the page.
- `--color-text-muted` replaced `#94a3b8` (2.56:1) after axe caught it.
  Any new text colour must clear 4.5:1 on all three backgrounds.
- Light text on the ink shelf banner is at least 6.7:1.
- Meaning never relies on colour alone: errors have text, the active nav item
  has an underline as well as colour, and links in prose are underlined.

## Touch targets

- `button, a, input, textarea, select` are at least 44px tall, and buttons are
  at least 44px wide (`GlobalStyles.js`). Inline links in running text are
  exempt by CSS: `min-height` does not apply to inline boxes.
- Icon-only links are 44px circles or squares and have `aria-label`s: hero and
  contact socials, project directory icons (each also has a `title`) and the
  menu toggle.
- The article's "On this page" links keep 44px rows on touch and shrink to
  36px rows for a fine pointer, still above the 24px WCAG 2.5.8 minimum.

## Images and icons

- Content images have descriptive `alt` text from the data modules (project
  titles, `PROFILE.photoAlt`). Decorative images use `alt=""`. That includes
  the byline and author-card avatars, which sit next to the visible name.
- Icons next to text are `aria-hidden`. Icon-only controls carry the name.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Motion

- `<MotionConfig reducedMotion="user">` makes Framer Motion drop transforms
  under `prefers-reduced-motion` and keep opacity fades.
- CSS (`GlobalStyles.js`) disables transitions with a true `0s` duration and
  delay, and shortens keyframe animations to a single 0.01ms run. A tiny
  non-zero transition duration would make every property of every element
  transition for a stale frame, because the initial `transition-property` is
  `all`. No code depends on `transitionend`.
- Decorative layers are never needed for a task and do not load under
  reduced motion. They are the starfield, smoke, telemetry glyphs, custom
  cursor and 3D hero sculpture. The smoke canvas, the hero scene area and the
  telemetry overlay (text glyphs such as π, Σ and `{ }`) are `aria-hidden`;
  the starfield canvas and the cursor carry no content.
- The footer's Display settings switches turn off the ambient layer
  (starfield, smoke, telemetry and rocket; stored in `vg.ambient`) and the
  custom cursor (`vg.cursor`). The desktop-only hero sculpture is not
  affected by either switch.
- `Magnetic` and the custom cursor turn off for reduced motion and for coarse
  pointers. The Display settings switches (`role="switch"`) are disabled while
  reduced motion is on.
- The floating rocket is a real button labelled "Launch rocket: N taps
  remaining". Its launch moves focus to About, using the same helper as
  in-page navigation.

## Checklist for new UI

1. Use semantic elements first: a real `button`, `a`, list, `details`. Add
   ARIA only to name or describe.
2. Give the page one `h1` and nest headings without skipping levels. Use
   `PageLayout` so the page has its `main`.
3. Keep text at 4.5:1 or above on white, `#f6f3eb` and `#edeae0`.
4. Keep targets 44px tall, and give icon-only controls an accessible name.
5. Animate `transform`/`opacity` only, and make sure the UI works with
   reduced motion.
6. Add the route to the axe loop in `e2e/accessibility.spec.js`, and run
   `npm run check`.
