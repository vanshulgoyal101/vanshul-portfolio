import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from './Projects';

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
    expect(screen.getByText(/Tiny Arcade/i)).toBeInTheDocument();
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
});
