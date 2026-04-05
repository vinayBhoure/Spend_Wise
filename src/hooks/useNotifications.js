import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  selectAllNotifications,
  selectNotificationsStatus,
  selectNotificationsError,
  selectUnreadCount,
  clearError
} from '../store/slices/notificationsSlice';

/**
 * Custom hook for managing notifications state and actions
 * @returns {object} Notifications data and control functions
 */
export const useNotifications = () => {
  const dispatch = useDispatch();
  
  const notifications = useSelector(selectAllNotifications);
  const status = useSelector(selectNotificationsStatus);
  const error = useSelector(selectNotificationsError);
  const unreadCount = useSelector(selectUnreadCount);

  const refreshNotifications = useCallback(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const markNotificationAsRead = useCallback((id) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  const markAllRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const removeNotification = useCallback((id) => {
    dispatch(deleteNotification(id));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-fetch if idle
  useEffect(() => {
    if (status === 'idle') {
      refreshNotifications();
    }
  }, [status, refreshNotifications]);

  return {
    notifications,
    status,
    error,
    unreadCount,
    loading: status === 'loading',
    refreshNotifications,
    markNotificationAsRead,
    markAllRead,
    removeNotification,
    resetError
  };
};
