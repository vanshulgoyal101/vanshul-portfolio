// Centralized, dependency-free site configuration. Imported by both the React
// app (via Vite) and the Node build scripts (sitemap/feed/prerender), so the
// canonical URL, author identity, and social profiles live in exactly one place.

export const SITE_URL = 'https://vanshul.com';
export const AUTHOR_NAME = 'Vanshul Goyal';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const HOME_DESCRIPTION = 'Engineer at United Airlines. I write about AI, robotics, and the future of work — and build at the intersection of technology and human potential.';

// Social profiles keyed by platform. `games` and `links` are product links, not
// identity profiles, so they are intentionally excluded from `AUTHOR_SAME_AS`.
export const SOCIAL_LINKS = {
  twitter: 'https://x.com/goyal_vanshul',
  linkedin: 'https://www.linkedin.com/in/vanshul-goyal00/',
  instagram: 'https://www.instagram.com/vanshul_goyal/',
  github: 'https://github.com/vanshulgoyal101',
  games: 'https://games.vanshul.com',
  links: 'https://links.vanshul.com',
};

// schema.org `sameAs` — the canonical set of profiles that identify the author,
// used for Person/BlogPosting structured data.
export const AUTHOR_SAME_AS = [
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.twitter,
  SOCIAL_LINKS.instagram,
];

// Icon links shown in the hero and contact sections, in display order.
export const SOCIAL_PROFILES = [
  { id: 'twitter', label: 'Twitter', url: SOCIAL_LINKS.twitter },
  { id: 'linkedin', label: 'LinkedIn', url: SOCIAL_LINKS.linkedin },
  { id: 'instagram', label: 'Instagram', url: SOCIAL_LINKS.instagram },
  { id: 'github', label: 'GitHub', url: SOCIAL_LINKS.github },
  { id: 'games', label: 'Games', url: SOCIAL_LINKS.games },
];
