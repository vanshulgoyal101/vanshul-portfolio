# Vanshul Portfolio — Documentation

In-depth documentation for the codebase. Each document is self-contained and
focused on a single topic. Start with **architecture.md** for the big picture,
then dive into specific areas.

## Index

| Document | Contents |
| -------- | -------- |
| [architecture.md](architecture.md) | Project structure, routing, SPA/GitHub Pages setup, state management, data flow, tech stack, performance strategy. |
| [components.md](components.md) | Every React component: sections, Blog system, Toast, Skeleton loaders, Navigation, Contact, ErrorBoundary, FunElements. |
| [hooks.md](hooks.md) | Custom hooks (`useContactForm`, `useIdle`), the `useToast` context hook, and the react-router hooks used in navigation. |
| [data.md](data.md) | The markdown blog system: frontmatter schema, loading/parsing, sorting, and how to add posts. |
| [styles.md](styles.md) | Design system: tokens, typography, colour, animation patterns, responsive breakpoints, styled-components usage. |
| [assets.md](assets.md) | Images, public assets, and file organisation. |
| [testing.md](testing.md) | Vitest + React Testing Library setup, conventions, mocks, and how to run/extend tests. |
| [config.md](config.md) | `package.json`, `vite.config.js`, `eslint.config.js`, `Makefile`, and SEO/hosting files. |
| [deployment.md](deployment.md) | GitHub Pages deployment, the SPA routing workaround, build process, and troubleshooting. |
| [accessibility.md](accessibility.md) | WCAG 2.1 AA practices: keyboard navigation, focus management, touch targets, contrast, ARIA. |

## Maintenance

Keep these documents in sync with the code. Update them when you:

- add or restructure components, routes, or hooks,
- change the build, test, or deployment pipeline,
- add or remove dependencies,
- change the blog frontmatter schema or design tokens.
