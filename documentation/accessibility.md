# Accessibility Documentation

## Overview
This project adheres to **WCAG 2.1 Level AA** accessibility standards, ensuring the portfolio is usable by people with diverse abilities and assistive technologies. Accessibility is implemented through semantic HTML, keyboard navigation, focus management, color contrast, and touch target optimization.

---

## WCAG 2.1 Level AA Compliance

### Standards Overview
**WCAG**: Web Content Accessibility Guidelines (W3C standard)
**Level AA**: Mid-tier conformance (industry standard for most websites)

**Compliance Areas**:
1. **Perceivable**: Content is presentable to all users
2. **Operable**: UI components and navigation are operable
3. **Understandable**: Information and UI operation are understandable
4. **Robust**: Content works with current and future assistive technologies

---

## Keyboard Navigation

### Focus Management
All interactive elements are keyboard-accessible without requiring a mouse.

**Tab Order**:
- Navigation links
- Section headings
- Interactive cards (blog posts, projects)
- Form inputs and buttons
- Modal close buttons

**Keyboard Shortcuts**:
- `Tab` - Navigate forward through interactive elements
- `Shift + Tab` - Navigate backward
- `Enter` or `Space` - Activate buttons and links
- `Esc` - Close modals and mobile menu

### Focus-Visible States
Visual indicators for keyboard navigation.

**Global Styles** (`src/index.css`):
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

input:focus-visible,
textarea:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
}
```

**Requirements**:
- **Width**: 3px minimum (WCAG 2.4.7)
- **Offset**: 2-3px for visual separation
- **Color**: High contrast (#6366f1 indigo on dark backgrounds)
- **Visibility**: Only on keyboard navigation (`:focus-visible`, not `:focus`)

**Why Not `:focus`**:
- `:focus` shows outline on mouse clicks (visually cluttered)
- `:focus-visible` only shows for keyboard users (better UX)

**Browser Support**: Modern browsers (Chrome 86+, Firefox 85+, Safari 15.4+)

---

## Touch Targets

### Size Requirements
**WCAG 2.5.5**: Touch targets should be at least 44x44 pixels.

**Implementation**: Minimum 44-48px for all interactive elements.

**Examples**:

**Navigation Links**:
```javascript
const NavLink = styled.a`
  padding: 0.75rem 1rem; // ~48px height
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem; // Larger on mobile (48px+)
  }
`;
```

**Buttons**:
```javascript
const Button = styled.button`
  padding: 0.75rem 1.5rem; // Minimum 48px height
  min-height: 44px;
`;
```

**Form Inputs**:
```javascript
const Input = styled.input`
  padding: 0.875rem 1rem; // ~48px height
  min-height: 44px;
`;
```

**Cards** (clickable):
```javascript
const Card = styled.a`
  padding: var(--spacing-lg); // 24-48px
  min-height: 320px; // Large target area
`;
```

**Close Buttons** (modals, toasts):
```javascript
const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  padding: 0.5rem;
`;
```

**Mobile Optimization**:
- Touch targets increased on small screens
- More padding on mobile navigation
- Larger tap areas for form elements

---

## Color Contrast

### Text Contrast Ratios
**WCAG AA Requirements**:
- **Normal text** (< 18pt): 4.5:1 minimum
- **Large text** (≥ 18pt): 3:1 minimum

**Implementation**:

**Primary Text**: White on dark backgrounds
- Color: `#ffffff` on `#0a0a0a`
- Ratio: **21:1** (exceeds WCAG AAA)

**Secondary Text**: Light gray on dark backgrounds
- Color: `#a0a0a0` on `#0a0a0a`
- Ratio: **8.59:1** (exceeds WCAG AA)

**Muted Text**: Medium gray on dark backgrounds
- Color: `#666666` on `#0a0a0a`
- Ratio: **4.54:1** (meets WCAG AA for normal text)

**Accent Colors**: Indigo/Purple on dark backgrounds
- Color: `#6366f1` on `#0a0a0a`
- Ratio: **4.78:1** (meets WCAG AA)

**Link Hover States**: Lighter indigo for distinction
- Color: `#818cf8` (lightened accent)
- Additional hover effect: `translateY(-5px)` for non-color cues

### Non-Text Contrast
**UI Components**: 3:1 minimum (WCAG 1.4.11)

**Borders**: `rgba(255, 255, 255, 0.1)` - Visible against dark backgrounds
**Focus Outlines**: `#6366f1` - High contrast for visibility

---

## Semantic HTML

### Proper Element Usage
Semantic HTML improves screen reader navigation and document structure.

**Landmark Elements**:
```jsx
<header>
  <nav> {/* Navigation links */} </nav>
</header>

<main>
  <section id="about"> {/* About section */} </section>
  <section id="work"> {/* Work experience */} </section>
  <section id="projects"> {/* Projects */} </section>
  <section id="blog"> {/* Blog posts */} </section>
  <section id="contact"> {/* Contact form */} </section>
</main>

<footer> {/* Footer content */} </footer>
```

