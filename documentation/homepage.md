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

## Navigation contract

Hero buttons and social links center at widths up to and including 768px and
align with the heading's left edge above that breakpoint. Buttons stack below
481px. Browser tests measure the actual control positions at 390, 600, 768, 769,
1024, and 1440px rather than relying only on CSS declarations.

The floating rocket's flame and local puffs share a zero-size exhaust anchor
inside the rotating icon. Its position (25.5%, 74.5%) corresponds to the rear
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
Interactive controls retain their keyboard outlines. Projects uses the same
responsive heading-size tokens as About, Work, and Writings; browser tests
compare their computed font sizes.

The closed mobile menu is inert. Opening it focuses the first link, wraps Tab
within its controls, and locks body scrolling. Escape closes it and restores
toggle focus. Returning to desktop clears the mobile scroll lock.

## Content and motion

Work Experience uses a 40px desktop heading and a 32px heading through 768px;
the larger mobile heading distinguishes the section from its employment cards.
Other sections retain their existing heading sizes. Supporting typography uses
20px desktop / 18px mobile job titles, 16px company names, subtitle and
descriptions, and 14px date/location metadata. Sizes are rem
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
The same boot state sets the application wrapper opacity to zero until completion.
`inert` alone does not hide content: loaded project images could otherwise appear
through the loader's fading/scaling exit. Keeping the page mounted preserves image
loading and layout without exposing it early. Desktop/mobile regressions sample
frames with loaded images on initial navigation and reload, then assert the page
is fully visible and its deep-link heading is focused after completion.

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
Lazy routes show a loading state and share an error boundary.

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

The footer separates identity and navigation from a collapsed `Display settings`
disclosure. Opening it scrolls the expanded settings into view without changing
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
never capture authenticated customer data. AdBrain currently shows its public
landing page, not the authenticated creative workspace. The NASA photograph is
preserved. Image frames use an 8:5 aspect ratio. Images are absolutely positioned
inside the frame with `object-fit: cover` and a bottom-center anchor: the 8:5
software captures remain complete, while the 4:3 HERC photo loses excess sky
instead of the rover at the bottom. Images do not zoom on hover. Browser tests
compare image/frame rectangles and frame heights on desktop and mobile.

See [testing.md](testing.md) for production browser checks and their limits.