import { useEffect, useState } from 'react';
import {
  isCustomCursorEnabled,
  isPointerFine,
  setCursorPreference,
  CURSOR_PREF_EVENT,
} from '../utils/cursorPreference';

/**
 * Lets the visitor turn the animated custom cursor on/off (it is auto-disabled
 * on Safari and low-end devices). Hidden on touch devices where it's moot.
 */
const CursorToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isPointerFine());
    const sync = () => setEnabled(isCustomCursorEnabled());
    sync();
    window.addEventListener(CURSOR_PREF_EVENT, sync);
    return () => window.removeEventListener(CURSOR_PREF_EVENT, sync);
  }, []);

  if (!show) return null;

  return (
    <label>
      Custom cursor
      <input type="checkbox" role="switch" checked={enabled} onChange={event => setCursorPreference(event.target.checked ? 'on' : 'off')} />
    </label>
  );
};

export default CursorToggle;