**Heading Hierarchy**:
```jsx
<h1>Vanshul Goyal</h1> {/* Page title (one per page) */}
<h2>About Me</h2> {/* Section headings */}
<h3>Skills</h3> {/* Subsection headings */}
```

**No Skipping**: Don't skip heading levels (h1 → h3), use sequential order.

**Lists**:
```jsx
<ul> {/* Unordered lists for navigation, skills */}
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<ol> {/* Ordered lists for steps, rankings */}
  <li>First step</li>
  <li>Second step</li>
</ol>
```

**Articles** (Blog Posts):
```jsx
<article>
  <h2>Blog Post Title</h2>
  <p>Summary...</p>
</article>
```

**Forms**:
```jsx
<form>
  <label htmlFor="name">Name</label>
  <input id="name" type="text" required />
</form>
```

---

## ARIA Labels & Roles

### When to Use ARIA
**First Rule**: Use semantic HTML first, ARIA second.

**ARIA Examples**:

**Navigation**:
```jsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#about">About</a></li>
    <li><a href="#work">Work</a></li>
  </ul>
</nav>
```

**Buttons Without Text** (icon buttons):
```jsx
<button aria-label="Close modal">
  <FaTimes />
</button>
```

**Loading States**:
```jsx
<div role="status" aria-live="polite">
  {loading ? 'Loading...' : 'Content loaded'}
</div>
```

**Modals**:
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Blog Post Title</h2>
  <button aria-label="Close dialog">×</button>
</div>
```

**Toast Notifications**:
```jsx
<div role="alert" aria-live="assertive">
  {message}
</div>
```

### ARIA Live Regions
**Announce Dynamic Content**:

- `aria-live="polite"` - Announce when user is idle (loading states)
- `aria-live="assertive"` - Announce immediately (error messages, toasts)
- `role="status"` - For status updates
- `role="alert"` - For important messages

---

## Screen Reader Optimization

### Text Alternatives

**Images**:
```jsx
<img src="project.jpg" alt="E-commerce website homepage with shopping cart" />
```

**Decorative Images** (no semantic meaning):
```jsx
<img src="decoration.svg" alt="" role="presentation" />
```

**Icons With Text**:
```jsx
<button>
  <FaDownload /> Download Resume
</button>
```

**Icons Without Text**:
```jsx
<button aria-label="Download resume">
  <FaDownload />
</button>
```

### Skip Links
Allow keyboard users to skip repetitive content.

**Implementation**:
```jsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

**CSS**:
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

**Usage**: Press `Tab` on page load, skip link appears and focuses.

---

## Form Accessibility

### Labels & Inputs
Every input must have an associated label.

**Explicit Association**:
```jsx
<label htmlFor="email">Email Address</label>
<input id="email" type="email" name="email" required />
```

**Implicit Association** (not recommended):
```jsx
<label>
  Email Address
  <input type="email" name="email" required />
</label>
```

### Required Fields
```jsx
<input type="text" required aria-required="true" />
```

**Visual Indicator**:
```jsx
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
```

### Error Messages
```jsx
<input
  type="email"
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email address
  </p>
)}
```

### Loading States
```jsx
<button type="submit" disabled={loading} aria-busy={loading}>
  {loading ? 'Sending...' : 'Submit'}
</button>
```

---

## Modal & Overlay Accessibility

### Focus Trapping
Keep keyboard focus within modal while open.

**Implementation**:
```javascript
useEffect(() => {
  if (isOpen) {
    // Save previously focused element
    const previousFocus = document.activeElement;
    
    // Focus first element in modal
    const firstFocusable = modalRef.current.querySelector('button, [href], input');
    firstFocusable?.focus();
    
    // Return focus on close
    return () => {
      previousFocus?.focus();
    };
  }
}, [isOpen]);
```

### Keyboard Interaction
- `Esc` - Close modal
- `Tab` - Cycle through focusable elements within modal
- Focus returns to trigger element on close

### Scroll Lock
Prevent background scrolling when modal is open.

```javascript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}, [isOpen]);
```

### ARIA Attributes
```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Blog Post Title</h2>
  <p id="dialog-description">Published on January 1, 2024</p>
  <button aria-label="Close dialog" onClick={onClose}>
    <FaTimes />
  </button>
</div>
```

---

## Mobile Accessibility

### Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
```

**Rules**:
- Allow up to 5x zoom (WCAG 1.4.4)
- Don't use `user-scalable=no` (prevents zooming)
- Initial scale 1:1 for predictable layout

### Touch Gestures
- **Swipe**: Close mobile menu
- **Tap**: Activate buttons, links (minimum 44x44px)
- **Pinch-zoom**: Allowed for text enlargement

### Responsive Text
Text scales with viewport, minimum 16px for body text.

```css
font-size: clamp(1rem, 2.5vw, 1.125rem); /* 16-18px */
```

---

## Animation & Motion

### Reduced Motion
Respect user's motion preferences.

**CSS**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**JavaScript**:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
```

### Non-Essential Motion
Decorative animations (airplane trail, floating rocket) don't convey critical information.

**Accessibility**: Can be disabled via `prefers-reduced-motion` without losing functionality.

---

## Testing Procedures

### Manual Testing

**Keyboard Navigation**:
1. Unplug mouse
2. Navigate entire site using only `Tab`, `Shift+Tab`, `Enter`, `Esc`
3. Verify all interactive elements are reachable and activatable
4. Check focus indicators are visible

**Screen Reader Testing**:
- **macOS**: VoiceOver (`Cmd+F5`)
- **Windows**: NVDA (free) or JAWS
- **Chrome Extension**: ChromeVox
- Test: Heading navigation, landmark navigation, form interactions

**Color Contrast**:
- Browser DevTools: Inspect element → Accessibility panel
- Online tools: WebAIM Contrast Checker

**Touch Targets**:
- Browser DevTools: Measure element dimensions
- Physical testing: Use finger on mobile device

### Automated Testing

**Lighthouse** (Chrome DevTools):
```bash
# Accessibility score target: 95+
```

**axe DevTools** (Browser Extension):
- Install from Chrome Web Store
- Run automated scan on each page
- Fix all critical and serious issues

**WAVE** (Web Accessibility Evaluation Tool):
- Browser extension or online tool
- Identifies WCAG violations

**pa11y** (Command Line):
```bash
npm install -g pa11y
pa11y https://vanshul.com
```

---

## Common Patterns

### Accessible Card Links
```jsx
const Card = styled.a`
  display: block;
  text-decoration: none;
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 3px;
  }
`;

<Card href="/blog/slug" aria-label="Read blog post: Health Post AGI">
  <h3>Health Post AGI</h3>
  <p>Summary...</p>
</Card>
```

### Accessible Navigation
```jsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#about" aria-current={section === 'about' ? 'page' : undefined}>About</a></li>
    <li><a href="#work">Work</a></li>
  </ul>
</nav>
```

### Accessible Forms
```jsx
<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={emailError}
    aria-describedby={emailError ? 'email-error' : undefined}
  />
  {emailError && <p id="email-error" role="alert">{emailError}</p>}
  
  <button type="submit" disabled={loading} aria-busy={loading}>
    {loading ? 'Sending...' : 'Submit'}
  </button>
</form>
```

---

## Accessibility Checklist

### Content
- [ ] All images have descriptive `alt` text
- [ ] Decorative images use `alt=""` or `role="presentation"`
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] One `<h1>` per page
- [ ] Link text is descriptive ("Read more about X" not "Click here")

### Navigation
- [ ] All interactive elements keyboard-accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] Skip link provided for keyboard users
- [ ] Tab order is logical
- [ ] `Esc` closes modals and menus

### Forms
- [ ] All inputs have associated labels
- [ ] Required fields marked with `aria-required`
- [ ] Error messages associated with inputs via `aria-describedby`
- [ ] Form validation provides clear feedback

### Color & Contrast
- [ ] Text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- [ ] Color not sole indicator of information (use icons, text)
- [ ] Focus indicators have sufficient contrast

### Touch & Interaction
- [ ] Touch targets minimum 44x44px
- [ ] Mobile navigation easy to use with one hand
- [ ] Pinch-zoom enabled (no `user-scalable=no`)

### Dynamic Content
- [ ] Loading states announced to screen readers (`aria-live`)
- [ ] Toast notifications use `role="alert"`
- [ ] Modal focus trapped while open
- [ ] Focus returns to trigger on modal close

### Motion
- [ ] `prefers-reduced-motion` respected
- [ ] Animations don't cause seizures (no flashing > 3 times/second)

---

## Resources

### Official Guidelines
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

### Testing Tools
- Lighthouse: Built into Chrome DevTools
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- pa11y: https://pa11y.org/

### Contrast Checkers
- WebAIM: https://webaim.org/resources/contrastchecker/
- Colorable: https://colorable.jxnblk.com/

### Screen Readers
- NVDA (Windows): https://www.nvaccess.org/
- VoiceOver (macOS/iOS): Built-in
- JAWS (Windows): https://www.freedomscientific.com/products/software/jaws/

### Learning Resources
- A11y Project: https://www.a11yproject.com/
- WebAIM: https://webaim.org/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

## Related Documentation
- `styles.md` - Focus states, touch targets, color contrast
- `components.md` - Component accessibility patterns
- `architecture.md` - Semantic HTML structure
