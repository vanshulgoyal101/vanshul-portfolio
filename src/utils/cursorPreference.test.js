import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCursorPreference,
  setCursorPreference,
  isCustomCursorEnabled,
  isAutoCursorCapable,
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

  it('explicit "on" does not enable the cursor on a touch device', () => {
    // jsdom matchMedia stub reports matches:false, so auto-detect is false here.
    expect(isCustomCursorEnabled()).toBe(false);
    setCursorPreference('on');
    expect(isCustomCursorEnabled()).toBe(false);
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

describe('isAutoCursorCapable', () => {
  const originalMatchMedia = window.matchMedia;
  const SAFARI_UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
  const CHROME_UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

  const setEnv = ({ ua, vendor, cores, mem }) => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      // Fine pointer yes, reduced-motion no.
      matches: /hover: hover/.test(query),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
    Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
    Object.defineProperty(navigator, 'vendor', { value: vendor, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: cores, configurable: true });
    Object.defineProperty(navigator, 'deviceMemory', { value: mem, configurable: true });
  };

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('enables the cursor on Safari when the machine is roomy (>= 8 cores, no deviceMemory)', () => {
    setEnv({ ua: SAFARI_UA, vendor: 'Apple Computer, Inc.', cores: 10, mem: undefined });
    expect(isAutoCursorCapable()).toBe(true);
  });

  it('enables the cursor on Safari with a modest core count', () => {
    setEnv({ ua: SAFARI_UA, vendor: 'Apple Computer, Inc.', cores: 6, mem: undefined });
    expect(isAutoCursorCapable()).toBe(true);
  });

  it('does not infer cursor preferences from hardware core count', () => {
    setEnv({ ua: SAFARI_UA, vendor: 'Apple Computer, Inc.', cores: 4, mem: undefined });
    expect(isAutoCursorCapable()).toBe(true);
  });

  it('honours deviceMemory >= 8 when the browser reports it', () => {
    setEnv({ ua: SAFARI_UA, vendor: 'Apple Computer, Inc.', cores: 6, mem: 8 });
    expect(isAutoCursorCapable()).toBe(true);
  });

  it('enables non-Safari (Chrome) on a capable machine', () => {
    setEnv({ ua: CHROME_UA, vendor: 'Google Inc.', cores: 8, mem: 8 });
    expect(isAutoCursorCapable()).toBe(true);
  });

  it('honors reduced motion even with a saved on preference', () => {
    window.matchMedia = vi.fn(() => ({ matches: true }));
    setCursorPreference('on');
    expect(isCustomCursorEnabled()).toBe(false);
  });
});
