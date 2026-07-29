import { createClient } from '@supabase/supabase-js';

// Configuration comes from Vite env vars (see .env.example):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
// The anon key is safe to ship in the client bundle — Row Level Security on the
// database restricts what it can do (see documentation/data.md).
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create a client when both values are present. When this is `null`, every
// view-count feature degrades to a no-op so the site still builds and runs.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
