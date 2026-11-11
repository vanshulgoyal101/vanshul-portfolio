/**
 * The site's browser security baseline, in one place. GitHub Pages cannot send
 * response headers, so the policy ships as <meta> tags: vite.config.js injects
 * them into every built page, verify-build.mjs re-derives them from the built
 * HTML, and public/404.html carries its own (checked in securityPolicy.test.js).
 * A <meta> policy cannot set frame-ancestors, X-Frame-Options or nosniff; those
 * need a header-capable host.
 */
import { createHash } from 'node:crypto';
import { ANALYTICS_SUPABASE_URL } from '../../src/lib/runtimeConfig.js';

export const REFERRER_POLICY = 'strict-origin-when-cross-origin';

const GOATCOUNTER_SCRIPT_ORIGIN = 'https://gc.zgo.at';

/** The body of every executable inline <script> (not src=, not JSON-LD). */
export const inlineScripts = (html) =>
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attributes]) => !/\bsrc\s*=/i.test(attributes) && !/type\s*=\s*["']?application\/(ld\+)?json/i.test(attributes))
    .map(([, , body]) => body);

export const scriptHash = (body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;

/**
 * The Content-Security-Policy for app pages, built from the configured origins.
 * Styles allow 'unsafe-inline' because styled-components and Framer Motion
 * write runtime styles; scripts stay limited to this origin and hashed inline
 * scripts.
 *
 * @param {ReturnType<import('../../src/lib/runtimeConfig.js').parseRuntimeConfig>} config
 * @param {string[]} inlineScriptBodies
 */
export const contentSecurityPolicy = (config, inlineScriptBodies = []) => {
  const goatCounter = config.goatCounterCode ? `https://${config.goatCounterCode}.goatcounter.com` : null;
  const connect = new Set(["'self'", ANALYTICS_SUPABASE_URL, config.supabase?.url, new URL(config.contactEndpoint).origin, goatCounter]);
  const directives = [
    ['default-src', "'self'"],
    ['script-src', "'self'", ...new Set(inlineScriptBodies.map(scriptHash)), goatCounter && GOATCOUNTER_SCRIPT_ORIGIN],
    ['style-src', "'self'", "'unsafe-inline'"],
    ['img-src', "'self'", 'data:', 'blob:', goatCounter],
    ['font-src', "'self'"],
    ['connect-src', ...connect],
    ['manifest-src', "'self'"],
    ['object-src', "'none'"],
    ['base-uri', "'self'"],
    ['form-action', "'self'"],
    ['upgrade-insecure-requests'],
  ];
  return directives.map(directive => directive.filter(Boolean).join(' ')).join('; ');
};

/** Parse a policy into directive → sources, for assertions. */
export const parsePolicy = (policy) =>
  Object.fromEntries(policy.split(';').map(part => part.trim().split(/\s+/)).filter(([name]) => name).map(([name, ...sources]) => [name, sources]));
