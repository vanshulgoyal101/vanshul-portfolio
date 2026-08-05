import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import BootLoader from './BootLoader';

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe('BootLoader', () => {
  it('shows a greeting on mount', () => {
    const { container } = render(<BootLoader onComplete={() => {}} />);
    expect(container.textContent.trim().length).toBeGreaterThan(0);
  });

  it('skips the boot animation and completes immediately under reduced motion', async () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: /prefers-reduced-motion/.test(query),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));

    const onComplete = vi.fn();
    render(<BootLoader onComplete={onComplete} />);
    await waitFor(() => expect(onComplete).toHaveBeenCalled());
  });
});
