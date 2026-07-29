import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Magnetic from './Magnetic';

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
});
