import { Handler, HandlerEvent } from '@netlify/functions';
import { createSupabaseClient } from './_lib/supabase';
import { success, error } from './_lib/response';

// Helper function to calculate discount
function calculateDiscount(amount: number, discountType: string, discountValue: number): number {
  if (discountType === 'percentage') {
    return Math.round(amount * (discountValue / 100) * 100) / 100;
  } else if (discountType === 'fixed') {
    return Math.min(discountValue, amount); // Can't discount more than total
  }
  return 0;
}

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
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { code, formation_id, amount } = body;

    if (!code) {
      return error('Promo code is required', 400);
    }

    // Create Supabase client (anonymous)
    const supabase = createSupabaseClient();

    // Use anonymous user ID for validation
    const anonymousUserId = '00000000-0000-0000-0000-000000000000';

    // Call Supabase RPC function to validate promo code
    const { data, error: rpcError } = await supabase.rpc('validate_promo_code', {
      p_code: code,
      p_user_id: anonymousUserId,
      p_amount: amount || null,
    });

    console.log('RPC Response:', { data, error: rpcError });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return error('Error validating promo code', 500);
    }

    // RPC returns an array (TABLE type), get first row
    const result = Array.isArray(data) ? data[0] : data;
    console.log('Validation result:', result);

    if (!result || !result.is_valid) {
      return success({
        is_valid: false,
        promo_id: null,
        discount_type: null,
        discount_value: null,
        discount_amount: null,
        final_amount: amount || null,
        error_message: result.error_message,
      });
    }

    // Calculate discount if amount is provided
    let discountAmount = 0;
    let finalAmount = amount || 0;

    if (amount && amount > 0) {
      discountAmount = calculateDiscount(amount, result.discount_type, result.discount_value);
      finalAmount = Math.max(0, amount - discountAmount);
    }

    return success({
      is_valid: true,
      promo_id: result.promo_id,
      discount_type: result.discount_type,
      discount_value: result.discount_value,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      error_message: null,
    });
  } catch (err: any) {
    console.error('Error:', err);
    return error(err.message || 'Internal server error', 500);
  }
};
