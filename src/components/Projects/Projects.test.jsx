import { describe, it, expect } from 'vitest';
import { fireEvent, render as renderInDom, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects';
import { FEATURED_PROJECTS } from '../../constants/projects';

// Story links are router links, so the section renders inside a router.
const render = (ui) => renderInDom(ui, { wrapper: MemoryRouter });

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: 'Featured Projects' })).toBeInTheDocument();
  });

  it('renders each featured project title', () => {
    render(<Projects />);
    expect(screen.getByText('AdBrain')).toBeInTheDocument();
    expect(screen.getByText('NASA Human Exploration Rover Challenge')).toBeInTheDocument();
    expect(screen.getByText('NASA Space Apps Collective')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Tiny Arcade/i })).toBeInTheDocument();
  });

  it('shows the canonical AdBrain icon without duplicating its accessible name', () => {
    render(<Projects />);
    const heading = screen.getByRole('heading', { name: 'AdBrain', exact: true });
    const mark = heading.querySelector('img');
    expect(mark).toHaveAttribute('src', '/images/projects/adbrain-icon.svg');
    expect(mark).toHaveAttribute('alt', '');
    expect(mark).toHaveAttribute('width', '28');
    expect(mark).toHaveAttribute('height', '28');
    expect(screen.getByRole('img', { name: 'AdBrain', exact: true })).toHaveAttribute('src', '/images/projects/adbrain.webp?v=99a19eb');
  });

  it('links each featured project to its full story and keeps the directory secondary', () => {
    const { container } = render(<Projects />);
    for (const project of FEATURED_PROJECTS) {
      const link = screen.getByRole('link', { name: `Read the full story: ${project.title}` });
      expect(link).toHaveAttribute('href', `/projects/${project.id}/`);
      expect(link).toHaveTextContent('Read the full story');
      expect(link).not.toHaveAttribute('target');
    }
    // The case study now lives on the project page, not in a card disclosure.
    expect([...container.querySelectorAll('details')].filter(detail => detail.querySelector('dl'))).toHaveLength(0);
    expect(screen.getByRole('region', { name: "More things I've built" })).not.toHaveAttribute('open');
  });

  it('renders the compact "more projects" tier with grouped categories', () => {
    render(<Projects />);
    expect(screen.getByText('Live products & tools')).toBeInTheDocument();
    expect(screen.getByText('Open source & packages')).toBeInTheDocument();
    expect(screen.getByText('ctx')).toBeInTheDocument();
    expect(screen.getByText('The Dialectic')).toBeInTheDocument();
  });

  it('links compact projects to their GitHub repos', () => {
    const { container } = render(<Projects />);
    const repoLinks = [...container.querySelectorAll('a[href*="github.com"]')];
    expect(repoLinks.length).toBeGreaterThan(0);
  });

  it('keeps secondary projects collapsed until expanded and allows closing again', () => {
    render(<Projects />);
    const directory = screen.getByRole('region', { name: "More things I've built" });
    const toggle = directory.querySelector('summary');
    expect(screen.getByText('Solaride')).not.toBeVisible();
    fireEvent.click(toggle);
    expect(directory).toHaveAttribute('open');
    for (const name of [
      'Solaride', 'ctx', 'Dev Tools', 'SemCache', 'Agent Vault', 'Agent Mailroom',
      'depshift', 'AgentWatch', 'Lego', 'Agent Team', 'vbrain', 'The Dialectic',
      'Cosmic Zoom', 'Lexis', 'Memova', 'NASA Space Apps Collective', 'GoRemote',
    ]) {
      expect(screen.getByRole('heading', { name, exact: true })).toBeVisible();
    }
    expect(screen.getByRole('link', { name: 'Visit Solaride' })).toHaveAttribute('href', 'https://solaride.in');
    expect(screen.getByRole('link', { name: 'View ctx source code' })).toHaveAttribute('href', 'https://github.com/vanshulgoyal101/ctx');
    fireEvent.click(toggle);
    expect(directory).not.toHaveAttribute('open');
    expect(screen.getByText('Solaride')).not.toBeVisible();
  });

  it('renders external project links safely (rel=noopener, target=_blank)', () => {
    const { container } = render(<Projects />);
    const externalLinks = [...container.querySelectorAll('a[href^="http"]')];
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const a of externalLinks) {
      if (a.getAttribute('target') === '_blank') {
        expect(a.getAttribute('rel') || '').toContain('noopener');
      }
    }
  });

  it('swaps a screenshot that fails to load for the project icon', () => {
    render(<Projects />);
    const name = 'NASA Human Exploration Rover Challenge';
    const screenshot = screen.getByRole('img', { name });
    const frame = screenshot.parentElement;
    fireEvent.error(screenshot);
    expect(screen.queryByRole('img', { name })).toBeNull();
    expect(frame.querySelector('svg')).not.toBeNull();
  });
});
