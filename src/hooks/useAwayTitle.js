import { useEffect } from 'react';
import { AWAY_TITLES } from '../constants/wit';
import { pickRandom } from '../utils/pickRandom';

// While the tab is hidden its title becomes a playful nudge; the real title
// returns with the visitor. A title set in the meantime (a route change) wins.
export const useAwayTitle = (titles = AWAY_TITLES) => {
  useEffect(() => {
    let savedTitle = null;
    let awayTitle = null;

    const restore = () => {
      if (awayTitle !== null && document.title === awayTitle) document.title = savedTitle;
      savedTitle = null;
      awayTitle = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') {
        restore();
        return;
      }
      if (awayTitle !== null) return;
      savedTitle = document.title;
      awayTitle = pickRandom(titles);
      document.title = awayTitle;
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      restore();
    };
  }, [titles]);
};
