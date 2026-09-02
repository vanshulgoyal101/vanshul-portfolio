import { describe, it, expect } from 'vitest';
import { magneticOffset, FOLLOW_RATIO } from './magnetic';

describe('magneticOffset', () => {
  it('follows only a fraction of the cursor offset', () => {
    expect(magneticOffset(100, 0, 400)).toEqual({ x: 100 * FOLLOW_RATIO, y: 0 });
  });

  it('saturates once the cursor passes the configured range', () => {
    const { x, y } = magneticOffset(1000, 0, 80);
    expect(x).toBeCloseTo(80 * FOLLOW_RATIO);
    expect(y).toBeCloseTo(0);
  });

  it('caps diagonal pull by total travel, not per axis', () => {
    const { x, y } = magneticOffset(1000, 1000, 35);
    expect(Math.hypot(x, y)).toBeCloseTo(35 * FOLLOW_RATIO);
  });

  it('keeps small icons subtler than large buttons', () => {
    const icon = magneticOffset(1000, 0, 35);
    const button = magneticOffset(1000, 0, 80);
    expect(icon.x).toBeLessThan(button.x);
  });

  it('stays put when the cursor is at the centre', () => {
    expect(magneticOffset(0, 0, 80)).toEqual({ x: 0, y: 0 });
  });

  it('pulls toward the cursor on both axes', () => {
    const { x, y } = magneticOffset(-40, 20, 400);
    expect(x).toBeLessThan(0);
    expect(y).toBeGreaterThan(0);
  });
});
