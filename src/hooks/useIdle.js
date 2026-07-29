import { useEffect, useState } from 'react';

/**
 * Returns `true` once the browser has gone idle after first paint.
 * Uses `requestIdleCallback` when available, falling back to a timeout.
 * Useful for deferring non-critical, decorative work until the main
 * content has rendered.
 *
 * @param {number} delay - Idle timeout / fallback delay in milliseconds
 * @returns {boolean} Whether the browser is ready for deferred work
 */
export const useIdle = (delay = 1500) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let id;
    if ('requestIdleCallback' in window) {
      id = requestIdleCallback(() => setReady(true), { timeout: delay });
    } else {
      id = setTimeout(() => setReady(true), delay);
    }
    return () => {
      if ('cancelIdleCallback' in window) cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [delay]);

  return ready;
};

export default useIdle;
