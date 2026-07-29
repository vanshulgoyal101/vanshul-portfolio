import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// GoatCounter is privacy-friendly (no cookies, no consent banner needed).
// Set VITE_GOATCOUNTER_CODE to your site code (the "<code>" in
// https://<code>.goatcounter.com). When unset, analytics is a no-op.
const CODE = import.meta.env.VITE_GOATCOUNTER_CODE;

const Analytics = () => {
  const location = useLocation();
  const initial = useRef(true);

  // Load the counter script once.
  useEffect(() => {
    if (!CODE || document.getElementById('goatcounter')) return;
    const script = document.createElement('script');
    script.id = 'goatcounter';
    script.async = true;
    script.src = '//gc.zgo.at/count.js';
    script.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
    document.body.appendChild(script);
  }, []);

  // Count client-side route changes (the script auto-counts the first load).
  useEffect(() => {
    if (!CODE) return;
    if (initial.current) {
      initial.current = false;
      return;
    }
    window.goatcounter?.count?.({
      path: location.pathname + location.hash,
    });
  }, [location]);

  return null;
};

export default Analytics;
