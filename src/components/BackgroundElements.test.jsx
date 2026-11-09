import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BackgroundElements from './BackgroundElements';

describe('BackgroundElements', () => {
  it('is hidden from assistive tech', () => {
    const { container } = render(<BackgroundElements />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('stays fixed behind content without intercepting pointer events', () => {
    const { container } = render(<BackgroundElements />);
    expect(container.firstChild).toHaveStyle({ position: 'fixed', pointerEvents: 'none', zIndex: '0' });
  });
});
