import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(authToken?: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable');
  }

  // Use service role key if we have an auth token (for authenticated requests)
  // Otherwise use anon key (for public endpoints)
  const supabaseKey = authToken ? supabaseServiceKey : supabaseAnonKey;

  if (!supabaseKey) {
    throw new Error(
      `Missing ${authToken ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY'} environment variable`
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  });
}
