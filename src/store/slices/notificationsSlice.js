import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchNotifications as fetchNotificationsService, 
  markNotificationAsRead as markAsReadService,
  markAllNotificationsAsRead as markAllAsReadService,
  deleteNotification as deleteNotificationService 
} from '../../services/notifications';

// --- THUNKS ---

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    const { data, error } = await fetchNotificationsService();
    if (error) return rejectWithValue(error);
    return data;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    const { success, error } = await markAsReadService(id);
    if (error) return rejectWithValue(error);
    return id;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    const { success, error } = await markAllAsReadService();
    if (error) return rejectWithValue(error);
    return true;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    const { success, error } = await deleteNotificationService(id);
    if (error) return rejectWithValue(error);
    return id;
  }
);

// --- SLICE ---

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  unreadCount: 0
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const item = state.items.find(n => n.id === action.payload);
        if (item && !item.is_read) {
          item.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach(item => {
          item.is_read = true;
        });
        state.unreadCount = 0;
      })
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const itemToDelete = state.items.find(n => n.id === action.payload);
        if (itemToDelete && !itemToDelete.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter(n => n.id !== action.payload);
      });
  }
});

// --- EXPORTS ---

export const { clearError } = notificationsSlice.actions;

// Selectors
export const selectAllNotifications = (state) => state.notifications.items;
export const selectNotificationsStatus = (state) => state.notifications.status;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export default notificationsSlice.reducer;
