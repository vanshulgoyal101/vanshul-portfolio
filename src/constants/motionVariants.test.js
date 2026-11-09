import { describe, it, expect } from 'vitest';
import { containerVariants, itemVariants } from './motionVariants';

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
});
