import { supabase } from '../lib/supabase';

/**
 * Fetches all non-archived accounts for the current user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchAccounts(userId) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('accounts')
    .select('id, name, type, current_balance, initial_balance, currency, is_archived, exclude_from_transactions, created_at')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Creates a new account for the user.
 * @param {string} userId
 * @param {{ name: string, type: string, initial_balance: number, currency: string }} accountData
 * @returns {Promise<Object>}
 */
export async function createAccount(userId, accountData) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      user_id: userId,
      name: accountData.name,
      type: accountData.type,
      initial_balance: accountData.initial_balance || 0,
      current_balance: accountData.initial_balance || 0,
      currency: accountData.currency || 'INR',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Archives an account (soft delete).
 * @param {string} accountId
 * @returns {Promise<Object>}
 */
export async function archiveAccount(accountId) {
  if (!accountId) throw new Error('Account ID is required');

  const { data, error } = await supabase
    .from('accounts')
    .update({ is_archived: true })
    .eq('id', accountId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Updates an existing account.
 * @param {string} accountId
 * @param {{ name: string, type: string, initial_balance: number, current_balance: number, exclude_from_transactions: boolean }} accountData
 * @returns {Promise<Object>}
 */
export async function updateAccount(accountId, accountData) {
  if (!accountId) throw new Error('Account ID is required');

  const { data, error } = await supabase
    .from('accounts')
    .update({
      name: accountData.name,
      type: accountData.type,
      initial_balance: accountData.initial_balance,
      current_balance: accountData.current_balance,
      exclude_from_transactions: accountData.exclude_from_transactions,
      updated_at: new Date().toISOString(),
    })
    .eq('id', accountId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Permanently deletes an account.
 * @param {string} accountId
 * @returns {Promise<void>}
 */
export async function deleteAccountPermanent(accountId) {
  if (!accountId) throw new Error('Account ID is required');

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId);

  if (error) throw error;
}
