
import { Handler, HandlerEvent } from '@netlify/functions';
import { createSupabaseClient } from './_lib/supabase';
import { requireAdmin } from './_lib/auth';
import { success, error } from './_lib/response';

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  try {
    // Require admin role
    const auth = await requireAdmin(event);

    if (!auth.isAdmin || !auth.user) {
      return error('Forbidden - Admin access required', 403);
    }

    // Create Supabase client with user's token
    const supabase = createSupabaseClient(auth.token || undefined);

    // Extract ID from path if present (format: /promo-codes/[id])
    const pathParts = event.path.split('/').filter(Boolean);
    const promoCodeId = pathParts.length > 2 ? pathParts[2] : null;

    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(supabase, event, promoCodeId);
      case 'POST':
        return await handlePost(supabase, event, auth.user.id);
      case 'PUT':
        return await handlePut(supabase, event, promoCodeId);
      case 'DELETE':
        return await handleDelete(supabase, promoCodeId);
      default:
        return error('Method not allowed', 405);
    }
  } catch (err: any) {
    console.error('Error:', err);
    return error(err.message || 'Internal server error', 500);
  }
};

// GET - List all or get single promo code
async function handleGet(supabase: any, event: HandlerEvent, promoCodeId: string | null) {
  if (promoCodeId) {
    // Get single promo code
    const { data, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('id', promoCodeId)
      .single();

    if (fetchError) {
      return error('Promo code not found', 404);
    }

    return success(data);
  }

  // List all promo codes with pagination
  const queryParams = event.queryStringParameters || {};
  const skip = parseInt(queryParams.skip || '0');
  const limit = Math.min(parseInt(queryParams.limit || '20'), 100);
  const activeFilter = queryParams.active;

  let query = supabase
    .from('promo_codes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(skip, skip + limit - 1);

  // Filter by active status if specified
  if (activeFilter === 'true') {
    query = query.eq('is_active', true);
  } else if (activeFilter === 'false') {
    query = query.eq('is_active', false);
  }

  const { data, error: fetchError, count } = await query;

  if (fetchError) {
    return error('Error fetching promo codes', 500);
  }

  return success({
    data,
    total: count,
    skip,
    limit,
  });
}

// POST - Create new promo code
async function handlePost(supabase: any, event: HandlerEvent, userId: string) {
  const body = JSON.parse(event.body || '{}');

  // Validate required fields
  if (!body.code || !body.description || !body.discount_type || body.discount_value === undefined) {
    return error('Missing required fields: code, description, discount_type, discount_value', 400);
  }

  // Prepare data for insertion
  const promoData = {
    code: body.code,
    description: body.description,
    discount_type: body.discount_type,
    discount_value: body.discount_value,
    valid_from: body.valid_from || new Date().toISOString(),
    valid_until: body.valid_until || null,
    max_uses: body.max_uses || null,
    max_uses_per_user: body.max_uses_per_user || 1,
    min_purchase_amount: body.min_purchase_amount || null,
    applicable_formations: body.applicable_formations || null,
    is_active: body.is_active !== undefined ? body.is_active : true,
    owner: body.owner || null,
    created_by: userId,
  };

  const { data, error: insertError } = await supabase
    .from('promo_codes')
    .insert(promoData)
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return error('Promo code already exists', 409);
    }
    console.error('Insert error:', insertError);
    return error('Error creating promo code', 500);
  }

  return success(data, 201);
}

// PUT - Update promo code
async function handlePut(supabase: any, event: HandlerEvent, promoCodeId: string | null) {
  if (!promoCodeId) {
    return error('Promo code ID is required', 400);
  }

  const body = JSON.parse(event.body || '{}');

  // Prepare update data (only include fields that are present)
  const updateData: any = {};

  if (body.code !== undefined) updateData.code = body.code;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.discount_type !== undefined) updateData.discount_type = body.discount_type;
  if (body.discount_value !== undefined) updateData.discount_value = body.discount_value;
  if (body.valid_from !== undefined) updateData.valid_from = body.valid_from;
  if (body.valid_until !== undefined) updateData.valid_until = body.valid_until;
  if (body.max_uses !== undefined) updateData.max_uses = body.max_uses;
  if (body.max_uses_per_user !== undefined) updateData.max_uses_per_user = body.max_uses_per_user;
  if (body.min_purchase_amount !== undefined) updateData.min_purchase_amount = body.min_purchase_amount;
  if (body.applicable_formations !== undefined) updateData.applicable_formations = body.applicable_formations;
  if (body.is_active !== undefined) updateData.is_active = body.is_active;
  if (body.owner !== undefined) updateData.owner = body.owner;

  if (Object.keys(updateData).length === 0) {
    return error('No fields to update', 400);
  }

  const { data, error: updateError } = await supabase
    .from('promo_codes')
    .update(updateData)
    .eq('id', promoCodeId)
    .select()
    .single();

  if (updateError) {
    if (updateError.code === '23505') {
      return error('Promo code already exists', 409);
    }
    console.error('Update error:', updateError);
    return error('Error updating promo code', 500);
  }

  return success(data);
}

// DELETE - Delete promo code
async function handleDelete(supabase: any, promoCodeId: string | null) {
  if (!promoCodeId) {
    return error('Promo code ID is required', 400);
  }

  const { error: deleteError } = await supabase
    .from('promo_codes')
    .delete()
    .eq('id', promoCodeId);

  if (deleteError) {
    console.error('Delete error:', deleteError);
    return error('Error deleting promo code', 500);
  }

  return success({ message: 'Promo code deleted successfully' });
}
