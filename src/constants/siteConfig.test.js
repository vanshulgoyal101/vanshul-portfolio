import { describe, it, expect } from 'vitest';
import {
  SITE_URL,
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  SOCIAL_LINKS,
  AUTHOR_SAME_AS,
} from './siteConfig';

describe('siteConfig', () => {
  it('exposes the canonical site origin without a trailing slash', () => {
    expect(SITE_URL).toBe('https://vanshul.com');
    expect(SITE_URL.endsWith('/')).toBe(false);
  });

  it('derives the default OG image from the site URL', () => {
    expect(DEFAULT_OG_IMAGE).toBe(`${SITE_URL}/og-image.png`);
  });

  it('names the author', () => {
    expect(AUTHOR_NAME).toBe('Vanshul Goyal');
  });

  it('exposes valid absolute URLs for every social profile', () => {
    for (const url of Object.values(SOCIAL_LINKS)) {
      expect(() => new URL(url)).not.toThrow();
      expect(url.startsWith('https://')).toBe(true);
    }
  });

  it('includes identity profiles in sameAs but excludes the games product link', () => {
    expect(AUTHOR_SAME_AS).toContain(SOCIAL_LINKS.github);
    expect(AUTHOR_SAME_AS).toContain(SOCIAL_LINKS.linkedin);
    expect(AUTHOR_SAME_AS).toContain(SOCIAL_LINKS.twitter);
    expect(AUTHOR_SAME_AS).toContain(SOCIAL_LINKS.instagram);
    expect(AUTHOR_SAME_AS).not.toContain(SOCIAL_LINKS.games);
  });

  it('has no duplicate sameAs entries', () => {
    expect(new Set(AUTHOR_SAME_AS).size).toBe(AUTHOR_SAME_AS.length);
  });
});
