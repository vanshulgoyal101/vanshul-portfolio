/**
 * vanshul.com unified analytics beacon. Drop into any site with:
 *   <script defer src="https://vanshul.com/a.js" data-site="tools"></script>
 * (same-origin "/a.js" on vanshul.com itself).
 *
 * Logs anonymous usage to the shared Supabase `web_events` table:
 *   - a "pageview" on load and on SPA route changes (history API + hash)
 *   - a "link" for every outbound link click
 *   - a "tool"/"action" for any [data-track] click, or via window.vtrack(name)
 *
 * No PII: a site id, an event kind, a short name, the path, the referring host,
 * and a random per-device id. Best-effort — every failure is swallowed so the
 * host page is never affected.
 */
(function () {
  'use strict';
  var ENDPOINT = 'https://tmngedsmgcgbkbkmsnsw.supabase.co/rest/v1/web_events';
  var KEY = 'sb_publishable_qFZySs9l19_7bISrvmLHIw_vwt-DUdx';

  // Resolve the site id: explicit data-site wins, else derive from the hostname.
  function resolveSite() {
    try {
      var el = document.currentScript || document.querySelector('script[src*="/a.js"]');
      var attr = el && el.getAttribute('data-site');
      if (attr) return attr.slice(0, 32);
    } catch { /* ignore */ }
    var h = (location.hostname || '').replace(/^www\./, '');
    if (h === 'vanshul.com') return 'portfolio';
    var sub = h.split('.')[0];
    var map = { games: 'arcade', links: 'links', blog: 'blog' };
    return (map[sub] || sub || 'unknown').slice(0, 32);
  }
  var SITE = resolveSite();

  function visitorId() {
    try {
      var v = localStorage.getItem('vg.vid');
      if (!v) {
        v = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : String(Date.now()) + '-' + Math.random().toString(36).slice(2);
        localStorage.setItem('vg.vid', v);
      }
      return v;
    } catch { return null; }
  }

  // Referring host only (never the full URL / query string), and only if it is
  // a different site than this one.
  function referrerHost() {
    try {
      if (!document.referrer) return null;
      var r = new URL(document.referrer);
      if (r.hostname === location.hostname) return null;
      return r.hostname.slice(0, 200);
    } catch { return null; }
  }

  function path() {
    return (location.pathname + location.hash).slice(0, 300);
  }

  function send(kind, name) {
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        keepalive: true,
        headers: {
          apikey: KEY,
          Authorization: 'Bearer ' + KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          site: SITE,
          kind: kind,
          name: name != null ? String(name).slice(0, 200) : null,
          path: path(),
          referrer: referrerHost(),
          visitor: visitorId(),
        }),
      }).catch(function () {});
    } catch { /* ignore */ }
  }

  // ---- pageviews (initial + SPA navigations, de-duped per path) ----
  var lastPath = null;
  function pageview() {
    var p = path();
    if (p === lastPath) return;
    lastPath = p;
    send('pageview', null);
  }

  function hookHistory(method) {
    var orig = history[method];
    if (typeof orig !== 'function') return;
    history[method] = function () {
      var ret = orig.apply(this, arguments);
      // Defer so location has updated before we read it.
      setTimeout(pageview, 0);
      return ret;
    };
  }
  hookHistory('pushState');
  hookHistory('replaceState');
  window.addEventListener('popstate', pageview);
  window.addEventListener('hashchange', pageview);

  // ---- outbound links + explicit [data-track] elements ----
  document.addEventListener(
    'click',
    function (e) {
      try {
        var el = e.target && e.target.closest ? e.target.closest('a,[data-track]') : null;
        if (!el) return;
        var tracked = el.getAttribute('data-track');
        if (tracked) {
          var kind = el.getAttribute('data-track-kind') || 'tool';
          send(kind === 'link' || kind === 'action' ? kind : 'tool', tracked);
          return;
        }
        var href = el.getAttribute && el.getAttribute('href');
        if (href && /^https?:\/\//i.test(href)) {
          var u = new URL(href, location.href);
          if (u.hostname !== location.hostname) send('link', u.href);
        }
      } catch { /* ignore */ }
    },
    true
  );

  // ---- public API for manual instrumentation ----
  // window.vtrack('jwt')            -> a 'tool' event named "jwt"
  // window.vtrack('signup','action')
  window.vtrack = function (name, kind) {
    send(kind === 'link' || kind === 'action' || kind === 'pageview' ? kind : 'tool', name);
  };

  pageview();
})();
