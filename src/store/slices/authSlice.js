import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginWithEmail, signupWithEmail, logoutUser, getSession } from '../../services/auth';

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true, // Initial loading state (checking session)
  authActionLoading: false, // For login/signup button loading states
  error: null,
};

// Async thunks
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginWithEmail(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupUserThunk = createAsyncThunk(
  'auth/signupUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await signupWithEmail(username, email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    // Allows updating user session directly from Supabase auth listener
    setSession: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.isAuthenticated = !!action.payload?.user;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkSession
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.isAuthenticated = !!action.payload?.user;
        state.loading = false;
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // loginUserThunk
      .addCase(loginUserThunk.pending, (state) => {
        state.authActionLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
        state.authActionLoading = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.authActionLoading = false;
        state.error = action.payload;
      })
      
      // signupUserThunk
      .addCase(signupUserThunk.pending, (state) => {
        state.authActionLoading = true;
        state.error = null;
      })
      .addCase(signupUserThunk.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
        state.authActionLoading = false;
      })
      .addCase(signupUserThunk.rejected, (state, action) => {
        state.authActionLoading = false;
        state.error = action.payload;
      })

      // logoutUserThunk
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, setSession } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectSession = (state) => state.auth.session;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthActionLoading = (state) => state.auth.authActionLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
