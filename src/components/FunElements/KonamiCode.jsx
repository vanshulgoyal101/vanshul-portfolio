import { useEffect, useRef } from 'react';
import { useToast } from '../Toast';
import { useKonamiCode } from '../../hooks/useKonamiCode';
import { KONAMI_TOAST } from '../../constants/wit';

const ROLL_KEYFRAMES = ['rotate(0turn)', 'rotate(1turn)'];

// Spins the page content once. Decorative, so callers gate it on the ambient
// switch; reduced motion is checked here at the moment of the roll.
const barrelRoll = () => {
  const main = document.querySelector('main');
  if (typeof main?.animate !== 'function') return null;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
  // Pivot on the middle of the viewport, not the middle of a page-tall element.
  const transformOrigin = `50% ${window.innerHeight / 2 - main.getBoundingClientRect().top}px`;
  return main.animate(
    ROLL_KEYFRAMES.map(transform => ({ transform, transformOrigin })),
    { duration: 1000, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
  );
};

const KonamiCode = ({ motionEnabled = true }) => {
  const { showInfo } = useToast();
  const rollRef = useRef(null);

  useKonamiCode(() => {
    showInfo(KONAMI_TOAST.title, KONAMI_TOAST.message);
    if (motionEnabled && rollRef.current?.playState !== 'running') rollRef.current = barrelRoll();
  });

  useEffect(() => () => rollRef.current?.cancel(), []);

  return null;
};

export default KonamiCode;
