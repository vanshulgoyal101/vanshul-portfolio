import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { prerenderContent } from './prerenderContent.mjs';
import { BOOKS, ESSAYS } from '../../src/constants/books.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY } from '../../src/constants/projects.js';
import { EXPERIENCE } from '../../src/constants/experience.js';
import { PROFILE, HIGHLIGHTS, SKILL_GROUPS } from '../../src/constants/profile.js';
import { SOCIAL_PROFILES } from '../../src/constants/siteConfig.js';

const posts = [{ slug: 'example', title: 'An example', summary: 'A summary', body: '## A section\n\nActual **article** text.\n\n[Unsafe](javascript:alert%281%29)\n\n<script>alert(1)</script>' }];
const parse = options => new JSDOM(prerenderContent(options)).window.document;

describe('crawler-readable content', () => {
  it('renders article content with semantic headings and safe Markdown', () => {
    const document = parse({ post: posts[0], posts });
    expect(document.querySelector('h1').textContent).toBe('An example');
    expect(document.querySelector('article strong').textContent).toBe('article');
    expect(document.querySelector('script')).toBeNull();
    expect([...document.querySelectorAll('a')].some(anchor => anchor.href.startsWith('javascript:'))).toBe(false);
  });
  it('publishes homepage and index links without requiring JavaScript', () => {
    for (const page of ['home', 'blog']) {
      const document = parse({ page, posts });
      expect(document.querySelector('a[href="/blog/example/"]').textContent).toBe('An example');
      expect(document.querySelectorAll('h1')).toHaveLength(1);
      expect(document.querySelector('main')).not.toBeNull();
    }
  });
  it('publishes both shelf collections and preserves all essay destinations', () => {
    const document = parse({ page: 'reading-list' });
    expect(document.querySelectorAll('#books li')).toHaveLength(BOOKS.length);
    expect(document.querySelectorAll('#essays li')).toHaveLength(ESSAYS.length);
    expect([...document.querySelectorAll('#essays a')].map(anchor => anchor.href)).toEqual(ESSAYS.map(essay => essay.url));
  });
  it('escapes authored titles and attributes instead of interpreting HTML', () => {
    const document = parse({ posts: [{ slug: 'quoted"slug', title: '<img src=x onerror=alert(1)>', summary: '<script>bad</script>' }] });
    expect(document.querySelector('img, script')).toBeNull();
    expect(document.querySelector('main a[href*="quoted"]').getAttribute('href')).toBe('/blog/quoted"slug/');
  });
  it('publishes the full homepage content from the shared data modules', () => {
    const document = parse({ page: 'home', posts });
    const text = document.querySelector('main').textContent;
    const headings = [...document.querySelectorAll('h2')].map(heading => heading.textContent);
    expect(headings).toEqual(['Featured Projects', 'About Me', 'Work Experience', 'Writings', 'Get In Touch']);
    for (const project of FEATURED_PROJECTS) {
      expect(text).toContain(project.title);
      expect(text).toContain(project.description);
      expect(text).toContain(project.caseStudy.outcome);
      expect(document.querySelector(`a[href="${project.link}"]`)).not.toBeNull();
    }
    for (const item of PROJECT_DIRECTORY.flatMap(group => group.items)) {
      expect(text).toContain(item.title);
      expect(text).toContain(item.desc);
    }
    for (const job of EXPERIENCE) {
      expect(text).toContain(job.title);
      expect(text).toContain(job.description);
    }
    for (const highlight of HIGHLIGHTS) expect(text).toContain(highlight.label);
    for (const skill of SKILL_GROUPS.flatMap(group => group.skills)) expect(text).toContain(skill);
    expect(text).toContain(PROFILE.education.school);
    expect(text).toContain(PROFILE.summary);
    for (const profile of SOCIAL_PROFILES) expect(document.querySelector(`a[href="${profile.url}"]`)).not.toBeNull();
  });
});
