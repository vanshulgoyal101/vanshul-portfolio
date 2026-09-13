import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as motion from 'framer-motion';
import FloatingRocket from './FloatingRocket';

let resolveShake;
let resolveFlight;
let controls;

beforeEach(() => {
  vi.useFakeTimers();
  controls = {
    start: vi.fn(animation => {
      if (animation.x) return new Promise(resolve => { resolveShake = resolve; });
      if (typeof animation.y === 'number') return new Promise(resolve => { resolveFlight = resolve; });
      return Promise.resolve();
    }),
    set: vi.fn(),
    stop: vi.fn(),
  };
  vi.spyOn(motion, 'useAnimation').mockReturnValue(controls);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const launch = () => {
  for (let tap = 0; tap < 3; tap++) fireEvent.click(screen.getByRole('button'));
};

describe('FloatingRocket', () => {
  it('supports native keyboard activation and resets incomplete tap sequences', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const { unmount } = render(<FloatingRocket />);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button')).toHaveAccessibleName('Launch rocket: 2 taps remaining');
    unmount();
    vi.useFakeTimers();
    const countdown = render(<FloatingRocket />);
    fireEvent.click(screen.getByRole('button'));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole('button')).toHaveAccessibleName('Launch rocket: 3 taps remaining');
    countdown.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not start tracking when unmounted during the shake', async () => {
    const frames = vi.spyOn(window, 'requestAnimationFrame');
    const { unmount } = render(<FloatingRocket />);
    launch();
    unmount();
    await act(async () => resolveShake());
    expect(frames).not.toHaveBeenCalled();
    expect(controls.stop).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels tracking and ignores flight completion after unmount', async () => {
    const frames = vi.spyOn(window, 'requestAnimationFrame');
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<FloatingRocket />);
    launch();
    await act(async () => resolveShake());
    expect(frames).toHaveBeenCalled();
    const frame = frames.mock.results.at(-1).value;
    unmount();
    expect(cancel).toHaveBeenCalledWith(frame);
    await act(async () => resolveFlight());
    expect(vi.getTimerCount()).toBe(0);
    expect(controls.set).not.toHaveBeenCalled();
  });

  it('cancels the pending reset and emits only one launch per sequence', async () => {
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    const { unmount } = render(<FloatingRocket />);
    launch();
    fireEvent.click(screen.getByRole('button'));
    expect(dispatch.mock.calls.filter(([event]) => event.type === 'rocket-launch')).toHaveLength(1);
    await act(async () => resolveShake());
    await act(async () => resolveFlight());
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(1000));
    expect(controls.set).not.toHaveBeenCalled();
  });
});