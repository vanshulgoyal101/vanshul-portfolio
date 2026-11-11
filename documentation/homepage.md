# Homepage and Navigation

The homepage presents the introduction, selected projects, biography, employment,
writings, and contact section in that order. Featured projects have native
`details` case studies. The wider project directory sits below them in a native
`details` disclosure, collapsed by default. Its summary pairs
"More things I've built" with a rotating chevron.
The open directory is grouped by category in compact two-column rows (one column on mobile). It retains
every secondary project's name, full description, and live/source links without
adding screenshots or raised cards. Technology badges and status labels are
omitted from the compact rows; icon links have descriptive accessible names,
hover titles, and 44px targets. The summary has a visible keyboard focus ring;
Enter and Space toggle it, and closed project links leave the tab order. This
collapsed default supersedes the earlier always-visible design preference.
Case-study text should describe supported project facts, not inferred customer
results or invented metrics.

Of the two standalone MCP servers, only `ctx` is listed (in "Live products &
tools"); it was chosen as the stronger of the two. `vbrain`, in "Open source &
packages", also exposes an MCP server as part of its second-brain engine. The
other standalone server, `mcp` (https://mcp.vanshul.com, source
`vanshulgoyal101/mcp`, "reads the live web as clean Markdown for AI agents"),
was live when checked on 9 November 2026; restore it by adding an entry to the
"Live products & tools" group in `src/constants/projects.js`.

## Navigation contract

Hero buttons and social links center at widths up to and including 768px and
align with the heading's left edge above that breakpoint. Buttons stack below
481px. Browser tests measure the actual control positions at 390, 600, 768, 769,
1024, and 1440px rather than relying only on CSS declarations.

The floating rocket's flame and local puffs share a zero-size exhaust anchor
inside the rotating icon. Its position (`left: 25.5859375%`,
`top: 74.4140625%`, i.e. 131/512 and 381/512) corresponds to the rear
midpoint of the Font Awesome rocket's 512-unit viewBox. The canvas receives the
anchor's transformed viewport coordinates, not the button's bounding box.
Changing the rocket icon requires rechecking this anchor. Browser tests compare
emissions with the SVG nozzle during launch on desktop and mobile and preserve
the repeated launch, colored smoke, reduced-motion, and About-navigation tests.

`App.jsx` owns the unique home section IDs. Inner section components must not
repeat them. Navigation links use `/#section` URLs, preserve modified clicks,
and let the shared hash handler position and focus the destination heading.
The scroll helper accounts for positioned ancestors and the fixed header's
viewport bottom. Reduced-motion users receive immediate scrolling.

The scroll helper focuses the first `h1` or `h2`, falling back to the section
only when it has no heading. Home must focus its name, not the full-height wrapper.
Programmatically focused headings and non-interactive section fallbacks receive
`data-section-focus`, which suppresses their decorative focus rectangle without
removing the focus handoff. The skip-link destination `#main-content` also avoids
a page-sized outline while remaining focusable.
Interactive controls retain their keyboard outlines.

Section titles come from `SectionHeader`. The mono `NN / label` eyebrow is an
`aria-hidden` span inside the h2, not a sibling above it. Hash navigation
places the h2 16–24px below the header, so an eyebrow above the heading would
be hidden behind the header. Inside the h2 it stays visible, and the
accessible name is still just the title. The lede is the h2's next sibling
(`h2 + p`) and is centred at every size. All five section titles (Projects,
About, Work, Writings, Contact) use `--text-section-title`: 40px on desktop and
32px through 768px. The browser test asserts they are equal, Work included.

The closed mobile menu is inert. Opening it focuses the first link, wraps Tab
within its controls, and locks body scrolling. Escape closes it and restores
toggle focus. Returning to desktop clears the mobile scroll lock. The drawer
becomes visible with no delay and hides only after its 0.35s slide-out. If
`visibility` animated on open, the first frame would still be hidden and the
focus call would silently fail.

The active navigation item follows scroll-spy only on `/`. "Blog" stays
active on `/blog*` and `/reading-list/`, and no item is active on other routes
(such as the 404). The desktop header is a floating pill with its blur on a
`::before` layer: `backdrop-filter` on the `nav` would become the containing
block of the fixed drawer and clip it.

## Content and motion

Work Experience uses a 40px desktop heading and a 32px heading through 768px.
Its supporting typography has a separate, fixed responsive hierarchy:
job titles are 20px desktop / 18px mobile, company names 16px, the section
lede 18px desktop / 16px mobile (`--text-lede`), descriptions 16px, and
date/location metadata 14px. The compact "Earlier" list below the cards reuses
that scale (16px role line and summary, 14px dates) and uses no h3/h4, so the
test's two role and company headings stay the full cards. Sizes are rem
based and respect browser text preferences. Do not let fluid card-title tokens
grow to match the mobile section heading. The browser regression checks heading
order and text containment at 320, 390, 600, 768, 769 and 1440px, with a minimum
1.75 section-heading-to-job-title size ratio.
Mobile descriptions use 1.6 line-height (desktop stays at 1.8), with 12px gaps
below card headers and descriptions and a smaller gap before the first card.

The left-aligned desktop introduction, navbar logo, and featured cards share the
same 1280px container and responsive gutter. On mobile, the introduction centers
its copy, actions, and social links to avoid a lopsided narrow layout. The
Featured Projects heading and subtitle are centered at every size, matching the
sections below. Selected work starts in the first viewport at the tested desktop
and mobile sizes after the intro.

The original multilingual greeting runs once per app load: eight shuffled
greetings at 220ms intervals, then Welcome and a 500ms fade. Internal navigation
does not replay it. The underlying app is inert and body scrolling is locked
until completion; hash navigation waits until the overlay is gone. Reduced-motion
visitors bypass the sequence. All greeting and exit timers are cleaned up.

The unframed hero sculpture loads after the greeting and browser idle only above
1024px and without reduced motion. Its reserved area avoids layout
shifts while loading, and its own error boundary keeps failures from replacing
the introduction. Mobile and reduced-motion visits do not request the scene or
Three.js chunks. Media-query changes unmount the scene when it is no longer allowed.
Animation pauses off-screen and while the document is hidden; the texture is
disposed on unmount. Rotation and floating motion are restrained, with no particles.

Separate ambient decorations default to enabled and retain idle loading. The
footer switch persists an explicit choice in `vg.ambient`; reduced motion always
disables them. That setting does not control the desktop hero.
Lazy routes, the dashboard included, show a "Loading page..." state and share a
route error boundary (see [components.md](components.md)).

The floating rocket and `SmokeTransition` load together inside the idle ambient
boundary. On desktop the rocket remains fixed in the lower-right corner; on
mobile it uses a smaller fixed lower-right placement inside the safe area so it
stays visible without pushing content or overlapping navigation. The heavy 3D
hero scene remains desktop-only. Keep the smoke listener mounted with the rocket:
`rocket-launch`
starts the original pooled cyan/magenta/violet/grey trail, and
`rocket-emit-smoke` follows the moving nozzle. The original three-tap countdown,
0.2s shake, 1s takeoff, color-to-background blending, and reset are preserved.
After 550ms the transition uses the shared scroll helper to focus About below
the header. Do not disconnect the smoke listener when changing ambient loading.

The nozzle geometry browser test uses a controlled clock. After the intro it
advances time until the idle-loaded rocket is visible, allowing idle callbacks,
lazy imports and React commits to finish before activation. A fixed startup
advance alone can leave the deferred subtree unmounted while the clock is paused.
The test retains its emission sample count and 0.1 CSS pixel alignment tolerance;
separate real-time browser tests cover repeated launches and colored smoke.

The footer ends every route (home, archive, articles, shelf, 404 and the
private dashboard), not only the homepage. It separates identity and navigation from a collapsed
`Display settings` disclosure. Opening it scrolls the expanded settings into view without changing
focus. Cursor and ambient preferences use labelled switches. The cursor defaults
on for mouse devices without browser or hardware heuristics; saved `vg.cursor`
choices are preserved. Its control is omitted on touch devices, and both switches
are disabled under reduced motion. The footer stacks at narrow widths and keeps
navigation visible even when preferences are closed.

## Project media

`node scripts/capture-projects.mjs` refreshes the AdBrain and Tiny Arcade images
from their public pages. AdBrain's title and image fallback use the local
`public/images/projects/adbrain-icon.svg` copy of its canonical generated mark;
do not substitute a generic advertising icon. The obsolete authored AdBrain
card generator was removed so screenshot capture remains the owning workflow.

The capture script uses Chromium and Sharp. Install Chromium with
`npx playwright install chromium` first. Review generated images before committing;
pass a project name, for example `node scripts/capture-projects.mjs adbrain`, to
refresh one product without changing another's artwork. Screenshots themselves
can contain old branding even when the surrounding title icon is correct;
inspect the actual image after an identity release.
Version the project image URL when replacing a public screenshot; GitHub Pages
can retain the previous bytes at an unchanged CDN URL after a successful deploy.
Never capture authenticated customer data. AdBrain currently shows its public
landing page, not the authenticated creative workspace. The NASA photograph is
preserved. Image frames use an 8:5 aspect ratio. Images are absolutely
positioned inside the frame with `object-fit: cover` and a bottom-center anchor:
the software captures stay essentially complete (Tiny Arcade is exactly
1280×800; the 1265×800 AdBrain capture loses under 1% at the top), while the 4:3
HERC photo loses excess sky instead of the rover at the bottom. Images do not
zoom on hover. The hairline between image and text is the content block's top
border. A border on the frame would shrink the absolutely positioned image by
1px. Browser tests compare image/frame rectangles (within 1px) and frame heights
on desktop and mobile.

See [testing.md](testing.md) for production browser checks and their limits.