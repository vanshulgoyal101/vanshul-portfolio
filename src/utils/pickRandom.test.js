import { describe, it, expect } from 'vitest';
import { pickRandom } from './pickRandom';

describe('pickRandom', () => {
  const items = ['a', 'b', 'c'];

  it('maps the random value onto an item', () => {
    expect(pickRandom(items, () => 0)).toBe('a');
    expect(pickRandom(items, () => 0.5)).toBe('b');
    expect(pickRandom(items, () => 0.99)).toBe('c');
  });

  it('never runs past the last item', () => {
    expect(pickRandom(items, () => 1)).toBe('c');
  });

  it('uses Math.random by default', () => {
    expect(items).toContain(pickRandom(items));
  });
});
