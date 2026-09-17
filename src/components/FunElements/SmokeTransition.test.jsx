import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../utils/scrollToSection', () => ({ scrollToSection: vi.fn() }));
import { scrollToSection } from '../../utils/scrollToSection';

let SmokeTransition;
let now;
let nextFrame;
const frames = new Map();
let context;

beforeEach(async () => {
  now = 0;
  nextFrame = 0;
  frames.clear();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  context = {
    clearRect: vi.fn(), save: vi.fn(), restore: vi.fn(), drawImage: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  vi.stubGlobal('requestAnimationFrame', callback => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal('cancelAnimationFrame', handle => frames.delete(handle));
  ({ default: SmokeTransition } = await import('./SmokeTransition'));
  vi.mocked(scrollToSection).mockClear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const launch = () => act(() => window.dispatchEvent(new Event('rocket-launch')));
const emit = (x = 200, y = 400) => act(() => window.dispatchEvent(new CustomEvent('rocket-emit-smoke', { detail: { x, y } })));
const tick = time => act(() => {
  now = time;
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach(callback => callback(now));
});

describe('SmokeTransition timing', () => {
  it('moves and grows particles equally at 30, 60 and 120fps', () => {
    const schedules = [30, 60, 120].map(rate => Array.from({ length: rate / 2 }, (_, index) => (index + 1) * 1000 / rate));
    schedules.push([16, 72, 90, 250, 500]);
    const positions = schedules.map(schedule => {
      const { unmount } = render(<SmokeTransition />);
      now = 0;
      launch();
      emit();
      schedule.forEach(tick);
      const position = context.drawImage.mock.lastCall.slice(1);
      unmount();
      return position;
    });
    for (const position of positions.slice(1)) {
      position.forEach((value, index) => expect(value).toBeCloseTo(positions[0][index], 6));
    }
  });

  it('emits a consistent density at different refresh rates', () => {
    const counts = [30, 60, 120].map(rate => {
      const { unmount } = render(<SmokeTransition />);
      now = 0;
      launch();
      emit();
      for (let step = 1; step <= rate / 2; step++) {
        now = step * 1000 / rate;
        emit();
      }
      context.drawImage.mockClear();
      tick(500);
      const count = context.drawImage.mock.calls.length / 2;
      unmount();
      return count;
    });
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
    expect(counts[0]).toBeGreaterThanOrEqual(60);
    expect(counts[0]).toBeLessThanOrEqual(62);
  });

  it('fills the segment between nozzle samples after a dropped frame', () => {
    render(<SmokeTransition />);
    launch();
    emit(100, 400);
    now = 50;
    emit(220, 280);
    tick(50);
    const centers = context.drawImage.mock.calls.map(call => call[1] + call[3] / 2);
    expect(centers.some(center => center > 100 && center < 220)).toBe(true);
    expect(Math.min(...centers)).toBeCloseTo(100);
  });

  it('expires old smoke after a stall and scrolls only once', () => {
    render(<SmokeTransition />);
    launch();
    emit();
    context.drawImage.mockClear();
    tick(3000);
    expect(context.drawImage).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
    expect(scrollToSection).toHaveBeenCalledExactlyOnceWith('about', { focus: true });
  });

  it('does not create a burst after a long emission gap and cleans up', () => {
    const { unmount } = render(<SmokeTransition />);
    launch();
    emit();
    now = 5000;
    emit();
    context.drawImage.mockClear();
    tick(5000);
    expect(context.drawImage).toHaveBeenCalledTimes(4);
    launch();
    unmount();
    expect(frames.size).toBe(0);
    emit();
    expect(frames.size).toBe(0);
  });
});