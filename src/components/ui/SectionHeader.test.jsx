import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  it('names the heading by its title alone while showing the numbered eyebrow', () => {
    render(<SectionHeader index="01" eyebrow="Selected work" title="Featured Projects" lede="Things I built." />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Featured Projects' });
    // The eyebrow sits inside the h2 so hash navigation keeps it in view.
    expect(heading).toHaveTextContent('01 / Selected work');
    expect(heading.querySelector('[aria-hidden="true"]')).toHaveTextContent('01 / Selected work');
  });

  it('places the lede paragraph directly after the heading', () => {
    render(<SectionHeader index="02" eyebrow="Background" title="About Me" lede="Engineer and learner." />);
    const lede = screen.getByRole('heading', { level: 2 }).nextElementSibling;
    expect(lede.tagName).toBe('P');
    expect(lede).toHaveTextContent('Engineer and learner.');
  });

  it('omits the lede when none is given', () => {
    render(<SectionHeader index="03" eyebrow="Experience" title="Work Experience" />);
    expect(screen.getByRole('heading', { level: 2 }).nextElementSibling).toBeNull();
  });
});
