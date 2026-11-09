import { describe, it, expect } from 'vitest';
import { BLOG_CONTENT } from './blogConstants';

describe('BLOG_CONTENT', () => {
  it('provides section, empty-state and quote copy', () => {
    expect(BLOG_CONTENT.sectionTitle).toBe('Writings');
    expect(BLOG_CONTENT.sectionSubtitle.length).toBeGreaterThan(0);
    expect(BLOG_CONTENT.emptyStateTitle.length).toBeGreaterThan(0);
    expect(BLOG_CONTENT.emptyStateMessage.length).toBeGreaterThan(0);
    expect(BLOG_CONTENT.quote.text.length).toBeGreaterThan(0);
    expect(BLOG_CONTENT.quote.author).toBe('Naval Ravikant');
  });
});
