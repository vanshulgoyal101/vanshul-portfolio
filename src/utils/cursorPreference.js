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

/** Whether the cursor should auto-enable (no explicit preference set). */
export const isAutoCursorCapable = () => {
  if (!isPointerFine()) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
};

export const isCustomCursorEnabled = () => {
  return isAutoCursorCapable() && getCursorPreference() !== 'off';
};
