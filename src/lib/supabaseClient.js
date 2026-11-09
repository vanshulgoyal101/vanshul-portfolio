// Configuration comes from Vite env vars (see .env.example):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
// The anon key is safe to ship in the client bundle — Row Level Security on the
// database restricts what it can do (see documentation/data.md).
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Without both values every view-count feature is a no-op, so the site still
// builds and runs.
export const isSupabaseConfigured = Boolean(url && anonKey);

let client;

/**
 * The view-count client, created on first use. supabase-js is imported
 * dynamically so it stays out of the entry bundle. The client only makes
 * anonymous reads and RPC calls, so it keeps no auth session.
 *
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient | null>}
 */
export const getSupabase = () => {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  client ??= import('@supabase/supabase-js')
    .then(({ createClient }) => createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }))
    .catch((error) => {
      // Let a later call retry after a failed chunk download.
      client = undefined;
      throw error;
    });
  return client;
};
