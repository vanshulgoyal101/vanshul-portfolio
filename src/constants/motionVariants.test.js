import { describe, it, expect } from 'vitest';
import { containerVariants, itemVariants, pageVariants } from './motionVariants';

describe('motionVariants', () => {
  it('containerVariants staggers its children on show', () => {
    expect(containerVariants.hidden).toEqual({ opacity: 0 });
    expect(containerVariants.visible.opacity).toBe(1);
    expect(containerVariants.visible.transition.staggerChildren).toBeGreaterThan(0);
  });

  it('itemVariants reveals from a downward offset', () => {
    expect(itemVariants.hidden).toMatchObject({ opacity: 0 });
    expect(itemVariants.hidden.y).toBeGreaterThan(0);
    expect(itemVariants.visible).toMatchObject({ opacity: 1, y: 0 });
    expect(itemVariants.visible.transition.duration).toBeGreaterThan(0);
  });

  it('pageVariants defines initial, animate and exit phases', () => {
    expect(pageVariants.initial).toEqual({ opacity: 0 });
    expect(pageVariants.animate.opacity).toBe(1);
    expect(pageVariants.exit.opacity).toBe(0);
    expect(pageVariants.exit.transition.duration).toBeGreaterThan(0);
  });
});
