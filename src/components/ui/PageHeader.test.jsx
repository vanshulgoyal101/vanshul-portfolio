import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  it('renders the label, a single h1, the lede and extras in order', () => {
    render(
      <PageHeader id="top" label="Archive" title="Writings" lede="Essays and notes.">
        <a href="/feed.xml">RSS feed</a>
      </PageHeader>
    );
    const header = document.getElementById('top');
    expect(header.tagName).toBe('HEADER');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect([...header.children].map((child) => child.textContent)).toEqual(['Archive', 'Writings', 'Essays and notes.', 'RSS feed']);
  });

  it('renders just the title when nothing else is given', () => {
    const { container } = render(<PageHeader title="From My Shelf" />);
    expect(container.querySelector('header').children).toHaveLength(1);
  });
});
