import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Work from './Work';

describe('Work', () => {
  it('renders the section heading', () => {
    render(<Work />);
    expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
  });

  it('renders each work experience entry', () => {
    render(<Work />);
    expect(screen.getByText('Associate Analyst')).toBeInTheDocument();
    expect(screen.getAllByText(/United Airlines/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Software Development Engineer Intern')).toBeInTheDocument();
    expect(screen.getAllByText(/zHealth/i).length).toBeGreaterThan(0);
  });
});
