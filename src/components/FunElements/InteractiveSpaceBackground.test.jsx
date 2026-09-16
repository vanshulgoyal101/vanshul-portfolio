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
});