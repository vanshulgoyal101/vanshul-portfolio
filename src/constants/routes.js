// Public URL paths, shared by the React app and the Node build scripts.
//
// GitHub Pages serves each prerendered route from `<route>/index.html` and
// answers the slash-less form (`/blog`) with a 301 to `/blog/`. Canonical URLs,
// sitemap entries, structured data and internal links therefore use the final
// trailing-slash form so no advertised URL redirects.
import { SITE_URL } from './siteConfig.js';

export const HOME_PATH = '/';
export const BLOG_PATH = '/blog/';
export const READING_LIST_PATH = '/reading-list/';

export const postPath = (slug) => `${BLOG_PATH}${slug}/`;

// A featured project's full story. There is no /projects/ index page: the
// homepage's #projects section is the list.
export const projectPath = (id) => `/projects/${id}/`;

// In-page section of the homepage, e.g. homeSectionPath('contact') -> '/#contact'.
export const homeSectionPath = (sectionId) => `${HOME_PATH}#${sectionId}`;

export const absoluteUrl = (path, site = SITE_URL) => `${site}${path}`;
