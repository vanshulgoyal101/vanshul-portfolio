import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BackgroundElements from './BackgroundElements';

describe('BackgroundElements', () => {
  it('renders a decorative element hidden from assistive tech', () => {
    const { container } = render(<BackgroundElements />);
    const el = container.firstChild;
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('is inert to pointer events so it never blocks content', () => {
    const { container } = render(<BackgroundElements $animated />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
