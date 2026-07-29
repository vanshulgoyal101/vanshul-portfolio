import { describe, it, expect } from 'vitest';
import {
  BLOG_ANIMATION_VARIANTS,
  BLOG_CONFIG,
  BLOG_CATEGORIES,
  BLOG_CONTENT,
} from './blogConstants';

describe('BLOG_ANIMATION_VARIANTS', () => {
  it('defines container, item, and modal variants', () => {
    expect(BLOG_ANIMATION_VARIANTS).toHaveProperty('container');
    expect(BLOG_ANIMATION_VARIANTS).toHaveProperty('item');
    expect(BLOG_ANIMATION_VARIANTS).toHaveProperty('modal');
  });

  it('has hidden and visible states for the container', () => {
    expect(BLOG_ANIMATION_VARIANTS.container.hidden).toEqual({ opacity: 0 });
    expect(BLOG_ANIMATION_VARIANTS.container.visible.opacity).toBe(1);
  });

  it('has an item variant that animates vertical offset', () => {
    expect(BLOG_ANIMATION_VARIANTS.item.hidden).toEqual({ opacity: 0, y: 30 });
    expect(BLOG_ANIMATION_VARIANTS.item.visible.y).toBe(0);
  });

  it('has a modal variant with an exit state', () => {
    expect(BLOG_ANIMATION_VARIANTS.modal.exit).toBeDefined();
    expect(BLOG_ANIMATION_VARIANTS.modal.hidden.scale).toBe(0.9);
  });
});

describe('BLOG_CONFIG', () => {
  it('exposes sensible defaults', () => {
    expect(BLOG_CONFIG.postsPerPage).toBe(9);
    expect(BLOG_CONFIG.defaultCategory).toBe('All');
    expect(BLOG_CONFIG.defaultSortOrder).toBe('desc');
    expect(BLOG_CONFIG.wordsPerMinute).toBe(200);
  });
});

describe('BLOG_CATEGORIES', () => {
  it('defines the expected category keys', () => {
    expect(BLOG_CATEGORIES.ALL).toBe('All');
    expect(BLOG_CATEGORIES.AI).toBe('AI');
    expect(BLOG_CATEGORIES.TECH_INDUSTRY).toBe('Tech Industry');
    expect(BLOG_CATEGORIES.FUTURE_OF_WORK).toBe('Future of Work');
  });
});

describe('BLOG_CONTENT', () => {
  it('provides section copy', () => {
    expect(BLOG_CONTENT.sectionTitle).toBe('Writings');
    expect(typeof BLOG_CONTENT.sectionSubtitle).toBe('string');
  });

  it('provides empty-state copy', () => {
    expect(BLOG_CONTENT.emptyStateTitle).toBe('Coming Soon');
    expect(BLOG_CONTENT.emptyStateMessage.length).toBeGreaterThan(0);
  });

  it('provides a quote with text and author', () => {
    expect(BLOG_CONTENT.quote.text.length).toBeGreaterThan(0);
    expect(BLOG_CONTENT.quote.author).toBe('Naval Ravikant');
  });
});
