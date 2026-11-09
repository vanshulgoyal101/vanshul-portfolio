import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import About from './About';
import { PROFILE } from '../../constants/profile';

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

  it('shows a placeholder until the profile photo loads, then reveals the photo', () => {
    render(<About />);
    const photo = screen.getByRole('img', { name: PROFILE.photoAlt });
    const frame = photo.parentElement;
    expect(photo).toHaveStyle({ opacity: '0' });
    expect(frame.querySelector('svg')).not.toBeNull();

    fireEvent.load(photo);
    expect(photo).toHaveStyle({ opacity: '1' });
    expect(frame.querySelector('svg')).toBeNull();
  });

  it('keeps the placeholder when the profile photo fails to load', () => {
    render(<About />);
    const photo = screen.getByRole('img', { name: PROFILE.photoAlt });
    const frame = photo.parentElement;
    fireEvent.error(photo);
    expect(screen.queryByRole('img', { name: PROFILE.photoAlt })).toBeNull();
    expect(frame.querySelector('svg')).not.toBeNull();
  });
});
