import { useEffect, useRef } from 'react';

export const KONAMI_SEQUENCE = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
  'b', 'a',
];

const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

// Typing in a form field never counts towards the code.
const isEditable = target => target instanceof Element && target.closest(EDITABLE) !== null;

// Calls `onUnlock` each time ↑ ↑ ↓ ↓ ← → ← → B A is typed. Keys keep their
// default behaviour, so the arrows still scroll the page.
export const useKonamiCode = onUnlock => {
  const onUnlockRef = useRef(onUnlock);
  useEffect(() => { onUnlockRef.current = onUnlock; }, [onUnlock]);

  useEffect(() => {
    let recent = [];
    const onKeyDown = event => {
      if (event.ctrlKey || event.metaKey || event.altKey || isEditable(event.target)) return;
      recent = [...recent, String(event.key).toLowerCase()].slice(-KONAMI_SEQUENCE.length);
      if (recent.length === KONAMI_SEQUENCE.length && recent.every((key, i) => key === KONAMI_SEQUENCE[i])) {
        recent = [];
        onUnlockRef.current?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
};
