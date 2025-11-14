# Components Documentation

## Overview
All UI and logic are organized into feature-based React components under `src/components/`. Each folder represents a feature or section of the site.

### About
- **About.jsx**: Main About section. Includes profile, stats, skills, and styled-components. Uses Framer Motion for animation and React Icons for visuals.

### Blog
- **Blog.jsx**: Blog listing and rendering logic. Loads Markdown files from `src/blogs/` using `import.meta.glob`, parses with `gray-matter`, and renders with `react-markdown`.
- **Blog2.jsx**: Alternate blog view with same functionality.
- Blog posts are stored as individual `.md` files in `src/blogs/` with frontmatter metadata.

### Contact
- **Contact.jsx**: Contact form and details.

### FunElements
- **AirplaneTrail.jsx**: Animated airplane trail effect.
- **FloatingRocket.jsx**: Animated rocket effect.
- **PandaCursor.jsx**: Custom cursor with panda theme.

### Hero
- **FloatingShape.jsx**: Animated shapes for hero section.
- **Hero.jsx**: Main hero section.
- **HeroCanvas.jsx**: Canvas-based hero visuals.

### Navigation
- **Navigation.jsx**: Site navigation bar and logic.

### Projects
- **Projects.jsx**: Projects showcase grid and details.

### Timeline
- **Timeline.jsx**: Timeline of achievements/events.

### Work
- **Work.jsx**: Work experience and details.

## Usage
Each component is imported and used in `App.jsx` or other parent components. Components use styled-components for encapsulated styles and Framer Motion for animation.

## Extending
To add a new section, create a new folder and component in `src/components/` and follow the existing structure.
