export const RETRY_KEY = 'vg.routeRetryAt';
const RETRY_WINDOW_MS = 10000;

// Every GitHub Pages deploy deletes the previous build's hashed chunks, so a
// tab opened before a release fails on its next lazy route. One automatic
// reload picks up the new build. A repeat failure within the window, being
// offline, or unavailable storage (no loop guard) means no automatic reload.
export const shouldRetry = (now = Date.now()) => {
  try {
    if (navigator.onLine === false) return false;
    if (now - Number(sessionStorage.getItem(RETRY_KEY) || 0) < RETRY_WINDOW_MS) return false;
    sessionStorage.setItem(RETRY_KEY, String(now));
    return true;
  } catch {
    return false;
  }
};
