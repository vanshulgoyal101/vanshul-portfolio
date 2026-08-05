import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCursorPreference,
  setCursorPreference,
  isCustomCursorEnabled,
  CURSOR_PREF_EVENT,
} from './cursorPreference';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cursor preference', () => {
  it('defaults to auto when nothing is stored', () => {
    expect(getCursorPreference()).toBe('auto');
  });

  it('persists and reads explicit on/off', () => {
    setCursorPreference('on');
    expect(getCursorPreference()).toBe('on');
    setCursorPreference('off');
    expect(getCursorPreference()).toBe('off');
  });

  it('auto clears the stored value', () => {
    setCursorPreference('on');
    setCursorPreference('auto');
    expect(getCursorPreference()).toBe('auto');
    expect(localStorage.getItem('vg.cursor')).toBeNull();
  });

  it('explicit "on" enables the cursor even on an incapable (test) environment', () => {
    // jsdom matchMedia stub reports matches:false, so auto-detect is false here.
    expect(isCustomCursorEnabled()).toBe(false);
    setCursorPreference('on');
    expect(isCustomCursorEnabled()).toBe(true);
  });

  it('explicit "off" disables the cursor', () => {
    setCursorPreference('off');
    expect(isCustomCursorEnabled()).toBe(false);
  });

  it('notifies listeners when the preference changes', () => {
    const spy = vi.fn();
    window.addEventListener(CURSOR_PREF_EVENT, spy);
    setCursorPreference('on');
    expect(spy).toHaveBeenCalledTimes(1);
    window.removeEventListener(CURSOR_PREF_EVENT, spy);
  });
});
