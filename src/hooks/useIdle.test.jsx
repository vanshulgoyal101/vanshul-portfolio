import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIdle } from './useIdle';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  delete window.requestIdleCallback;
  delete window.cancelIdleCallback;
});

describe('useIdle', () => {
  it('starts false and becomes true after the fallback timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdle(500));
    expect(result.current).toBe(false);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(true);
  });

  it('uses requestIdleCallback when the browser supports it', () => {
    const callbacks = [];
    window.requestIdleCallback = vi.fn((cb) => { callbacks.push(cb); return 42; });
    window.cancelIdleCallback = vi.fn();

    const { result } = renderHook(() => useIdle(1000));
    expect(window.requestIdleCallback).toHaveBeenCalledOnce();
    expect(result.current).toBe(false);

    act(() => callbacks.forEach((cb) => cb()));
    expect(result.current).toBe(true);
  });

  it('cancels the idle callback on unmount when supported', () => {
    window.requestIdleCallback = vi.fn(() => 7);
    window.cancelIdleCallback = vi.fn();
    const { unmount } = renderHook(() => useIdle());
    unmount();
    expect(window.cancelIdleCallback).toHaveBeenCalledWith(7);
  });

  it('clears the fallback timeout on unmount without throwing', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useIdle(1000));
    expect(() => unmount()).not.toThrow();
  });
});
