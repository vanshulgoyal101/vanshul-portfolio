# Styling Documentation

## Overview
The project uses a hybrid styling approach combining CSS custom properties (CSS variables) for theming and `styled-components` for component-scoped styles. This provides the flexibility of CSS variables with the power of CSS-in-JS, enabling dynamic styling, theming, and encapsulation.

---

## Design System

### Color Palette
Deep blacks with electric blue/purple accents for a modern, high-tech aesthetic.

**Background Colors**:
- `--color-bg-primary`: `#0a0a0a` - Main background
- `--color-bg-secondary`: `#0f0f0f` - Secondary surfaces
- `--color-bg-tertiary`: `#141414` - Tertiary sections
- `--color-bg-card`: `#1a1a1a` - Card backgrounds

**Text Colors**:
- `--color-text-primary`: `#ffffff` - Primary text (headings, important content)
- `--color-text-secondary`: `#a0a0a0` - Secondary text (descriptions)
- `--color-text-muted`: `#666666` - Muted text (metadata, labels)

**Accent Colors**:
- `--color-accent-primary`: `#6366f1` - Primary brand color (indigo)
- `--color-accent-secondary`: `#8b5cf6` - Secondary accent (purple)
- `--color-accent-glow`: `#818cf8` - Glow/highlight effects

**Gradients**:
- `--color-gradient-1`: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` - Primary gradient
- `--color-gradient-2`: `linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)` - Background gradient

**Borders**:
- `--color-border`: `rgba(255, 255, 255, 0.1)` - Default borders
- `--color-border-hover`: `rgba(255, 255, 255, 0.2)` - Hover state borders

### Spacing System
Fluid spacing scales with viewport using `clamp()` for responsive consistency.

**Spacing Tokens**:
- `--spacing-xs`: `clamp(0.25rem, 0.5vw, 0.5rem)` - 4-8px
- `--spacing-sm`: `clamp(0.5rem, 1vw, 1rem)` - 8-16px
- `--spacing-md`: `clamp(1rem, 2vw, 2rem)` - 16-32px
- `--spacing-lg`: `clamp(1.5rem, 3vw, 3rem)` - 24-48px
- `--spacing-xl`: `clamp(2.5rem, 5vw, 5rem)` - 40-80px
- `--spacing-2xl`: `clamp(4rem, 8vw, 8rem)` - 64-128px

**Container Padding**:
- `--container-padding`: `clamp(1rem, 5vw, 3rem)` - Responsive edge spacing

**Usage**:
```css
padding: var(--spacing-xl); /* Fluid 40-80px */
gap: var(--spacing-md);     /* Fluid 16-32px */
```

### Typography
Three font families for hierarchy and visual interest.

**Font Families**:
- `--font-primary`: `'Inter'` - Body text, UI elements
- `--font-display`: `'Space Grotesk'` - Headings, hero text
- `--font-mono`: `'JetBrains Mono'` - Code, technical content

**Font Sizes** (fluid with `clamp()`):
- `--text-xs`: `clamp(0.75rem, 1.5vw, 0.875rem)` - 12-14px
- `--text-sm`: `clamp(0.875rem, 2vw, 1rem)` - 14-16px
- `--text-base`: `clamp(1rem, 2.5vw, 1.125rem)` - 16-18px (body)
- `--text-lg`: `clamp(1.125rem, 3vw, 1.25rem)` - 18-20px
- `--text-xl`: `clamp(1.25rem, 3.5vw, 1.5rem)` - 20-24px
- `--text-2xl`: `clamp(1.5rem, 4vw, 1.875rem)` - 24-30px (mobile optimized)
- `--text-3xl`: `clamp(1.875rem, 5vw, 2.25rem)` - 30-36px
- `--text-4xl`: `clamp(2.25rem, 6vw, 3rem)` - 36-48px
- `--text-5xl`: `clamp(3rem, 8vw, 4rem)` - 48-64px
- `--text-6xl`: `clamp(3.75rem, 10vw, 6rem)` - 60-96px (hero)

**Mobile Font Optimization**:
- Headings reduced to `--text-2xl` on mobile (24-30px)
- Prevents overly large text on small screens
- Maintains readability and visual hierarchy

### Container Widths
Standardized max-widths for content sections.

- `--container-xs`: `100%` - Full width
- `--container-sm`: `640px` - Small
- `--container-md`: `768px` - Medium
- `--container-lg`: `1024px` - Large
- `--container-xl`: `1280px` - Extra large (most sections)
- `--container-2xl`: `1536px` - Maximum

### Z-Index Layers
Predictable stacking order.

- `--z-base`: `0` - Default layer
- `--z-dropdown`: `100` - Dropdowns, popovers
- `--z-sticky`: `200` - Sticky elements
- `--z-fixed`: `300` - Fixed navigation
- `--z-modal`: `400` - Modals, overlays
- `--z-tooltip`: `500` - Tooltips, highest priority

### Breakpoints
Media query reference points.

- `--breakpoint-sm`: `640px` - Small tablets
- `--breakpoint-md`: `768px` - Tablets
- `--breakpoint-lg`: `1024px` - Laptops
- `--breakpoint-xl`: `1280px` - Desktops
- `--breakpoint-2xl`: `1536px` - Large desktops

**Usage in styled-components**:
```javascript
@media (max-width: 768px) {
  font-size: var(--text-sm);
}
```

---

## Accessibility Features (WCAG 2.1 Level AA)

### Focus-Visible States
Keyboard navigation indicators with high contrast.

**Global Focus Styles** (`src/index.css`):
```css
*:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 3px;
}
```

**Requirements**:
- 3px minimum outline width (WCAG 2.1)
- 2-3px offset for visual separation
- Only visible on keyboard navigation (`:focus-visible`, not `:focus`)
- High contrast color (#6366f1 indigo)

**Component Implementation**:
```javascript
const Button = styled.button`
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 3px;
  }
`;
```

### Touch Targets
Minimum 44-48px interactive area for mobile accessibility.

**WCAG Guideline**: 44x44px minimum for touch targets

**Implementation**:
```javascript
const NavLink = styled.a`
  padding: 0.75rem 1rem; /* ~48px height */
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem; /* Larger on mobile */
  }
`;
```

**Applied To**:
- Navigation links (48px)
- Buttons (48px minimum)
- Form inputs (44px minimum)
- Cards/clickable areas (48px minimum)
- Close buttons in modals (44px)

### Color Contrast
Text and background combinations meet WCAG AA standards.

**Primary Text**: White (#ffffff) on dark backgrounds (21:1 contrast ratio)
**Secondary Text**: Light gray (#a0a0a0) on dark backgrounds (8:1 contrast ratio)
**Links**: Indigo (#6366f1) with white text or hover states for distinction

---

## Patterns & Utilities

### Text Clamping
Consistent card heights with overflow ellipsis.

**CSS Implementation**:
```javascript
const Title = styled.h3`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em; /* Reserve space even if 1 line */
`;

