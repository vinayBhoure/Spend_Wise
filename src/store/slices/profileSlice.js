import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfile, updateProfileCurrency, updateProfile, uploadAvatar, deleteUserAccount } from '../../services/profiles';

const initialState = {
  data: null,
  loading: false,
  error: null,
  currencyUpdating: false,
  profileUpdating: false,
  deleting: false,
};

export const fetchUserProfileThunk = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchProfile(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCurrencyThunk = createAsyncThunk(
  'profile/updateCurrency',
  async ({ userId, currency }, { rejectWithValue }) => {
    try {
      return await updateProfileCurrency(userId, currency);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, username, fullName, avatarFile }, { rejectWithValue }) => {
    try {
      let avatar_url;
      if (avatarFile) {
        avatar_url = await uploadAvatar(userId, avatarFile);
      }
      const updates = {};
      if (username !== undefined) updates.username = username;
      if (fullName !== undefined) updates.full_name = fullName;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      return await updateProfile(userId, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAccountThunk = createAsyncThunk(
  'profile/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      await deleteUserAccount();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfileData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update currency
      .addCase(updateCurrencyThunk.pending, (state) => {
        state.currencyUpdating = true;
        state.error = null;
      })
      .addCase(updateCurrencyThunk.fulfilled, (state, action) => {
        state.data = { ...state.data, currency: action.payload.currency };
        state.currencyUpdating = false;
      })
      .addCase(updateCurrencyThunk.rejected, (state, action) => {
        state.currencyUpdating = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfileThunk.pending, (state) => {
        state.profileUpdating = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
        state.profileUpdating = false;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.profileUpdating = false;
        state.error = action.payload;
      })
      // Delete user account
      .addCase(deleteUserAccountThunk.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteUserAccountThunk.fulfilled, (state) => {
        state.data = null;
        state.deleting = false;
      })
      .addCase(deleteUserAccountThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, clearProfileData } = profileSlice.actions;

export const selectProfileData = (state) => state.profile.data;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;
export const selectCurrencyUpdating = (state) => state.profile.currencyUpdating;
export const selectProfileUpdating = (state) => state.profile.profileUpdating;
export const selectProfileDeleting = (state) => state.profile.deleting;

export default profileSlice.reducer;
