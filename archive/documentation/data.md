# Data Documentation

## Static Data
- Blog posts are stored as individual Markdown files in `src/blogs/` with frontmatter metadata.
- Each file uses the slug as filename (e.g., `the-new-leverage.md`).
- Frontmatter includes: `title`, `slug`, `summary`, `date` (ISO format: YYYY-MM-DD), `readTime`, `category`.
- Content is written in Markdown format and rendered dynamically.

## Usage
Blog components load and parse Markdown files using `gray-matter` for frontmatter and `react-markdown` for rendering. Files are sorted by date and displayed in the UI.

## Extending
Add new blog posts by creating new `.md` files in `src/blogs/` with proper frontmatter. The system will automatically detect and include them.
