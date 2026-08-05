import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  isCustomCursorEnabled,
  isPointerFine,
  setCursorPreference,
  CURSOR_PREF_EVENT,
} from '../utils/cursorPreference';

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s ease;

  &:hover { color: var(--color-accent-primary); }
  &:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 2px;
  }
`;

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
    <ToggleButton
      type="button"
      onClick={() => setCursorPreference(enabled ? 'off' : 'on')}
      aria-pressed={enabled}
    >
      Custom cursor: {enabled ? 'On' : 'Off'}
    </ToggleButton>
  );
};

export default CursorToggle;
