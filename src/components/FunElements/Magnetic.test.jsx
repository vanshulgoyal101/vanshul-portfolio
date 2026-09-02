import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Magnetic from './Magnetic';

const setMatchMedia = ({ hover = true, reducedMotion = false }) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : hover,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Magnetic', () => {
  it('renders its children', () => {
    render(
      <Magnetic>
        <button>Click me</button>
      </Magnetic>
    );
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders children as a plain fragment when hover pointer is unsupported', () => {
    // matchMedia mock returns matches:false, so the magnetic wrapper is skipped
    render(
      <Magnetic>
        <span>plain</span>
      </Magnetic>
    );
    expect(screen.getByText('plain')).toBeInTheDocument();
  });

  it('renders text children', () => {
    render(<Magnetic>hello world</Magnetic>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('skips the magnetic wrapper for reduced-motion visitors', () => {
    setMatchMedia({ hover: true, reducedMotion: true });
    const { container } = render(
      <Magnetic>
        <span>calm</span>
      </Magnetic>
    );
    expect(screen.getByText('calm')).toBeInTheDocument();
    expect(container.querySelector('div')).toBeNull();
  });

  it('wraps children once the pointer supports hover and motion is allowed', () => {
    setMatchMedia({ hover: true, reducedMotion: false });
    const { container } = render(
      <Magnetic>
        <span>pulled</span>
      </Magnetic>
    );
    expect(container.querySelector('div')).not.toBeNull();
  });
});
