import { describe, it, expect } from 'vitest';
import { FEATURED_PROJECTS } from './projects';
import { PROJECT_STORIES, PROJECT_PAGES, getProjectPage } from './projectStories';

const storyText = (story) => JSON.stringify(story);

describe('project stories', () => {
  it('gives every featured project a page, in homepage order', () => {
    expect(PROJECT_PAGES.map((page) => page.id)).toEqual(FEATURED_PROJECTS.map((project) => project.id));
    expect(Object.keys(PROJECT_STORIES).sort()).toEqual(FEATURED_PROJECTS.map((project) => project.id).sort());
  });

  it('merges the project data with its story, path and title', () => {
    const page = getProjectPage('nasa-herc');
    expect(page).toMatchObject({
      id: 'nasa-herc',
      title: 'NASA Human Exploration Rover Challenge',
      path: '/projects/nasa-herc/',
      pageTitle: 'NASA HERC 2023: leading team Godspeed — Vanshul Goyal',
    });
    expect(page.story).toBe(PROJECT_STORIES['nasa-herc']);
    expect(page.caseStudy).toBe(FEATURED_PROJECTS.find((project) => project.id === 'nasa-herc').caseStudy);
  });

  it('returns null for ids without a page, including inherited object keys', () => {
    for (const id of ['not-a-project', 'constructor', 'toString', '__proto__', '', undefined]) {
      expect(getProjectPage(id)).toBeNull();
    }
  });

  it('gives each page a unique title and a search-length description', () => {
    const titles = PROJECT_PAGES.map((page) => page.pageTitle);
    const descriptions = PROJECT_PAGES.map((page) => page.story.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const description of descriptions) {
      expect(description.length).toBeGreaterThanOrEqual(70);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });

  it('has a summary, facts, story sections and a labelled link for every page', () => {
    for (const { story, link } of PROJECT_PAGES) {
      expect(story.summary.length).toBeGreaterThan(80);
      expect(story.facts.length).toBeGreaterThan(0);
      expect(story.sections.length).toBeGreaterThan(0);
      for (const section of story.sections) {
        expect(section.heading).toBeTruthy();
        expect(section.paragraphs.length).toBeGreaterThan(0);
      }
      expect(story.linkLabel).toBeTruthy();
      expect(link).toMatch(/^https:\/\//);
      if (story.repo) expect(story.repo).toMatch(/^https:\/\/github\.com\/vanshulgoyal101\//);
      expect(story.about.url).toMatch(/^https:\/\//);
    }
  });

  it('tells the HERC story with its stated limits', () => {
    const text = storyText(PROJECT_STORIES['nasa-herc']);
    for (const fact of ['Godspeed', 'team of six', 'top 61', 'Top 20', 'Marshall Space Flight Center', 'Huntsville', '$30,000', '12,000', 'checked luggage', 'partial']) {
      expect(text).toContain(fact);
    }
    // The sample-collection tool was team work.
    expect(text).toContain('The team built a sample-collection tool');
  });

  it('counts the arcade as 12 games', () => {
    const text = storyText(PROJECT_STORIES['tiny-arcade']);
    expect(text).toContain('12');
    expect(text).not.toMatch(/\b11\b/);
  });

  it('keeps private material off the public pages', () => {
    const text = storyText(PROJECT_STORIES);
    for (const term of [/\bYC\b/, /Y Combinator/i, /master'?s/i, /United Airlines/i, /Solaride/i, /pilot/i, /customer/i, /revenue/i]) {
      expect(text).not.toMatch(term);
    }
    expect(storyText(PROJECT_STORIES.adbrain)).not.toContain('₹');
  });
});
