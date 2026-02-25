import { Handler, HandlerEvent } from '@netlify/functions';
import { createSupabaseClient } from './supabase';

export async function requireAuth(event: HandlerEvent) {
  const authHeader = event.headers.authorization;

  if (!authHeader) {
    return { authenticated: false, user: null, token: null };
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createSupabaseClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { authenticated: false, user: null, token: null };
  }

  return { authenticated: true, user, token };
}

export async function requireAdmin(event: HandlerEvent) {
  const auth = await requireAuth(event);

  if (!auth.authenticated || !auth.user) {
    return { isAdmin: false, user: null, token: null };
  }

  const supabase = createSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .single();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  return { isAdmin, user: auth.user, token: auth.token };
}
