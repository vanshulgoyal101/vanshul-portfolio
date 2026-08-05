// Centralized, dependency-free site configuration. Imported by both the React
// app (via Vite) and the Node build scripts (sitemap/feed/prerender), so the
// canonical URL, author identity, and social profiles live in exactly one place.

export const SITE_URL = 'https://vanshul.com';
export const AUTHOR_NAME = 'Vanshul Goyal';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Social profiles keyed by platform. `games` is a product link, not an identity
// profile, so it is intentionally excluded from `AUTHOR_SAME_AS` below.
export const SOCIAL_LINKS = {
  twitter: 'https://x.com/goyal_vanshul',
  linkedin: 'https://www.linkedin.com/in/vanshul-goyal00/',
  instagram: 'https://www.instagram.com/vanshul_goyal/',
  github: 'https://github.com/vanshulgoyal101',
  games: 'https://games.vanshul.com',
};

// schema.org `sameAs` — the canonical set of profiles that identify the author,
// used for Person/BlogPosting structured data.
export const AUTHOR_SAME_AS = [
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.twitter,
  SOCIAL_LINKS.instagram,
];
