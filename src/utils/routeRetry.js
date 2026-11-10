export const RETRY_KEY = 'vg.routeRetryAt';
// Generous on purpose: one reload fixes a stale build, and a page that keeps
// failing must not reload in a loop even when each attempt loads slowly.
const RETRY_WINDOW_MS = 60000;

// Every GitHub Pages deploy deletes the previous build's hashed chunks, so a
// tab opened before a release fails on its next lazy route. One automatic
// reload picks up the new build. A repeat failure within the window, being
// offline, or unavailable storage (no loop guard) means no automatic reload.
export const shouldRetry = (now = Date.now()) => {
  try {
    if (navigator.onLine === false) return false;
    const last = sessionStorage.getItem(RETRY_KEY);
    if (last !== null && now - Number(last) < RETRY_WINDOW_MS) return false;
    sessionStorage.setItem(RETRY_KEY, String(now));
    return true;
  } catch {
    return false;
  }
};
