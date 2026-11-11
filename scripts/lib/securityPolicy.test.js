// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ANALYTICS_SUPABASE_URL, parseRuntimeConfig } from '../../src/lib/runtimeConfig.js';
import { REFERRER_POLICY, contentSecurityPolicy, inlineScripts, parsePolicy, scriptHash } from './securityPolicy.mjs';

// Resolved from the project root: under jsdom, import.meta.url is not a file URL.
const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('securityPolicy/inlineScripts', () => {
  it('returns executable inline scripts only', () => {
    const html = `<script>a()</script><script type="module" src="/x.js"></script>
      <script type="application/ld+json">{"@type":"Person"}</script><script type="text/javascript">b()</script>`;
    expect(inlineScripts(html)).toEqual(['a()', 'b()']);
  });

  it('hashes the exact script body', () => {
    // echo -n "alert(1)" | openssl dgst -sha256 -binary | base64
    expect(scriptHash('alert(1)')).toBe("'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='");
  });
});

describe('securityPolicy/contentSecurityPolicy', () => {
  const unconfigured = parsePolicy(contentSecurityPolicy(parseRuntimeConfig({}), ['x()']));

  it('limits scripts to this origin and the hashed inline scripts', () => {
    expect(unconfigured['script-src']).toEqual(["'self'", scriptHash('x()')]);
    expect(unconfigured['object-src']).toEqual(["'none'"]);
    expect(unconfigured['base-uri']).toEqual(["'self'"]);
    expect(unconfigured['form-action']).toEqual(["'self'"]);
    expect(unconfigured).toHaveProperty('upgrade-insecure-requests');
    for (const sources of Object.values(unconfigured)) {
      expect(sources).not.toContain("'unsafe-eval'");
      expect(sources).not.toContain('*');
    }
    expect(unconfigured['script-src']).not.toContain("'unsafe-inline'");
  });

  it('always allows the dashboard analytics project and the default contact endpoint', () => {
    expect(unconfigured['connect-src']).toEqual(["'self'", ANALYTICS_SUPABASE_URL, 'https://formspree.io']);
  });

  it('adds exactly the configured service origins', () => {
    const config = parseRuntimeConfig({
      VITE_SUPABASE_URL: 'https://views123.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'sb_publishable_key',
      VITE_CONTACT_ENDPOINT: 'https://forms.example.com/f/1',
      VITE_GOATCOUNTER_CODE: 'mysite',
    });
    const policy = parsePolicy(contentSecurityPolicy(config, ['x()', 'x()']));
    expect(policy['connect-src']).toEqual(["'self'", ANALYTICS_SUPABASE_URL, 'https://views123.supabase.co', 'https://forms.example.com', 'https://mysite.goatcounter.com']);
    expect(policy['script-src']).toEqual(["'self'", scriptHash('x()'), 'https://gc.zgo.at']);
    expect(policy['img-src']).toContain('https://mysite.goatcounter.com');
  });

  it('does not repeat an origin shared by two services', () => {
    const config = parseRuntimeConfig({ VITE_SUPABASE_URL: ANALYTICS_SUPABASE_URL, VITE_SUPABASE_ANON_KEY: 'sb_publishable_key' });
    expect(parsePolicy(contentSecurityPolicy(config))['connect-src']).toEqual(["'self'", ANALYTICS_SUPABASE_URL, 'https://formspree.io']);
  });
});

describe('public/404.html', () => {
  const html = read('public/404.html');
  const policy = parsePolicy(html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1]);

  // GitHub Pages serves this shim for every unknown path; a stale hash would
  // block the redirect and strand deep links on a blank page.
  it('allows exactly its own redirect script', () => {
    const scripts = inlineScripts(html);
    expect(scripts).toHaveLength(1);
    expect(policy['script-src']).toEqual([scriptHash(scripts[0])]);
    expect(policy['default-src']).toEqual(["'none'"]);
  });

  it('declares the policy before the script it governs, with the shared referrer policy', () => {
    expect(html.indexOf('Content-Security-Policy')).toBeLessThan(html.indexOf('<script'));
    expect(html).toContain(`<meta name="referrer" content="${REFERRER_POLICY}">`);
  });
});
