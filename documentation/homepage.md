# Homepage and Navigation

The homepage presents the introduction, selected projects, biography, employment,
writings, and contact section in that order. Featured projects have native
`details` case studies. The wider project directory is always visible below them,
grouped by category in compact two-column rows (one column on mobile). It retains
every secondary project's name, full description, and live/source links without
adding screenshots or raised cards. Technology badges and status labels are
omitted from the compact rows; icon links have descriptive accessible names,
hover titles, and 44px targets. Do not hide the directory behind a disclosure.
Case-study text should describe supported project facts, not inferred customer
results or invented metrics.

## Navigation contract

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

The left-aligned introduction, navbar logo, Projects heading, and featured cards
share the same 1280px container and responsive gutter. Selected work starts in
the first viewport at the tested desktop and mobile sizes.

There is no blocking greeting sequence. The unframed hero sculpture loads after
idle only above 1024px and without reduced motion. Its reserved area avoids layout
shifts while loading, and its own error boundary keeps failures from replacing
the introduction. Mobile and reduced-motion visits do not request the scene or
Three.js chunks. Media-query changes unmount the scene when it is no longer allowed.
Animation pauses off-screen and while the document is hidden; the texture is
disposed on unmount. Rotation and floating motion are restrained, with no particles.

Separate ambient decorations default to enabled and retain idle loading. The
footer switch persists an explicit choice in `vg.ambient`; reduced motion always
disables them. That setting does not control the desktop hero.
Lazy routes show a loading state and share an error boundary.

The footer separates identity and navigation from a collapsed `Display settings`
disclosure. Opening it scrolls the expanded settings into view without changing
focus. Cursor and ambient preferences use labelled switches. The cursor defaults
on for mouse devices without browser or hardware heuristics; saved `vg.cursor`
choices are preserved. Its control is omitted on touch devices, and both switches
are disabled under reduced motion. The footer stacks at narrow widths and keeps
navigation visible even when preferences are closed.

## Project media

`node scripts/capture-projects.mjs` refreshes the AdBrain and Tiny Arcade images
from their public pages using Chromium and Sharp. Install Chromium with
`npx playwright install chromium` first. Review generated images before committing;
never capture authenticated customer data. AdBrain currently shows its public
landing page, not the authenticated creative workspace. The NASA photograph is
preserved. Image frames use an 8:5 aspect ratio. Images are absolutely positioned
inside the frame with `object-fit: cover` and a bottom-center anchor: the 8:5
software captures remain complete, while the 4:3 HERC photo loses excess sky
instead of the rover at the bottom. Images do not zoom on hover. Browser tests
compare image/frame rectangles and frame heights on desktop and mobile.

See [testing.md](testing.md) for production browser checks and their limits.