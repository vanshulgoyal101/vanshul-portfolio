import { describe, it, expect } from 'vitest';
import { DEFAULT_CONTACT_ENDPOINT, parseRuntimeConfig } from './runtimeConfig';

const base64url = (value) => btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const jwt = (payload) => `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}.c2lnbmF0dXJl`;
const URL_OK = 'https://abcdefgh.supabase.co';
const KEY_OK = 'sb_publishable_abc_123-XYZ';

describe('parseRuntimeConfig', () => {
  it('turns every optional feature off without errors when nothing is set', () => {
    for (const env of [undefined, {}, { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '  ' }]) {
      expect(parseRuntimeConfig(env)).toEqual({ supabase: null, contactEndpoint: DEFAULT_CONTACT_ENDPOINT, goatCounterCode: null, errors: [] });
    }
  });

  it('accepts publishable keys and legacy anon JWTs, normalizing the origin and trimming secrets', () => {
    expect(parseRuntimeConfig({ VITE_SUPABASE_URL: `${URL_OK}/`, VITE_SUPABASE_ANON_KEY: `${KEY_OK}\n` }).supabase)
      .toEqual({ url: URL_OK, anonKey: KEY_OK });
    const anon = jwt({ iss: 'supabase', role: 'anon' });
    expect(parseRuntimeConfig({ VITE_SUPABASE_URL: URL_OK, VITE_SUPABASE_ANON_KEY: anon })).toMatchObject({ supabase: { url: URL_OK, anonKey: anon }, errors: [] });
    expect(parseRuntimeConfig({ VITE_SUPABASE_URL: 'http://127.0.0.1:54321', VITE_SUPABASE_ANON_KEY: KEY_OK }).supabase?.url).toBe('http://127.0.0.1:54321');
  });

  it.each([
    ['plain http', { VITE_SUPABASE_URL: 'http://abcdefgh.supabase.co' }, 'VITE_SUPABASE_URL must be an https:// origin'],
    ['a path', { VITE_SUPABASE_URL: `${URL_OK}/rest/v1` }, 'VITE_SUPABASE_URL must be an https:// origin'],
    ['credentials', { VITE_SUPABASE_URL: 'https://user:pass@abcdefgh.supabase.co' }, 'VITE_SUPABASE_URL must be an https:// origin'],
    ['a non-URL', { VITE_SUPABASE_URL: 'abcdefgh.supabase.co' }, 'VITE_SUPABASE_URL must be an https:// origin'],
    ['a key without a URL', { VITE_SUPABASE_URL: '' }, 'VITE_SUPABASE_URL is required'],
    ['a URL without a key', { VITE_SUPABASE_ANON_KEY: '' }, 'VITE_SUPABASE_ANON_KEY is required'],
    ['a secret key', { VITE_SUPABASE_ANON_KEY: 'sb_secret_abc123' }, 'is a secret key'],
    ['the service-role JWT', { VITE_SUPABASE_ANON_KEY: jwt({ role: 'service_role' }) }, 'is the service-role key'],
    ['an unreadable JWT', { VITE_SUPABASE_ANON_KEY: 'aaa.bbb.ccc' }, 'must be an anon JWT'],
    ['a placeholder key', { VITE_SUPABASE_ANON_KEY: 'your-anon-public-key' }, 'must be a publishable key'],
  ])('rejects a Supabase configuration with %s and leaves view counts off', (_, override, message) => {
    const env = { VITE_SUPABASE_URL: URL_OK, VITE_SUPABASE_ANON_KEY: KEY_OK, ...override };
    const config = parseRuntimeConfig(env);
    expect(config.supabase).toBeNull();
    expect(config.errors).toEqual([expect.stringContaining(message)]);
    // Messages name the variable but never echo a (possibly secret) value.
    for (const value of Object.values(env).filter(value => value.length > 8)) {
      expect(config.errors.join(' ')).not.toContain(value);
    }
  });

  it('accepts an https contact endpoint and falls back to the default for anything else', () => {
    expect(parseRuntimeConfig({ VITE_CONTACT_ENDPOINT: ' https://formspree.io/f/abc ' }).contactEndpoint).toBe('https://formspree.io/f/abc');
    const insecure = parseRuntimeConfig({ VITE_CONTACT_ENDPOINT: 'http://formspree.io/f/abc' });
    expect(insecure.contactEndpoint).toBe(DEFAULT_CONTACT_ENDPOINT);
    expect(insecure.errors).toEqual(['VITE_CONTACT_ENDPOINT must be an https:// URL']);
  });

  it('accepts a GoatCounter code of letters, digits and hyphens only', () => {
    expect(parseRuntimeConfig({ VITE_GOATCOUNTER_CODE: 'my-site1' }).goatCounterCode).toBe('my-site1');
    const injected = parseRuntimeConfig({ VITE_GOATCOUNTER_CODE: 'evil.example.com/x' });
    expect(injected.goatCounterCode).toBeNull();
    expect(injected.errors).toEqual(['VITE_GOATCOUNTER_CODE must contain only letters, digits and hyphens']);
  });
});
