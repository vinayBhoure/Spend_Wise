import { supabase } from '../lib/supabase';

/**
 * Fetches the user's profile row (includes currency preference).
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function fetchProfile(userId) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, currency')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Updates the user's preferred currency.
 * @param {string} userId
 * @param {string} currency
 * @returns {Promise<object>}
 */
export async function updateProfileCurrency(userId, currency) {
  if (!userId) throw new Error('User ID is required');
  if (!currency) throw new Error('Currency is required');

  const { data, error } = await supabase
    .from('profiles')
    .update({ currency })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deletes the entire user account and all associated data via RPC.
 * @returns {Promise<void>}
 */
export async function deleteUserAccount() {
  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;
}
