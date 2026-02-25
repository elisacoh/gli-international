import { Handler, HandlerEvent } from '@netlify/functions';
import { createSupabaseClient } from './_lib/supabase';
import { requireAuth } from './_lib/auth';
import { success, error } from './_lib/response';

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405);
  }

  try {
    // Require authentication
    const auth = await requireAuth(event);

    if (!auth.authenticated || !auth.user) {
      return error('Unauthorized', 401);
    }

    // Create Supabase client with user's token
    const supabase = createSupabaseClient(auth.token || undefined);

    // Query promo code usage with join to promo_codes table
    const { data, error: fetchError } = await supabase
      .from('promo_code_usage')
      .select(`
        id,
        discount_amount,
        original_amount,
        final_amount,
        used_at,
        payment_id,
        promo_code:promo_codes!inner (
          id,
          code,
          description,
          discount_type,
          discount_value
        )
      `)
      .eq('user_id', auth.user.id)
      .order('used_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return error('Error fetching usage history', 500);
    }

    // Transform data to match expected format
    const usage = data.map((item: any) => ({
      id: item.id,
      promo_code: {
        id: item.promo_code.id,
        code: item.promo_code.code,
        description: item.promo_code.description,
        discount_type: item.promo_code.discount_type,
        discount_value: item.promo_code.discount_value,
      },
      discount_amount: item.discount_amount,
      original_amount: item.original_amount,
      final_amount: item.final_amount,
      payment_id: item.payment_id,
      used_at: item.used_at,
    }));

    return success({ usage });
  } catch (err: any) {
    console.error('Error:', err);
    return error(err.message || 'Internal server error', 500);
  }
};
