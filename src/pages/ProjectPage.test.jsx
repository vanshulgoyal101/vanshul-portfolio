import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectPage from './ProjectPage';
import { CASE_STUDY_FIELDS } from '../constants/projects';
import { PROJECT_PAGES, getProjectPage } from '../constants/projectStories';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );

const head = (selector, attribute = 'content') => document.head.querySelector(selector)?.getAttribute(attribute);

describe('ProjectPage', () => {
  it.each(PROJECT_PAGES.map((page) => [page.id, page]))('renders the full story for %s', (_id, page) => {
    renderAt(page.path);
    const main = screen.getByRole('main');
    expect(within(main).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: page.title })).toBeInTheDocument();
    expect(screen.getByText(page.role)).toBeInTheDocument();
    expect(screen.getByText(page.story.summary)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: page.title })).toHaveAttribute('src', page.image);

    const facts = screen.getByRole('region', { name: 'Key facts' });
    for (const fact of [...page.stats.map((stat) => stat.text), ...page.story.facts]) {
      expect(within(facts).getByText(fact)).toBeInTheDocument();
    }

    const caseStudy = screen.getByRole('region', { name: 'In short' });
    for (const [field, label] of CASE_STUDY_FIELDS) {
      expect(within(caseStudy).getByText(label)).toBeInTheDocument();
      expect(within(caseStudy).getByText(page.caseStudy[field])).toBeInTheDocument();
    }

    for (const section of page.story.sections) {
      const region = screen.getByRole('region', { name: section.heading });
      for (const paragraph of section.paragraphs) expect(within(region).getByText(paragraph)).toBeInTheDocument();
    }

    const live = screen.getByRole('link', { name: page.story.linkLabel });
    expect(live).toHaveAttribute('href', page.link);
    expect(live).toHaveAttribute('target', '_blank');
    expect(live.getAttribute('rel')).toContain('noopener');
    if (page.story.repo) expect(screen.getByRole('link', { name: 'Source code' })).toHaveAttribute('href', page.story.repo);
    else expect(screen.queryByRole('link', { name: 'Source code' })).toBeNull();
  });

  it('links to the other featured stories and back to the homepage list', () => {
    const page = getProjectPage('adbrain');
    renderAt(page.path);
    const more = screen.getByRole('navigation', { name: 'More projects' });
    const others = PROJECT_PAGES.filter((other) => other.id !== page.id);
    const links = within(more).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([...others.map((other) => other.path), '/#projects']);
    expect(within(more).queryByRole('link', { name: new RegExp(`^${page.title}`) })).toBeNull();
    expect(screen.getByRole('link', { name: 'All projects' })).toHaveAttribute('href', '/#projects');
  });

  it('publishes its own title, description, canonical URL and structured data', async () => {
    const page = getProjectPage('nasa-herc');
    renderAt(page.path);
    await waitFor(() => expect(document.title).toBe(page.pageTitle));
    expect(head('meta[name="description"]')).toBe(page.story.description);
    expect(head('link[rel="canonical"]', 'href')).toBe('https://vanshul.com/projects/nasa-herc/');
    expect(head('meta[property="og:url"]')).toBe('https://vanshul.com/projects/nasa-herc/');
    expect(head('meta[name="twitter:title"]')).toBe(page.pageTitle);
    expect(head('meta[name="robots"]') ?? '').not.toMatch(/noindex/);
    const types = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((script) => [JSON.parse(script.textContent)].flat())
      .map((schema) => schema['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebPage', 'BreadcrumbList']));
  });

  it('renders the noindex 404 state for an unknown project', async () => {
    renderAt('/projects/not-a-project/');
    expect(screen.getByRole('heading', { level: 1, name: /wandered off/i })).toBeInTheDocument();
    await waitFor(() => expect(head('meta[name="robots"]')).toMatch(/noindex/));
  });
});
