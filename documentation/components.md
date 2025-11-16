# Components Documentation

## Overview
All UI and logic are organized into feature-based React components under `src/components/`. Each folder represents a feature or section of the site. Components use styled-components for encapsulated styles, Framer Motion for animations, and follow accessibility best practices.

---

## About
**Location**: `src/components/About/About.jsx`

**Purpose**: Profile section with stats, skills, and personal information.

**Features**:
- Profile image and bio
- Stats grid (years of experience, projects, etc.)
- Skills showcase with icons
- Framer Motion scroll animations
- Responsive grid layout

**Technologies**: React Icons, Framer Motion, styled-components

---

## Blog

### Blog.jsx
**Location**: `src/components/Blog/Blog.jsx`

**Purpose**: Blog listing page displaying all blog posts.

**Features**:
- Dynamically loads Markdown files from `src/blogs/` using `import.meta.glob`
- Parses frontmatter metadata (title, date, summary, author) with `gray-matter`
- Renders `BlogCard` components in responsive grid
- Skeleton loaders during async loading
- Filters and sorts posts by date

**Data Flow**: 
1. `import.meta.glob('../../blogs/*.md', { eager: true })` loads all `.md` files
2. `gray-matter` extracts frontmatter
3. Posts sorted by date (newest first)
4. Maps to `BlogCard` components

### BlogCard.jsx
**Location**: `src/components/Blog/BlogCard.jsx`

**Purpose**: Individual blog post preview card.

**Features**:
- Uniform card height: 320px minimum
- Title: 2-line text clamp with ellipsis (`-webkit-line-clamp: 2`)
- Summary: 3-line text clamp with ellipsis
- Date display with formatting
- Hover effects: `translateY(-5px)` transition
- Focus-visible states for keyboard navigation
- Author information
- Links to `/blog/:slug` route

**Styling**: 
- Flexbox layout for content distribution
- `min-height` on title (2.8em), summary (4.8em), card (320px)
- Ensures visual consistency regardless of content length

**Accessibility**: 
- Semantic HTML (`<article>`)
- Focus-visible outline (3px offset)
- Touch target size: 48px minimum

### BlogModal.jsx
**Location**: `src/components/Blog/BlogModal.jsx`

**Purpose**: Modal for displaying full blog post content.

**Features**:
- Overlay with backdrop blur
- Close button and ESC key support
- Scroll lock on body when open
- Renders Markdown content with `react-markdown`
- Responsive padding and max-width

---

## Contact
**Location**: `src/components/Contact/Contact.jsx`

**Purpose**: Contact form with email/message submission.

**Features**:
- Form validation (email format, required fields)
- Loading states during submission:
  - CSS spinner animation
  - Disabled form inputs
  - Submit button text changes
- Toast notifications for success/error feedback (via `useToast` hook)
- EmailJS integration for form submission
- Social media links
- Responsive layout

**State Management**:
- Local state for form data, loading, validation errors
- Toast context for notifications

**User Experience**:
- Non-intrusive feedback (toast instead of inline messages)
- Clear loading indicators
- Prevents double-submission with disabled state

---

## FunElements

### AirplaneTrail.jsx
**Location**: `src/components/FunElements/AirplaneTrail.jsx`

**Purpose**: Animated airplane SVG that follows a path across the screen.

**Features**: GSAP timeline animation, decorative effect

### FloatingRocket.jsx
**Location**: `src/components/FunElements/FloatingRocket.jsx`

**Purpose**: Animated rocket SVG with floating motion.

**Features**: Framer Motion animations, particle effects

### PandaCursor.jsx
**Location**: `src/components/FunElements/PandaCursor.jsx`

**Purpose**: Custom cursor with panda theme (desktop only).

**Features**: Follows mouse position, CSS transforms, hidden on mobile

---

## Hero

### Hero.jsx
**Location**: `src/components/Hero/Hero.jsx`

**Purpose**: Landing section with introduction, CTA, and background effects.

**Features**:
- Typing animation or headline text
- Call-to-action buttons
- Floating shapes background
- Responsive typography
- Scroll-down indicator

### HeroCanvas.jsx
**Location**: `src/components/Hero/HeroCanvas.jsx`

**Purpose**: Three.js 3D canvas background for hero section.

**Features**:
- WebGL rendering with `@react-three/fiber`
- 3D objects and lighting
- Interactive camera controls
- Responsive canvas sizing

### FloatingShape.jsx
**Location**: `src/components/Hero/FloatingShape.jsx`

**Purpose**: Animated geometric shapes for visual interest.

**Features**: Framer Motion animations, random positioning

---

## Navigation
**Location**: `src/components/Navigation/Navigation.jsx`

**Purpose**: Site navigation bar with mobile menu and scroll-to-section.

**Features**:
- Desktop: Horizontal nav with smooth scroll links
- Mobile: Hamburger menu with slide-out drawer
- **Cross-page navigation**:
  - Uses `useNavigate` and `useLocation` from `react-router-dom`
  - Detects if navigation is same-page or cross-route
  - Same-page: Immediate smooth scroll
  - Cross-route: Navigate to home → 500ms delay → scroll to section
  - Prevents premature scrolling before DOM renders
- Sticky positioning on scroll
- Active link highlighting
- Smooth scroll using `useSmoothScroll` hook
- Close mobile menu on link click
- Focus-visible states for accessibility

**Navigation Links**:
- Home, About, Work, Projects, Blog, Contact

