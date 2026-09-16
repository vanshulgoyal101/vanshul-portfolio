import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const { pathname } = useLocation();
  const lastPath = useRef(null);
  const code = import.meta.env.VITE_GOATCOUNTER_CODE;

  useEffect(() => {
    const optedOut = () => navigator.globalPrivacyControl === true ||
      navigator.doNotTrack === '1' || window.doNotTrack === '1';
    if (!code || !/^[a-z0-9-]+$/i.test(code) || optedOut() || /^\/dashboard(?:\/|$)/i.test(pathname)) {
      lastPath.current = null;
      return;
    }
    let script = document.getElementById('goatcounter');
    if (!script) {
      script = document.createElement('script');
      script.id = 'goatcounter';
      script.async = true;
      script.src = 'https://gc.zgo.at/count.js';
      script.referrerPolicy = 'no-referrer';
      script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
      script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true, no_events: true });
      document.body.appendChild(script);
    }
    const count = () => {
      if (optedOut() || lastPath.current === pathname || !window.goatcounter?.count) return;
      try {
        window.goatcounter.count({ path: pathname, title: pathname, referrer: '' });
        lastPath.current = pathname;
      } catch {
        return;
      }
    };
    script.addEventListener('load', count);
    count();
    return () => script.removeEventListener('load', count);
  }, [pathname, code]);

  return null;
};

export default Analytics;
