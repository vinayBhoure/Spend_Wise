import { supabase } from '../lib/supabase';

/**
 * Fetches all categories for the current user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchCategories(userId) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, emoji, type, is_deletable')
    .eq('user_id', userId)
    .order('is_deletable', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Creates a new user category.
 * @param {string} userId
 * @param {{ name: string, emoji: string, type: string }} categoryData
 * @returns {Promise<object>}
 */
export async function createCategory(userId, { name, emoji, type }) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('categories')
    .insert({ user_id: userId, name, emoji, type, is_deletable: true })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Updates name and emoji of an existing category.
 * @param {string} categoryId
 * @param {{ name: string, emoji: string }} updates
 * @returns {Promise<object>}
 */
export async function updateCategory(categoryId, { name, emoji }) {
  if (!categoryId) throw new Error('Category ID is required');

  const { data, error } = await supabase
    .from('categories')
    .update({ name, emoji })
    .eq('id', categoryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deletes a user-created category.
 * @param {string} categoryId
 * @returns {Promise<void>}
 */
export async function deleteCategory(categoryId) {
  if (!categoryId) throw new Error('Category ID is required');

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) throw error;
}
