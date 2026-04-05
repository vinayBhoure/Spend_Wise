import { supabase } from '../lib/supabase';

/**
 * Fetch all notifications for the current user
 * @returns {Promise<{data: any[], error: string | null}>}
 */
export const fetchNotifications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error in fetchNotifications:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Mark a single notification as read
 * @param {string} notificationId 
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Mark all user notifications as read
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a notification
 * @param {string} notificationId 
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const deleteNotification = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteNotification:', error.message);
    return { success: false, error: error.message };
  }
};
