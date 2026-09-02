import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Hero from './Hero';

// Keep the suite hermetic: the real scene pulls in three.js.
vi.mock('./HeroScene', () => ({
  default: () => <div data-testid="hero-scene" />,
}));

describe('Hero', () => {
  it('renders the name and the primary calls to action', () => {
    render(<Hero />);
    expect(screen.getByText('Vanshul Goyal')).toBeInTheDocument();
    expect(screen.getByText('Explore My Work')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('labels every social link for assistive tech', () => {
    render(<Hero />);
    ['Twitter', 'LinkedIn', 'Instagram', 'GitHub', 'Games'].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('points the calls to action at real in-page sections', () => {
    render(<Hero />);
    expect(screen.getByText('Explore My Work').closest('a')).toHaveAttribute('href', '#work');
    expect(screen.getByText('Get In Touch').closest('a')).toHaveAttribute('href', '#contact');
  });

  it('mounts the decorative 3D scene when motion is allowed', async () => {
    render(<Hero />);
    await waitFor(() =>
      expect(screen.getByTestId('hero-scene')).toBeInTheDocument()
    );
  });

  it('never loads the 3D scene for reduced-motion visitors', async () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<Hero />);

    expect(screen.getByText('Vanshul Goyal')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('hero-scene')).toBeNull()
    );
  });
});
