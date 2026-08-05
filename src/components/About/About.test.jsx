import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the section heading and subheadings', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
  });

  it('renders the author bio and key affiliations', () => {
    render(<About />);
    expect(screen.getAllByText(/Vanshul Goyal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/United Airlines/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/NASA/i).length).toBeGreaterThan(0);
  });

  it('renders the achievement stats', () => {
    render(<About />);
    expect(screen.getByText(/Top 20/i)).toBeInTheDocument();
  });
});
