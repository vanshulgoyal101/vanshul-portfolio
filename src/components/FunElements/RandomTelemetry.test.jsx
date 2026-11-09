import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RandomTelemetry from './RandomTelemetry';

// mulberry32: a tiny seeded generator, so long "random" runs are reproducible.
const seededRandom = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const renderTelemetry = () => {
  const { container, unmount } = render(<RandomTelemetry />);
  return { overlay: container.firstChild, unmount };
};

const advance = (ms) => act(() => vi.advanceTimersByTime(ms));

// Elements are appended in spawn order, so new nodes found after each step are
// the spawns of that step, in order.
const recordSpawns = (overlay, { duration, step }) => {
  const seen = new WeakSet();
  const spawned = [];
  for (let elapsed = 0; elapsed < duration; elapsed += step) {
    advance(step);
    expect(overlay.children.length).toBeLessThanOrEqual(7);
    for (const node of overlay.children) {
      if (!seen.has(node)) {
        seen.add(node);
        spawned.push(node);
      }
    }
  }
  return spawned;
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('RandomTelemetry', () => {
  it('keeps the decorative layer out of the accessibility tree and out of the pointer’s way', () => {
    const { overlay } = renderTelemetry();
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toHaveStyle({ position: 'fixed', pointerEvents: 'none' });
  });

  it('eases in five elements, then adds one every 700 ms up to seven at a time', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { overlay } = renderTelemetry();
    const counts = [0, 350, 350, 350, 350].map((step) => {
      advance(step);
      return overlay.children.length;
    });
    expect(counts).toEqual([1, 2, 4, 5, 7]);
    advance(2100);
    expect(overlay.children).toHaveLength(7);
  });

  it('retires old elements to make room for fresh ones', () => {
    vi.spyOn(Math, 'random').mockImplementation(seededRandom(7));
    const { overlay } = renderTelemetry();
    const spawned = recordSpawns(overlay, { duration: 20000, step: 100 });
    expect(spawned.length).toBeGreaterThan(7);
    expect(spawned.slice(0, 7).some((node) => !overlay.contains(node))).toBe(true);
  });

  it('never repeats any of the seven most recently shown shapes', () => {
    vi.spyOn(Math, 'random').mockImplementation(seededRandom(42));
    const { overlay } = renderTelemetry();
    const shapes = recordSpawns(overlay, { duration: 240000, step: 350 }).map((node) => node.innerHTML);
    const repeats = shapes.filter((shape, index) => shapes.slice(Math.max(0, index - 7), index).includes(shape));
    expect(shapes.length).toBeGreaterThan(3 * 7);
    expect(repeats).toEqual([]);
  });

  it('places each element away from the three most recently used screen zones', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { overlay } = renderTelemetry();
    advance(1400);
    const spots = [...overlay.children].map((node) => `${node.style.top} ${node.style.left}`);
    for (let index = 3; index < spots.length; index++) {
      expect(new Set(spots.slice(index - 3, index + 1)).size).toBe(4);
    }
  });

  it('stops spawning and cancels every lifetime timer on unmount', () => {
    const { unmount } = renderTelemetry();
    advance(1400);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
