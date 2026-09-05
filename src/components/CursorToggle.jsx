import { useEffect, useState } from 'react';
import {
  isCustomCursorEnabled,
  isPointerFine,
  setCursorPreference,
  CURSOR_PREF_EVENT,
} from '../utils/cursorPreference';

const CursorToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [show, setShow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setShow(isPointerFine());
      setReducedMotion(motion.matches);
      setEnabled(isCustomCursorEnabled());
    };
    sync();
    pointer.addEventListener('change', sync);
    motion.addEventListener('change', sync);
    window.addEventListener(CURSOR_PREF_EVENT, sync);
    return () => {
      pointer.removeEventListener('change', sync);
      motion.removeEventListener('change', sync);
      window.removeEventListener(CURSOR_PREF_EVENT, sync);
    };
  }, []);

  if (!show) return null;

  return (
    <label title={reducedMotion ? 'Disabled by your reduced-motion preference' : undefined}>
      Custom cursor
      <input type="checkbox" role="switch" checked={enabled} disabled={reducedMotion} onChange={event => setCursorPreference(event.target.checked ? 'on' : 'off')} />
    </label>
  );
};

export default CursorToggle;
