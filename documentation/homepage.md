# Homepage and Navigation

The homepage presents the introduction, selected projects, biography, employment,
writings, and contact section in that order. Featured projects have native
`details` case studies; the wider project directory is a separate disclosure.
Case-study text should describe supported project facts, not inferred customer
results or invented metrics.

## Navigation contract

`App.jsx` owns the unique home section IDs. Inner section components must not
repeat them. Navigation links use `/#section` URLs, preserve modified clicks,
and let the shared hash handler position and focus the destination heading.
The scroll helper accounts for positioned ancestors and the fixed header's
viewport bottom. Reduced-motion users receive immediate scrolling.

The closed mobile menu is inert. Opening it focuses the first link, wraps Tab
within its controls, and locks body scrolling. Escape closes it and restores
toggle focus. Returning to desktop clears the mobile scroll lock.

## Content and motion

There is no blocking greeting sequence or automatically mounted HeroScene.
Ambient decorations are opt-in through the footer checkbox and disabled for
reduced motion. Lazy routes show a loading state and share an error boundary.

## Project media

`node scripts/capture-projects.mjs` refreshes the AdBrain and Tiny Arcade images
from their public pages using Chromium and Sharp. Install Chromium with
`npx playwright install chromium` first. Review generated images before committing;
never capture authenticated customer data. AdBrain currently shows its public
landing page, not the authenticated creative workspace. The NASA photograph is
preserved. Image frames use an 8:5 aspect ratio to avoid cropping the captures.

See [testing.md](testing.md) for production browser checks and their limits.