**User Experience Improvements**:
- Fixed double-click issue on cross-page navigation
- Prevents scroll landing between sections
- Ensures consistent scroll behavior regardless of starting route

---

## Projects
**Location**: `src/components/Projects/Projects.jsx`

**Purpose**: Showcase grid of projects with descriptions, links, and images.

**Features**:
- Project cards with hover effects
- GitHub and live demo links
- Project images from `public/images/projects/`
- Skeleton loaders during image loading
- Responsive grid layout (3 columns → 2 → 1)
- Tech stack badges
- Framer Motion stagger animations

**Data Source**: `src/constants/` or inline project array

---

## Skeleton Loaders

### SkeletonCard.jsx
**Location**: `src/components/Skeleton/SkeletonCard.jsx`

**Purpose**: Loading state placeholders for async content.

**Variants**:
- **BlogSkeletonCard**: Matches `BlogCard` dimensions (320px height, title/summary placeholders)
- **ProjectSkeletonCard**: Matches project card layout (image, title, description areas)
- **WorkSkeletonCard**: Matches work experience card layout

**Features**:
- Shimmer animation with CSS gradient
- Pulse effect using `@keyframes`
- Exact dimensional matching to actual cards
- Prevents layout shift during loading

**Implementation**:
```jsx
import { BlogSkeletonCard } from '../Skeleton';

{loading ? (
  Array(6).fill().map((_, i) => <BlogSkeletonCard key={i} />)
) : (
  posts.map(post => <BlogCard key={post.slug} {...post} />)
)}
```

**Animation**: 
- Linear gradient: `linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)`
- Animation: 1.5s infinite
- Background-size: 200% 100%

---

## Timeline
**Location**: `src/components/Timeline/Timeline.jsx`

**Purpose**: Chronological timeline of achievements, education, and milestones.

**Features**:
- Vertical timeline with alternating left/right cards
- Date markers and connecting lines
- Icon indicators for event types
- Scroll reveal animations
- Responsive layout (single column on mobile)

---

## Toast Notification System

### ToastProvider.jsx
**Location**: `src/components/Toast/ToastProvider.jsx`

**Purpose**: Global toast notification system using React Context.

**Features**:
- **Auto-dismiss**: Notifications disappear after 5 seconds
- **Manual close**: Click close button to dismiss immediately
- **Variants**: `success`, `error`, `info` (color-coded)
- **Animations**: Slide-in from right with Framer Motion
- **Queue management**: Stacks multiple toasts vertically
- **Responsive positioning**: Top-right on desktop, top-center on mobile

**API**:
```jsx
const { addToast } = useToast();

addToast({
  message: 'Form submitted successfully!',
  type: 'success'
});
```

**Implementation**:
- Context: `ToastContext` provides `addToast` function
- State: Array of toast objects `{ id, message, type }`
- Auto-remove: `setTimeout` clears toast after 5s
- Styling: Fixed positioning, z-index 9999, slide-in animation

**Usage**: Wrap `App.jsx` with `<ToastProvider>`, consume with `useToast()` hook

---

## Work
**Location**: `src/components/Work/Work.jsx`

**Purpose**: Work experience section with company details, roles, and timelines.

**Features**:
- Company cards with logos
- Job title and duration
- Responsibilities and achievements
- Tech stack tags
- Hover effects and animations
- Responsive grid layout

**Data Source**: `src/constants/` or inline work experience array

---

## Pages

### BlogPost.jsx
**Location**: `src/pages/BlogPost.jsx`

**Purpose**: Individual blog post page (route: `/blog/:slug`).

**Features**:
- Reads `:slug` param from URL using `useParams()`
- Loads corresponding `.md` file from `src/blogs/`
- Parses frontmatter and content with `gray-matter`
- Renders Markdown with `react-markdown`
- Displays metadata: title, date, author
- Back to blog list link
- Reading time estimate
- Responsive typography

**Error Handling**: 
- 404 redirect if blog post not found
- Loading state during fetch

---

## Design Patterns

### Consistent Hover Effects
- All interactive elements: `translateY(-5px)` on hover
- Transition duration: 0.3s ease
- Applied to: Cards, buttons, links, navigation items

### Focus-Visible States
- All interactive elements: 3px solid outline with 2px offset
- Color: Primary brand color or high-contrast
- Only visible on keyboard navigation (`:focus-visible`)

### Touch Targets
- Minimum size: 44-48px (WCAG guideline)
- Applied to: Navigation links, buttons, form inputs, close buttons

### Text Clamping
- Uses `-webkit-line-clamp` with `display: -webkit-box`
- Fallback: `text-overflow: ellipsis` with `overflow: hidden`
- Ensures uniform card heights across dynamic content

### Skeleton Loading Pattern
- 1:1 dimensional match to actual component
- Shows during async operations (data fetching, image loading)
- Prevents cumulative layout shift (CLS)
- Shimmer animation for visual feedback

---

## Usage
Each component is imported and used in `App.jsx` or parent components. Components are self-contained with their own styles, state, and logic.

## Extending
To add a new section:
1. Create folder in `src/components/` (e.g., `Testimonials/`)
2. Create main component file (e.g., `Testimonials.jsx`)
3. Define styled-components within file or separate `.styles.js`
4. Import and use in `App.jsx`
5. Add route if needed (for page-level components)
6. Create skeleton loader variant if async content
7. Add navigation link in `Navigation.jsx`
8. Document in this file
