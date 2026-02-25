import { Handler, HandlerEvent } from '@netlify/functions';
import { createSupabaseClient } from './_lib/supabase';
import { requireAuth } from './_lib/auth';
import { success, error } from './_lib/response';

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    // Require authentication
    const auth = await requireAuth(event);

    if (!auth.authenticated || !auth.user) {
      return error('Unauthorized', 401);
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const {
      promo_code_id,
      payment_id,
      discount_amount,
      original_amount,
      final_amount,
    } = body;

    // Validate required fields
    if (!promo_code_id) {
      return error('promo_code_id is required', 400);
    }

    if (discount_amount === undefined || original_amount === undefined || final_amount === undefined) {
      return error('discount_amount, original_amount, and final_amount are required', 400);
    }

    // Create Supabase client
    const supabase = createSupabaseClient(auth.token || undefined);

    // Call Supabase RPC function to record usage
    const { data, error: rpcError } = await supabase.rpc('record_promo_code_usage', {
      p_promo_code_id: promo_code_id,
      p_user_id: auth.user.id,
      p_payment_id: payment_id || null,
      p_discount_amount: discount_amount,
      p_original_amount: original_amount,
      p_final_amount: final_amount,
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return error(rpcError.message || 'Error recording promo code usage', 500);
    }

    // Data is a single row
    const result = data;

    if (!result.success) {
      return error(result.error_message || 'Failed to record usage', 400);
    }

    return success({
      success: true,
      usage_id: result.usage_id,
      error_message: null,
    });
  } catch (err: any) {
    console.error('Error:', err);
    return error(err.message || 'Internal server error', 500);
  }
};
