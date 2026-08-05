// Decides whether the animated custom cursor should run, and lets the visitor
// override that decision. The cursor's spring animation can feel janky in
// Safari and on low-end hardware, so it is auto-disabled there — but a saved
// preference ('on' | 'off') always wins.

const KEY = 'vg.cursor';
export const CURSOR_PREF_EVENT = 'vg:cursorpref';

/** @returns {'on'|'off'|'auto'} */
export const getCursorPreference = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : 'auto';
  } catch {
    return 'auto';
  }
};

/** Persist the preference and notify listeners (same-tab). */
export const setCursorPreference = (pref) => {
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CURSOR_PREF_EVENT));
};

/** True only on hover-capable, fine-pointer devices (i.e. a real mouse). */
export const isPointerFine = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Best-effort Safari detection (desktop + iPadOS), excluding Chromium/Firefox
// builds that also carry "Safari" in their UA string.
const isSafari = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const notOtherEngine = !/chrome|chromium|crios|android|edg|edga|edgios|fxios|opr/i.test(ua);
  const looksSafari = /safari/i.test(ua) && notOtherEngine;
  const appleVendor = (navigator.vendor || '').includes('Apple');
  return looksSafari && appleVendor;
};

// Rough low-end heuristic: few logical cores or little memory.
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency;
  const mem = navigator.deviceMemory;
  return (typeof cores === 'number' && cores <= 4) || (typeof mem === 'number' && mem <= 4);
};

/** Whether the cursor should auto-enable (no explicit preference set). */
export const isAutoCursorCapable = () => {
  if (!isPointerFine()) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (isSafari()) return false;
  if (isLowEndDevice()) return false;
  return true;
};

/** The effective on/off decision: explicit preference wins, else auto-detect. */
export const isCustomCursorEnabled = () => {
  const pref = getCursorPreference();
  if (pref === 'on') return true;
  if (pref === 'off') return false;
  return isAutoCursorCapable();
};
