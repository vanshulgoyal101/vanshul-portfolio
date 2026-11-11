import { describe, it, expect } from 'vitest';
import {
  HOME_PATH,
  BLOG_PATH,
  READING_LIST_PATH,
  postPath,
  projectPath,
  homeSectionPath,
  absoluteUrl,
} from './routes';
import { SITE_URL } from './siteConfig';

describe('routes', () => {
  it('uses trailing-slash paths for every prerendered directory route', () => {
    for (const path of [BLOG_PATH, READING_LIST_PATH, postPath('a-post'), projectPath('nasa-herc')]) {
      expect(path).toMatch(/^\/[a-z0-9/-]+\/$/);
    }
    expect(HOME_PATH).toBe('/');
  });

  it('builds post paths under the blog path', () => {
    expect(postPath('the-new-leverage')).toBe('/blog/the-new-leverage/');
  });

  it('builds project story paths', () => {
    expect(projectPath('nasa-herc')).toBe('/projects/nasa-herc/');
  });

  it('builds homepage section links', () => {
    expect(homeSectionPath('contact')).toBe('/#contact');
  });

  it('resolves absolute URLs against the site origin or an explicit one', () => {
    expect(absoluteUrl(BLOG_PATH)).toBe(`${SITE_URL}/blog/`);
    expect(absoluteUrl('/x/', 'https://example.com')).toBe('https://example.com/x/');
  });
});
