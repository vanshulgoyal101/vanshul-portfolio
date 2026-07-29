# Testing

The project uses **Vitest** with **React Testing Library** and a **jsdom**
environment. Configuration lives in `vite.config.js` (the `test` block); global
setup lives in [`src/test/setup.js`](../src/test/setup.js).

## Running tests

```bash
npm test               # run once
npm run test:watch     # watch mode
npm run test:ui        # Vitest UI
npm run test:coverage  # coverage report (text + html in coverage/)
```

`coverage/` is git-ignored and excluded from linting.

## Layout & conventions

- Tests are colocated with the code they cover, named `*.test.js` / `*.test.jsx`.
- Pure functions and hooks are tested directly; components are rendered with
  Testing Library and asserted via accessible queries where practical.
- `globals: true` means `describe`/`it`/`expect`/`vi` are available without
  imports (they are still imported explicitly in most files for clarity). The
  ESLint test override provides the matching globals.

## Global setup (`src/test/setup.js`)

- Registers `@testing-library/jest-dom` matchers and runs `cleanup()` after each
  test.
- **Mocks `framer-motion`** globally: `motion.*` render as plain DOM elements and
  `AnimatePresence` renders children immediately. This removes animation timing
  from tests (real exit animations otherwise keep nodes mounted and make removal
  assertions flaky). Real hooks such as `useScroll`/`useSpring` are preserved via
  `importOriginal`.
- Stubs browser APIs jsdom lacks: `matchMedia`, `IntersectionObserver`,
  `ResizeObserver`, `Element.scrollIntoView`, and `window.scrollTo`.

## Useful gotcha

Because `css: true` lets jsdom apply styled-components styles, an element that is
`display: none` at the current viewport (e.g. the mobile menu button on desktop)
can compute an **empty accessible name**, so `getByRole('button', { name })`
won't find it. Query such elements by attribute instead:

```javascript
container.querySelector('button[aria-label="Toggle mobile menu"]');
```

## What is covered

| Area | File |
| ---- | ---- |
| Blog sorting util | `src/utils/blogUtils.test.js` |
| Blog loader / frontmatter | `src/utils/blogLoader.test.js` |
| Blog content integrity (unique ids/slugs, valid dates) | `src/blogs/blogContent.test.js` |
| Contact form hook | `src/hooks/useContactForm.test.jsx` |
| Toast provider/context | `src/components/Toast/ToastProvider.test.jsx` |
| Blog UI (section, card, modal) | `src/components/Blog/*.test.jsx` |
| Navigation | `src/components/Navigation/Navigation.test.jsx` |
| Error boundary | `src/components/ErrorBoundary.test.jsx` |
| Magnetic wrapper | `src/components/FunElements/Magnetic.test.jsx` |
| Blog constants | `src/constants/blogConstants.test.js` |

Heavy 3D/canvas components (Hero, `HeroCanvas`, `InteractiveSpaceBackground`,
etc.) are intentionally not deep-tested — they render WebGL and contain little
testable logic.

## Adding tests

1. Create `*.test.jsx` next to the module.
2. For components that need routing, wrap them in `<MemoryRouter>`; for anything
   using toasts, wrap in `<ToastProvider>`.
3. Prefer accessible queries (`getByRole`, `getByText`, `getByLabelText`); fall
   back to attribute queries only when necessary (see the gotcha above).