const Summary = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.8em; /* Reserve space */
`;
```

**Use Cases**:
- Blog card titles (2 lines)
- Blog card summaries (3 lines)
- Project descriptions (3-4 lines)
- Any dynamic content requiring consistent layout

**Fallback**: 
- Safari, Firefox, Chrome support `-webkit-line-clamp`
- Fallback to single-line ellipsis on older browsers

### Hover Effects
Consistent lift animation across interactive elements.

**Standard Pattern**:
```javascript
const Card = styled.div`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  }
`;
```

**Applied To**:
- All cards (blog, project, work)
- Navigation links
- Buttons
- Interactive elements

**Timing**: 0.3s ease transition

### Animation Patterns

**Shimmer Effect** (Skeleton Loaders):
```javascript
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonCard = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;
```

**Slide-In** (Toast Notifications):
```javascript
const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;
```

**Fade & Scale** (Framer Motion):
```javascript
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Transitions
Standardized timing functions.

- `--transition-base`: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` - Default
- `--transition-slow`: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)` - Slow/dramatic

**Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Material Design standard

---

## Responsive Design

### Mobile-First Approach
Base styles target mobile, progressively enhance for larger screens.

**Breakpoint Strategy**:
```javascript
/* Mobile (default) */
font-size: var(--text-base);

/* Tablet */
@media (min-width: 768px) {
  font-size: var(--text-lg);
}

/* Desktop */
@media (min-width: 1024px) {
  font-size: var(--text-xl);
}
```

### Grid Layouts
Responsive column counts.

```javascript
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
  gap: var(--spacing-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
`;
```

### Fluid Typography
Scales smoothly between min/max based on viewport.

**Example**:
```css
font-size: clamp(1.5rem, 4vw, 1.875rem);
/* 
  Mobile (320px): 1.5rem (24px)
  Mid (800px):    4vw (32px)
  Desktop:        1.875rem (30px)
*/
```

---

## Global Styles

### Location
- `src/index.css` - Base CSS reset, focus states, font imports
- `src/styles/GlobalStyles.js` - CSS variables, global styles via `styled-components`

### Global Resets
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 100%; /* Respects user preferences */
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}
```

### Scrollbar Styles
Hidden scrollbars for cleaner aesthetic.

```css
::-webkit-scrollbar {
  width: 0px;
  display: none;
}

* {
  scrollbar-width: none; /* Firefox */
}

body {
  -ms-overflow-style: none; /* IE/Edge */
}
```

### Font Loading
Google Fonts via `@import` in `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Optimization**: `display=swap` prevents FOIT (Flash of Invisible Text)

---

## styled-components Usage

### Component Scoping
Styles are scoped to components, preventing global conflicts.

```javascript
import styled from 'styled-components';

const Card = styled.div`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 8px;
`;
```

### Dynamic Styling
Props-based conditional styling.

```javascript
const Button = styled.button`
  background: ${props => props.$primary 
    ? 'var(--color-accent-primary)' 
    : 'transparent'};
  color: ${props => props.$primary 
    ? 'white' 
    : 'var(--color-text-primary)'};
`;

// Usage
<Button $primary>Submit</Button>
```

**Note**: Use `$` prefix for transient props (not passed to DOM)

### Theme Integration
Access CSS variables within styled-components.

```javascript
const Section = styled.section`
  background: var(--color-bg-secondary);
  padding: var(--spacing-2xl) var(--container-padding);
  max-width: var(--container-xl);
  margin: 0 auto;
`;
```

---

## Performance Considerations

### CSS-in-JS Optimization
- Server-side rendering (SSR) support with `styled-components`
- Critical CSS extraction
- Minimal runtime overhead

### Animation Performance
- Use `transform` and `opacity` for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- Prefer `translateY` over `margin-top` for movement

### Layout Shifts
- Reserved space with `min-height` on text-clamped elements
- Skeleton loaders match exact dimensions
- Prevents Cumulative Layout Shift (CLS)

---

## Extending

### Adding New Colors
1. Define in `GlobalStyles.js` `:root` block
2. Use semantic naming (purpose, not value)
3. Provide dark/light variants if needed

```javascript
--color-success: #10b981;
--color-error: #ef4444;
--color-warning: #f59e0b;
```

### Creating New Components
1. Import `styled` from `styled-components`
2. Use CSS variables for theming
3. Include responsive breakpoints
4. Add focus-visible states
5. Ensure touch target sizes

### Modifying Design System
1. Update variables in `GlobalStyles.js`
2. Test across all components
3. Verify accessibility (contrast, focus states)
4. Document changes in this file
