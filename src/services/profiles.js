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
 * Uploads an avatar image to the Supabase avatars bucket.
 * Path: {userId}/{timestamp}.{ext}
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadAvatar(userId, file) {
  if (!userId) throw new Error('User ID is required');
  if (!file) throw new Error('File is required');

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Updates the user's profile (username, full_name, avatar_url).
 * @param {string} userId
 * @param {{ username?: string, full_name?: string, avatar_url?: string }} updates
 * @returns {Promise<object>}
 */
export async function updateProfile(userId, updates) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, username, full_name, avatar_url, currency')
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
