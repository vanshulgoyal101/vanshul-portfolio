// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color palette: warm paper background, slate text, one blue accent */
    --color-bg-primary: #f6f3eb;
    --color-bg-secondary: #f6f3eb;
    --color-bg-tertiary: #edeae0;
    --color-bg-card: #ffffff;

    --color-ink: #0f172a;
    --color-text-primary: #1e293b;
    --color-text-secondary: #475569;
    /* At least 4.5:1 on white, --color-bg-primary and --color-bg-tertiary (WCAG AA). */
    --color-text-muted: #5b6677;

    --color-accent-primary: #1d4ed8;
    --color-accent-secondary: #3b82f6;
    --color-accent-soft: rgba(29, 78, 216, 0.07);
    --color-accent-line: rgba(29, 78, 216, 0.24);

    --color-border: rgba(30, 41, 59, 0.08);
    --color-border-hover: rgba(30, 41, 59, 0.15);
    --color-hairline: rgba(15, 23, 42, 0.12);

    /* Shape and depth */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 18px;
    --radius-pill: 999px;
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
    --shadow-md: 0 18px 40px -24px rgba(15, 23, 42, 0.35);

    /* Motion: short and decelerating so the interface feels immediate */
    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
    --duration-fast: 160ms;
    --duration-base: 240ms;

    /* Fluid Spacing - scales with viewport */
    --spacing-xs: clamp(0.25rem, 0.5vw, 0.5rem);
    --spacing-sm: clamp(0.5rem, 1vw, 1rem);
    --spacing-md: clamp(1rem, 2vw, 2rem);
    --spacing-lg: clamp(1.5rem, 3vw, 3rem);
    --spacing-xl: clamp(2.5rem, 5vw, 5rem);
    --spacing-2xl: clamp(4rem, 8vw, 8rem);

    /* Container widths */
    --container-lg: 1024px;
    --container-xl: 1280px;

    /* Fluid container padding */
    --container-padding: clamp(1rem, 5vw, 3rem);

    /* Typography */
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-display: 'Space Grotesk', 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    --text-xs: clamp(0.75rem, 1.5vw, 0.875rem);
    --text-sm: clamp(0.875rem, 2vw, 1rem);
    --text-base: clamp(1rem, 2.5vw, 1.125rem);
    --text-lg: clamp(1.125rem, 3vw, 1.25rem);
    --text-xl: clamp(1.25rem, 3.5vw, 1.5rem);
    --text-2xl: clamp(1.5rem, 4vw, 1.875rem);
    --text-3xl: clamp(1.875rem, 5vw, 2.25rem);
    --text-4xl: clamp(2.25rem, 6vw, 3rem);
    --text-5xl: clamp(3rem, 8vw, 4rem);
    --text-6xl: clamp(3.75rem, 10vw, 6rem);
    /* Every homepage section title and its lede share these sizes. */
    --text-section-title: 2.5rem;
    --text-lede: 1.125rem;

    @media (max-width: 768px) {
      --text-section-title: 2rem;
      --text-lede: 1rem;
    }

    /* Z-index layers */
    --z-fixed: 300;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    --header-offset: clamp(5rem, 8vw, 7rem);
    font-size: 100%; /* Respect user's font size preference */
    scroll-behavior: smooth;
    scroll-padding-top: var(--header-offset);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    background-color: var(--color-bg-primary);
  }

  body {
    font-family: var(--font-primary);
    font-size: var(--text-base);
    background-color: var(--color-bg-primary);
    /* Faint engineering-paper grid */
    background-image:
      linear-gradient(to right, rgba(30, 41, 59, 0.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30, 41, 59, 0.025) 1px, transparent 1px);
    background-size: 80px 80px;
    background-attachment: fixed;
    color: var(--color-text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--color-ink);
    text-wrap: balance;
  }

  h1 { font-size: var(--text-6xl); }
  h2 { font-size: var(--text-5xl); }
  h3 { font-size: var(--text-4xl); }
  h4 { font-size: var(--text-3xl); }
  h5 { font-size: var(--text-2xl); }
  h6 { font-size: var(--text-xl); }

  p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    font-size: var(--text-base);
    text-wrap: pretty;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition:
      color var(--duration-fast) ease,
      background-color var(--duration-fast) ease,
      border-color var(--duration-fast) ease,
      opacity var(--duration-fast) ease;
  }

  ::selection {
    background-color: var(--color-accent-primary);
    color: #ffffff;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(29, 78, 216, 0.2);
    border-radius: 100px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(29, 78, 216, 0.6);
    background-clip: padding-box;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(29, 78, 216, 0.2) transparent;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  /* Touch-friendly tap targets: 44px tall controls; width only for buttons,
     so text links keep their natural spacing. Icon-only links size themselves. */
  button, a, input, textarea, select {
    min-height: 44px;
  }

  button {
    min-width: 44px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    /* A zero duration and delay means no transition starts at all. A tiny
       non-zero duration would make every property of every element (initial
       transition-property is "all") transition for one stale frame. */
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }

  /* Hide scrollbars on small screens but keep scrolling */
  @media (max-width: 768px) {
    ::-webkit-scrollbar {
      display: none;
    }

    * {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
`;

export default GlobalStyles;
