import { describe, it, expect, vi, afterEach } from 'vitest';
import { RETRY_KEY, shouldRetry } from './routeRetry';

describe('shouldRetry', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('allows one reload and records when it happened', () => {
    expect(shouldRetry(50000)).toBe(true);
    expect(sessionStorage.getItem(RETRY_KEY)).toBe('50000');
  });

  it('refuses a second reload within a minute, then allows one again', () => {
    expect(shouldRetry(50000)).toBe(true);
    expect(shouldRetry(109999)).toBe(false);
    expect(shouldRetry(110000)).toBe(true);
  });

  it('does not reload while offline', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    expect(shouldRetry(50000)).toBe(false);
    expect(sessionStorage.getItem(RETRY_KEY)).toBeNull();
  });

  it('does not reload when storage cannot hold the loop guard', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(shouldRetry(50000)).toBe(false);
  });
});
