/**
 * The one schema for build-time configuration (the VITE_* variables in
 * .env.example). Pure and dependency-free: the app parses `import.meta.env`
 * with it, and vite.config.js parses the same variables to reject a
 * misconfigured production build and to derive the Content-Security-Policy
 * from the origins actually in use. Error messages name the variable but never
 * echo its value.
 */

export const DEFAULT_CONTACT_ENDPOINT = 'https://formspree.io/f/xgvzkqob';

// The dashboard's analytics project is hardcoded (see analyticsClient.js).
export const ANALYTICS_SUPABASE_URL = 'https://tmngedsmgcgbkbkmsnsw.supabase.co';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Parse an https URL (http only for a local host); null when unacceptable. */
const parseHttpsUrl = (value, { originOnly = false } = {}) => {
  if (!URL.canParse(value)) return null;
  const url = new URL(value);
  const secure = url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname));
  if (!secure || url.username || url.password || url.hash) return null;
  if (originOnly && (url.pathname !== '/' || url.search)) return null;
  return url;
};

const jwtRole = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '='))).role;
  } catch {
    return undefined;
  }
};

// Only a publishable key may ship in a public bundle: never a secret key or a
// service-role JWT, which bypass Row Level Security.
const anonKeyError = (key) => {
  if (/^sb_publishable_[\w-]+$/.test(key)) return null;
  if (key.startsWith('sb_secret_')) return 'VITE_SUPABASE_ANON_KEY is a secret key; use the publishable (anon) key';
  if (/^[\w-]+\.[\w-]+\.[\w-]+$/.test(key)) {
    const role = jwtRole(key);
    if (role === 'anon') return null;
    return role === 'service_role'
      ? 'VITE_SUPABASE_ANON_KEY is the service-role key; use the publishable (anon) key'
      : 'VITE_SUPABASE_ANON_KEY must be an anon JWT';
  }
  return 'VITE_SUPABASE_ANON_KEY must be a publishable key (sb_publishable_…) or the legacy anon JWT';
};

/**
 * Validate the VITE_* variables. Invalid values disable their feature (the
 * contact form falls back to its default endpoint) and are listed in `errors`.
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {{
 *   supabase: { url: string, anonKey: string } | null,
 *   contactEndpoint: string,
 *   goatCounterCode: string | null,
 *   errors: string[],
 * }}
 */
export const parseRuntimeConfig = (env = {}) => {
  const read = (name) => (typeof env?.[name] === 'string' ? env[name].trim() : '');
  const errors = [];

  let supabase = null;
  const supabaseUrl = read('VITE_SUPABASE_URL');
  const anonKey = read('VITE_SUPABASE_ANON_KEY');
  if (supabaseUrl || anonKey) {
    const url = parseHttpsUrl(supabaseUrl, { originOnly: true });
    if (!supabaseUrl) errors.push('VITE_SUPABASE_URL is required when VITE_SUPABASE_ANON_KEY is set');
    else if (!url) errors.push('VITE_SUPABASE_URL must be an https:// origin, such as https://<ref>.supabase.co');
    const keyError = anonKey ? anonKeyError(anonKey) : 'VITE_SUPABASE_ANON_KEY is required when VITE_SUPABASE_URL is set';
    if (keyError) errors.push(keyError);
    if (url && !keyError) supabase = { url: url.origin, anonKey };
  }

  let contactEndpoint = DEFAULT_CONTACT_ENDPOINT;
  const contact = read('VITE_CONTACT_ENDPOINT');
  if (contact) {
    const url = parseHttpsUrl(contact);
    if (url) contactEndpoint = url.href;
    else errors.push('VITE_CONTACT_ENDPOINT must be an https:// URL');
  }

  let goatCounterCode = null;
  const code = read('VITE_GOATCOUNTER_CODE');
  if (code) {
    if (/^[a-z0-9-]+$/i.test(code)) goatCounterCode = code;
    else errors.push('VITE_GOATCOUNTER_CODE must contain only letters, digits and hyphens');
  }

  return { supabase, contactEndpoint, goatCounterCode, errors };
};
