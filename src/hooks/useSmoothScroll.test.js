import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useSmoothScroll, {
  scrollToTop,
  scrollToElement,
  getScrollProgress,
} from './useSmoothScroll';

describe('useSmoothScroll (default hook)', () => {
  it('returns the expected shape', () => {
    const { result } = renderHook(() => useSmoothScroll());
    const api = result.current;
    expect(api).toHaveProperty('scrollTo');
    expect(api).toHaveProperty('start');
    expect(api).toHaveProperty('stop');
    expect(api).toHaveProperty('destroy');
    expect(api).toHaveProperty('updateOptions');
    expect(api).toHaveProperty('isSupported');
    expect(api).toHaveProperty('getInstance');
    expect(api).toHaveProperty('scrollState');
    expect(api).toHaveProperty('scrollProgress');
  });

  it('exposes no-op lifecycle methods that do not throw', () => {
    const { result } = renderHook(() => useSmoothScroll());
    expect(() => result.current.start()).not.toThrow();
    expect(() => result.current.stop()).not.toThrow();
    expect(() => result.current.destroy()).not.toThrow();
    expect(() => result.current.updateOptions()).not.toThrow();
  });

  it('reports supported and a null instance', () => {
    const { result } = renderHook(() => useSmoothScroll());
    expect(result.current.isSupported()).toBe(true);
    expect(result.current.getInstance()).toBeNull();
  });

  it('provides a neutral initial scroll state', () => {
    const { result } = renderHook(() => useSmoothScroll());
    expect(result.current.scrollState).toEqual({
      progress: 0,
      direction: 0,
      velocity: 0,
      isScrolling: false,
    });
    expect(result.current.scrollProgress).toBe(0);
  });

  it('scrollTo scrolls a matching element into view', () => {
    const el = document.createElement('div');
    el.id = 'target-section';
    const spy = vi.fn();
    el.scrollIntoView = spy;
    document.body.appendChild(el);

    const { result } = renderHook(() => useSmoothScroll());
    result.current.scrollTo('target-section');

    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(el);
  });

  it('scrollTo does nothing for a non-string target', () => {
    const { result } = renderHook(() => useSmoothScroll());
    expect(() => result.current.scrollTo(123)).not.toThrow();
  });

  it('scrollTo does nothing when the element is missing', () => {
    const { result } = renderHook(() => useSmoothScroll());
    expect(() => result.current.scrollTo('missing-element')).not.toThrow();
  });
});

describe('scrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('scrolls the window to the top smoothly', () => {
    scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

describe('scrollToElement', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.pageYOffset = 100;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when element is null', () => {
    scrollToElement(null);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls to the element position accounting for offset', () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 200 });
    scrollToElement(el, 50);
    // 200 (top) + 100 (pageYOffset) - 50 (offset) = 250
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 250, behavior: 'smooth' });
  });

  it('defaults the offset to zero', () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 300 });
    scrollToElement(el);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 400, behavior: 'smooth' });
  });
});

describe('getScrollProgress', () => {
  it('computes the scroll progress ratio', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(500);
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1500,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });

    // 250 / (1500 - 500) = 0.25
    expect(getScrollProgress()).toBeCloseTo(0.25);
  });
});
