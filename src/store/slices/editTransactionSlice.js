import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsService } from '../../services/transactions';
import { fetchCategories } from '../../services/categories';
import { fetchAccounts } from '../../services/accounts';
import { fetchProfile } from '../../services/profiles';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchTransactionById = createAsyncThunk(
  'editTransaction/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await transactionsService.fetchTransactionById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoriesThunk = createAsyncThunk(
  'editTransaction/fetchCategories',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchCategories(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAccountsThunk = createAsyncThunk(
  'editTransaction/fetchAccounts',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchAccounts(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfileThunk = createAsyncThunk(
  'editTransaction/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchProfile(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTransactionThunk = createAsyncThunk(
  'editTransaction/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await transactionsService.updateTransaction(id, payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTransactionThunk = createAsyncThunk(
  'editTransaction/delete',
  async (id, { rejectWithValue }) => {
    try {
      await transactionsService.deleteTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  currentTransaction: null,
  categories: [],
  accounts: [],
  currency: 'INR',
  status: 'idle',           // fetch status: 'idle' | 'loading' | 'succeeded' | 'failed'
  saveStatus: 'idle',       // update status
  deleteStatus: 'idle',     // delete status
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const editTransactionSlice = createSlice({
  name: 'editTransaction',
  initialState,
  reducers: {
    resetEditState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchTransactionById
      .addCase(fetchTransactionById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetchCategoriesThunk
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // fetchAccountsThunk
      .addCase(fetchAccountsThunk.fulfilled, (state, action) => {
        state.accounts = action.payload;
      })

      // fetchProfileThunk — only persist currency
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.currency = action.payload?.currency ?? 'INR';
      })

      // updateTransactionThunk
      .addCase(updateTransactionThunk.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.currentTransaction = action.payload;
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload;
      })

      // deleteTransactionThunk
      .addCase(deleteTransactionThunk.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteTransactionThunk.fulfilled, (state) => {
        state.deleteStatus = 'succeeded';
        state.currentTransaction = null;
      })
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetEditState } = editTransactionSlice.actions;

export default editTransactionSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentTransaction = (state) => state.editTransaction.currentTransaction;
export const selectEditCategories    = (state) => state.editTransaction.categories;
export const selectEditAccounts      = (state) => state.editTransaction.accounts;
export const selectEditCurrency      = (state) => state.editTransaction.currency;
export const selectEditStatus        = (state) => state.editTransaction.status;
export const selectSaveStatus        = (state) => state.editTransaction.saveStatus;
export const selectDeleteStatus      = (state) => state.editTransaction.deleteStatus;
export const selectEditError         = (state) => state.editTransaction.error;
