# Blog Component Documentation

## Overview
The Blog section has been refactored to follow modern React best practices with improved modularity, maintainability, and code organization.

## File Structure

```
src/
├── components/
│   └── Blog/
│       ├── Blog.jsx          # Main blog section component
│       ├── BlogCard.jsx      # Individual blog post card component
│       └── BlogModal.jsx     # Blog post modal dialog component
├── data/
│   └── blogs.json           # Blog posts data
├── constants/
│   └── blogConstants.js     # Blog-related constants and configuration
└── utils/
    └── blogUtils.js         # Utility functions for blog operations
```

## Components

### Blog.jsx
Main blog section component that:
- Displays the blog section header
- Renders blog posts in a responsive grid
- Manages modal state for viewing full blog posts
- Handles empty states
- Shows inspirational quote

**Props:** None (top-level section component)

### BlogCard.jsx
Reusable blog card component that:
- Displays blog preview with title, summary, and metadata
- Handles hover animations
- Triggers modal on click
- Fully accessible with ARIA labels

**Props:**
- `blog` (object, required): Blog post data
- `index` (number, required): Index for animation staggering
- `isInView` (boolean, required): Viewport intersection state
- `variants` (object, required): Framer Motion animation variants
- `onClick` (function, required): Click handler

### BlogModal.jsx
Modal dialog for full blog content that:
- Displays complete blog post
- Prevents body scroll when open
- Handles keyboard navigation (ESC to close)
- Fully accessible modal implementation

**Props:**
- `blog` (object): Blog post data (null when closed)
- `onClose` (function, required): Close handler

## Data Structure

### blogs.json
Each blog post should have the following structure:

```json
{
  "id": 1,
  "title": "Blog Post Title",
  "slug": "blog-post-slug",
  "summary": "Brief summary...",
  "date": "DD MMM, YYYY",
  "readTime": "X min read",
  "content": "Full HTML content...",
  "category": "Category Name"
}
```

## Utilities

### blogUtils.js
Provides utility functions:
- `sortBlogsByDate(posts)` - Sort posts by date (newest first)
- `filterBlogsByCategory(posts, category)` - Filter by category
- `getBlogCategories(posts)` - Get unique categories
- `formatBlogDate(dateStr)` - Format date strings
- `findBlogBySlug(posts, slug)` - Find post by slug
- `calculateReadingTime(content)` - Calculate reading time
- `sanitizeHTML(html)` - Basic HTML sanitization

## Constants

### blogConstants.js
Centralized configuration:
- `BLOG_ANIMATION_VARIANTS` - Framer Motion animation presets
- `BLOG_CONFIG` - Pagination and sorting settings
- `BLOG_CATEGORIES` - Available blog categories
- `BLOG_CONTENT` - Static text content

## Best Practices Implemented

1. **Separation of Concerns**
   - Components split into focused, single-responsibility units
   - Data moved to dedicated `data/` directory
   - Business logic extracted to utility functions

2. **Code Reusability**
   - Shared utilities for common operations
   - Centralized constants for configuration
   - Reusable components with prop validation

3. **Performance**
   - `useMemo` for expensive sorting operations
   - Lazy loading considerations
   - Optimized re-renders

4. **Accessibility**
   - Semantic HTML elements
   - ARIA labels and roles
   - Keyboard navigation support
   - Focus management in modal

5. **Maintainability**
   - Clear file organization
   - PropTypes validation
   - JSDoc comments
   - Descriptive naming conventions

6. **Type Safety**
   - PropTypes for runtime validation
   - Clear prop interfaces

## Usage Example

```jsx
import Blog from './components/Blog/Blog';

function App() {
  return (
    <div>
      <Blog />
    </div>
  );
}
```

## Adding New Blog Posts

1. Open `src/data/blogs.json`
2. Add new blog object with all required fields
3. The component will automatically pick it up
4. Posts are sorted by date automatically

## Future Enhancements

Potential improvements to consider:
- Markdown support instead of HTML
- Search functionality
- Category filtering UI
- Pagination for large post counts
- RSS feed generation
- SEO optimization
- Social sharing buttons
- Reading progress indicator
