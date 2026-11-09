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
  it('counts activations within one render and launches only once', () => {
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    const { unmount } = render(<FloatingRocket />);
    const button = screen.getByRole('button');
    act(() => {
      for (let tap = 0; tap < 4; tap++) button.click();
    });
    expect(dispatch.mock.calls.filter(([event]) => event.type === 'rocket-launch')).toHaveLength(1);
    expect(button).toHaveAccessibleName('Rocket launching');
    unmount();
  });

  it('resumes floating after a partial tap bounce completes', async () => {
    const { unmount } = render(<FloatingRocket />);
    controls.start.mockClear();
    fireEvent.click(screen.getByRole('button'));
    await act(async () => {});
    expect(controls.start).toHaveBeenLastCalledWith(expect.objectContaining({
      y: [0, -10, 0],
      transition: expect.objectContaining({ repeat: Infinity }),
    }));
    unmount();
  });

  it('ignores old bounce completions after another tap, launch, or unmount', async () => {
    const { unmount } = render(<FloatingRocket />);
    const completions = [];
    controls.start.mockImplementation(animation => {
      if (animation.transition.duration === 0.3) {
        return new Promise(resolve => completions.push(resolve));
      }
      return new Promise(() => {});
    });
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    controls.start.mockClear();
    await act(async () => completions[0]());
    expect(controls.start).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    controls.start.mockClear();
    await act(async () => completions[1]());
    expect(controls.start).not.toHaveBeenCalled();
    unmount();

    const next = render(<FloatingRocket />);
    fireEvent.click(screen.getByRole('button'));
    next.unmount();
    controls.start.mockClear();
    await act(async () => completions[2]());
    expect(controls.start).not.toHaveBeenCalled();
  });

  it('emits smoke from the transformed exhaust anchor instead of the button bounds', async () => {
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    const { container, unmount } = render(<FloatingRocket />);
    const exhaust = container.querySelector('[data-rocket-exhaust]');
    vi.spyOn(exhaust, 'getBoundingClientRect').mockReturnValue({ left: 123, top: 456, width: 0, height: 0 });
    launch();
    await act(async () => resolveShake());
    const emissions = dispatch.mock.calls.map(([event]) => event).filter(event => event.type === 'rocket-emit-smoke');
    expect(emissions[0].detail).toEqual({ x: 123, y: 456 });
    expect(exhaust.querySelector('[data-rocket-flame]')).not.toBeNull();
    unmount();
  });

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
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Launch rocket: 2 taps remaining');
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

  it('returns to the pad after a flight and can launch again', async () => {
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    const { unmount } = render(<FloatingRocket />);
    launch();
    await act(async () => resolveShake());
    await act(async () => resolveFlight());
    act(() => vi.advanceTimersByTime(700));
    expect(controls.set).toHaveBeenCalledWith({ y: 0 });
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Launch rocket: 3 taps remaining');
    expect(button).toHaveAttribute('aria-disabled', 'false');
    launch();
    expect(dispatch.mock.calls.filter(([event]) => event.type === 'rocket-launch')).toHaveLength(2);
    unmount();
  });

  it('counts down in its tooltip as the visitor taps', () => {
    const { unmount } = render(<FloatingRocket />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/tap me to test thrusters/i);
    fireEvent.click(button);
    expect(button).toHaveTextContent(/tap again/i);
    fireEvent.click(button);
    expect(button).toHaveTextContent(/ready for launch/i);
    unmount();
  });

  it('nudges the idle rocket every few seconds and stops once it launches', () => {
    const pulses = () => controls.start.mock.calls.filter(([animation]) => animation.scale);
    const { unmount } = render(<FloatingRocket />);
    act(() => vi.advanceTimersByTime(4500));
    expect(pulses()).toHaveLength(1);
    act(() => vi.advanceTimersByTime(4500));
    expect(pulses()).toHaveLength(2);
    launch();
    act(() => vi.advanceTimersByTime(9000));
    expect(pulses()).toHaveLength(2);
    unmount();
  });
});