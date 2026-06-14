# Custom Hooks Documentation

## Overview
Custom hooks encapsulate reusable logic and state management patterns. Located in `src/hooks/`, these hooks enhance functionality across components while maintaining clean, DRY code.

---

## useSmoothScroll.js
**Location**: `src/hooks/useSmoothScroll.js`

**Purpose**: Provides smooth scrolling functionality using Lenis library, with utilities for scroll-based animations and state tracking.

**Features**:
- Smooth wheel scrolling with customizable easing
- Scroll state tracking (progress, direction, velocity)
- Programmatic scrolling to elements or sections
- Integration with Lenis (`@studio-freight/lenis`)
- Lifecycle management (start, stop, destroy)

**Configuration Options**:
```javascript
const scrollUtils = useSmoothScroll({
  duration: 1.2,              // Scroll animation duration in seconds
  easing: (t) => ...,         // Custom easing function
  smoothWheel: true,          // Enable smooth wheel scrolling
  smoothTouch: false,         // Enable smooth touch scrolling
  wheelMultiplier: 1,         // Mouse wheel scroll multiplier
  touchMultiplier: 2,         // Touch scroll multiplier
  onScroll: (data) => {}      // Callback on scroll events
});
```

**Return Values**:
- `scrollTo(target)`: Scroll to element (ID string) or position (number)
- `start()`: Enable smooth scrolling
- `stop()`: Temporarily disable smooth scrolling
- `destroy()`: Clean up Lenis instance
- `updateOptions(newOptions)`: Update configuration
- `isSupported()`: Check browser support
- `getInstance()`: Get raw Lenis instance
- `scrollState`: Object with `{ progress, direction, velocity, isScrolling }`
- `isScrolling`: Boolean scroll state
- `scrollProgress`: 0-1 scroll position
- `scrollDirection`: 1 (down) or -1 (up)
- `scrollVelocity`: Current scroll speed
- `currentSection`: Active section ID based on scroll position

**Usage Example**:
```javascript
import useSmoothScroll from '../hooks/useSmoothScroll';

const MyComponent = () => {
  const { scrollTo, scrollProgress } = useSmoothScroll({
    duration: 1.5,
    onScroll: ({ progress }) => {
      console.log('Scroll progress:', progress);
    }
  });

  const handleClick = () => {
    scrollTo('about'); // Scrolls to element with id="about"
  };

  return <button onClick={handleClick}>Scroll to About</button>;
};
```

**Implementation Details**:
- Uses `useRef` to store Lenis instance
- `useEffect` for initialization and cleanup
- `useCallback` for memoized utility functions
- `useState` for reactive scroll state
- RAF (requestAnimationFrame) loop for smooth updates
- Event listeners for scroll events

**Browser Compatibility**:
- Fallback to native `scrollIntoView` if Lenis not supported
- Graceful degradation on older browsers

**Performance**:
- Throttled scroll events to prevent performance issues
- Optimized RAF loop with delta time calculations
- Cleanup on component unmount to prevent memory leaks

---

## useToast (from ToastProvider)
**Location**: `src/components/Toast/ToastProvider.jsx` (exported hook)

**Purpose**: Access global toast notification system from any component.

**API**:
```javascript
const { addToast } = useToast();

addToast({
  message: 'Operation successful!',
  type: 'success' // 'success' | 'error' | 'info'
});
```

**Features**:
- Must be used within `<ToastProvider>` context
- Throws error if used outside provider
- Returns `addToast` function for creating notifications

**Parameters**:
- `message` (string): Notification text content
- `type` (string): Visual variant - `'success'`, `'error'`, or `'info'`

**Auto-dismiss**: Toasts automatically disappear after 5 seconds

**Usage Example**:
```javascript
import { useToast } from '../components/Toast';

const ContactForm = () => {
  const { addToast } = useToast();

  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      addToast({ message: 'Message sent successfully!', type: 'success' });
    } catch (error) {
      addToast({ message: 'Failed to send message', type: 'error' });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

**Context Implementation**:
```javascript
// In App.jsx
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      {/* Your app components */}
    </ToastProvider>
  );
}
```

**Error Handling**:
- Throws descriptive error if `useToast` called outside `ToastProvider`
- Prevents runtime crashes from improper usage

---

## React Router Hooks (used in Navigation.jsx)

### useNavigate
**Source**: `react-router-dom`

**Purpose**: Programmatic navigation between routes.

**Usage in Navigation**:
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to home page
navigate('/');

// Navigate to blog post
navigate(`/blog/${slug}`);
```

**Use Cases**:
- Navigate from blog post back to home
- Cross-page navigation with scroll timing
- Redirect after form submission

### useLocation
**Source**: `react-router-dom`

**Purpose**: Access current route location and state.

**Usage in Navigation**:
```javascript
import { useLocation } from 'react-router-dom';

const location = useLocation();

// Check if already on home page
const isHomePage = location.pathname === '/';

// Conditional navigation logic
if (isHomePage) {
  // Same-page scroll (immediate)
  scrollToSection(sectionId);
} else {
  // Cross-page navigation (with delay)
  navigate('/');
  setTimeout(() => scrollToSection(sectionId), 500);
}
```

**Properties**:
- `pathname`: Current URL path (e.g., `/blog/health-post-agi`)
- `search`: Query string (e.g., `?page=2`)
- `hash`: URL hash (e.g., `#about`)
- `state`: Route state passed via `navigate(path, { state })`

**Use Cases**:
- Detect current route for conditional behavior
- Prevent unnecessary navigation
- Scroll timing optimization based on route change

---

## Navigation Scroll Logic Pattern

**Problem**: Navigation links from blog posts required double-click to scroll to sections.

**Solution**: Route-aware scroll timing with `useNavigate` + `useLocation`.

**Implementation**:
```javascript
const navigate = useNavigate();
const location = useLocation();

const handleNavClick = (e, sectionId) => {
  e.preventDefault();
  
  const isHomePage = location.pathname === '/';
  
  if (isHomePage) {
    // Already on home page - scroll immediately
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // On different page (e.g., blog post)
    // 1. Navigate to home page
    navigate('/');
    
    // 2. Wait 500ms for DOM to render
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); // Increased from 100ms to prevent premature scrolling
  }
};
```

**Timing Considerations**:
- Same-page: 0ms (immediate)
- Cross-page: 500ms (allows React to render home page components)
- Prevents scroll landing between sections
- Ensures target element exists in DOM before scrolling

---

## Extending
To add new custom hooks:

1. **Create hook file** in `src/hooks/` (e.g., `useWindowSize.js`)
2. **Follow naming convention**: Prefix with `use` (React convention)
3. **Document thoroughly**: Parameters, return values, usage examples
4. **Add to this file**: Document API, use cases, implementation notes
5. **Export properly**: Named or default export based on convention
6. **Add TypeScript** (if applicable): Type definitions for parameters and return values

**Example Hook Template**:
```javascript
// src/hooks/useCustomHook.js
import { useState, useEffect } from 'react';

/**
 * Brief description of hook purpose
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} Hook return values
 */
const useCustomHook = (options = {}) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects and cleanup
    return () => {
      // Cleanup logic
    };
  }, [dependencies]);

  return { state, utilityFunctions };
};

export default useCustomHook;
```

**Best Practices**:
- Keep hooks focused on single responsibility
- Provide cleanup in `useEffect` return functions
- Memoize functions with `useCallback`
- Document edge cases and browser compatibility
- Test in isolation and within components
