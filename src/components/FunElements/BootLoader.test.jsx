import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import BootLoader from './BootLoader';

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('BootLoader', () => {
  it('shows a greeting on mount', () => {
    const { container } = render(<BootLoader onComplete={() => {}} />);
    expect(container.textContent.trim().length).toBeGreaterThan(0);
  });

  it('cycles eight greetings, ends with Welcome, and completes once after fading', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { container, unmount } = render(<BootLoader onComplete={onComplete} />);
    const greetings = new Set();
    for (let step = 0; step < 8; step++) {
      greetings.add(container.querySelector('[data-greeting-word]').textContent);
      act(() => vi.advanceTimersByTime(220));
    }
    expect(greetings.size).toBe(8);
    expect(container.querySelector('[data-greeting-word]')).toHaveTextContent('Welcome');
    act(() => vi.advanceTimersByTime(440));
    expect(onComplete).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(500));
    expect(onComplete).toHaveBeenCalledTimes(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels every scheduled greeting when unmounted early', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { unmount } = render(<BootLoader onComplete={onComplete} />);
    act(() => vi.advanceTimersByTime(660));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(5000));
    expect(onComplete).not.toHaveBeenCalled();
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
