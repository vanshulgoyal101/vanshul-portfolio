import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InteractiveSpaceBackground from './InteractiveSpaceBackground';

const frames = new Map();
let nextFrame;
let hidden;
let context;

beforeEach(() => {
  vi.useFakeTimers();
  frames.clear();
  nextFrame = 0;
  hidden = false;
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
  context = new Proxy({}, {
    get: (target, property) => {
      if (!(property in target)) target[property] = vi.fn(() => ({ addColorStop: vi.fn() }));
      return target[property];
    },
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  vi.stubGlobal('requestAnimationFrame', callback => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal('cancelAnimationFrame', handle => frames.delete(handle));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const visibility = value => act(() => {
  hidden = value;
  document.dispatchEvent(new Event('visibilitychange'));
});

const frame = () => act(() => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(callback => callback(performance.now()));
});

// Randomly placed stars rarely fall within linking distance of each other on a
// large viewport, which keeps per-frame constellation drawing (and the mock call
// log) small for tests that need many frames.
const roomyViewport = () => {
  vi.stubGlobal('innerWidth', 10000);
  vi.stubGlobal('innerHeight', 10000);
};

describe('InteractiveSpaceBackground', () => {
  it('does not draw or queue frames when mounted in a hidden tab', () => {
    hidden = true;
    render(<InteractiveSpaceBackground />);
    expect(frames.size).toBe(0);
    expect(context.clearRect).not.toHaveBeenCalled();
    const random = vi.spyOn(Math, 'random');
    act(() => vi.advanceTimersByTime(12000));
    expect(random).not.toHaveBeenCalled();
    visibility(false);
    expect(frames.size).toBe(1);
    frame();
    expect(context.clearRect).toHaveBeenCalledTimes(1);
  });

  it('keeps exactly one loop through repeated visibility events', () => {
    render(<InteractiveSpaceBackground />);
    visibility(false);
    visibility(false);
    expect(frames.size).toBe(1);
    frame();
    expect(context.clearRect).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(1);
    visibility(true);
    expect(frames.size).toBe(0);
    visibility(false);
    visibility(false);
    frame();
    expect(context.clearRect).toHaveBeenCalledTimes(2);
    expect(frames.size).toBe(1);
  });

  it('cancels frames, intervals and visibility listeners on unmount', () => {
    const { unmount } = render(<InteractiveSpaceBackground />);
    unmount();
    visibility(false);
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not start when a canvas context is unavailable', () => {
    HTMLCanvasElement.prototype.getContext.mockReturnValue(null);
    render(<InteractiveSpaceBackground />);
    visibility(false);
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('stays still for reduced-motion visitors', () => {
    window.matchMedia = vi.fn((query) => ({ matches: query.includes('prefers-reduced-motion') }));
    render(<InteractiveSpaceBackground />);
    visibility(false);
    act(() => window.dispatchEvent(new MouseEvent('click', { clientX: 10, clientY: 10 })));
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(context.clearRect).not.toHaveBeenCalled();
  });

  it('covers the viewport plus a 100px strip above it and follows resizes', () => {
    const { container, unmount } = render(<InteractiveSpaceBackground />);
    const canvas = container.querySelector('canvas');
    expect([canvas.width, canvas.height]).toEqual([window.innerWidth, window.innerHeight + 100]);
    vi.stubGlobal('innerWidth', 640);
    vi.stubGlobal('innerHeight', 480);
    act(() => window.dispatchEvent(new Event('resize')));
    expect([canvas.width, canvas.height]).toEqual([640, 580]);
    unmount();
    vi.stubGlobal('innerWidth', 320);
    act(() => window.dispatchEvent(new Event('resize')));
    expect(canvas.width).toBe(640);
  });

  it('marks a click with a radar ring and coordinate readout that fades away', () => {
    roomyViewport();
    render(<InteractiveSpaceBackground />);
    act(() => window.dispatchEvent(new MouseEvent('click', { clientX: 5000, clientY: 4950 })));
    frame();
    expect(context.fillText).toHaveBeenCalledWith('TRK_LOC [50%, 50%]', expect.any(Number), expect.any(Number));
    for (let count = 0; count < 60; count++) frame();
    context.fillText.mockClear();
    frame();
    expect(context.fillText).not.toHaveBeenCalled();
  });

  it('streaks at most three shooting stars at once and none while the tab is hidden', () => {
    roomyViewport();
    const random = vi.spyOn(Math, 'random');
    render(<InteractiveSpaceBackground />);
    random.mockReturnValue(0.9);
    visibility(true);
    act(() => vi.advanceTimersByTime(8000));
    visibility(false);
    frame();
    expect(context.createLinearGradient).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(16000));
    frame();
    expect(context.createLinearGradient).toHaveBeenCalledTimes(3);
  });
});