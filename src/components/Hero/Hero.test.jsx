import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import Hero from './Hero';
import { MemoryRouter } from 'react-router-dom';

// Keep the suite hermetic: the real scene pulls in three.js.
vi.mock('./HeroScene', () => ({
  default: () => <div data-testid="hero-scene" />,
}));

vi.mock('../FunElements/FloatingRocket', () => ({
  default: () => <div data-testid="floating-rocket" />,
}));

// The scene and rocket resolve lazily; settle them inside act().
const renderHero = async () => {
  const result = render(<MemoryRouter><Hero /></MemoryRouter>);
  await act(async () => {});
  return result;
};

describe('Hero', () => {
  it('renders the name and the primary calls to action', async () => {
    await renderHero();
    expect(screen.getByText('Vanshul Goyal')).toBeInTheDocument();
    expect(screen.getByText('Explore My Work')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('labels every social link for assistive tech', async () => {
    await renderHero();
    ['Twitter', 'LinkedIn', 'Instagram', 'GitHub', 'Games'].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('points the calls to action at real in-page sections', async () => {
    await renderHero();
    expect(screen.getByText('Explore My Work').closest('a')).toHaveAttribute('href', '/#projects');
    expect(screen.getByText('Get In Touch').closest('a')).toHaveAttribute('href', '/#contact');
  });

  it('does not mount expensive decoration on initial render', async () => {
    await renderHero();
    expect(screen.queryByTestId('hero-scene')).toBeNull();
    expect(screen.queryByTestId('floating-rocket')).toBeNull();
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

    await renderHero();

    expect(screen.getByText('Vanshul Goyal')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('hero-scene')).toBeNull()
    );
  });
});
