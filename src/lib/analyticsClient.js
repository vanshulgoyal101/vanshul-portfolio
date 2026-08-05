import { createClient } from '@supabase/supabase-js';

// Dedicated client for the shared analytics project. The URL and publishable
// (anon) key are public by design — Row Level Security and the owner-gated
// web_stats() RPC protect the data. Hardcoded (not env-driven) so the private
// /dashboard keeps working even when build-time env vars are absent.
const ANALYTICS_URL = 'https://tmngedsmgcgbkbkmsnsw.supabase.co';
const ANALYTICS_KEY = 'sb_publishable_qFZySs9l19_7bISrvmLHIw_vwt-DUdx';

export const OWNER_EMAIL = 'vanshulg101@gmail.com';

export const analytics = createClient(ANALYTICS_URL, ANALYTICS_KEY);
