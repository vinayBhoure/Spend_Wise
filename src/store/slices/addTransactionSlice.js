import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories } from '../../services/categories';
import { fetchAccounts } from '../../services/accounts';
import { transactionsService } from '../../services/transactions';

// Thunks
export const fetchFormData = createAsyncThunk(
  'addTransaction/fetchFormData',
  async (userId, { rejectWithValue }) => {
    try {
      const [categories, accounts] = await Promise.all([
        fetchCategories(userId),
        fetchAccounts(userId)
      ]);
      return { categories, accounts };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitTransaction = createAsyncThunk(
  'addTransaction/submit',
  async ({ payload }, { rejectWithValue }) => {
    try {
      const data = await transactionsService.createTransaction(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const initialState = {
  categories: [],
  accounts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  submitStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  submitError: null,
};

const addTransactionSlice = createSlice({
  name: 'addTransaction',
  initialState,
  reducers: {
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle';
      state.submitError = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Form Data
    builder.addCase(fetchFormData.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchFormData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.categories = action.payload.categories;
      state.accounts = action.payload.accounts;
    });
    builder.addCase(fetchFormData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Submit Transaction
    builder.addCase(submitTransaction.pending, (state) => {
      state.submitStatus = 'loading';
      state.submitError = null;
    });
    builder.addCase(submitTransaction.fulfilled, (state) => {
      state.submitStatus = 'succeeded';
    });
    builder.addCase(submitTransaction.rejected, (state, action) => {
      state.submitStatus = 'failed';
      state.submitError = action.payload;
    });
  },
});

export const { resetSubmitStatus } = addTransactionSlice.actions;

export default addTransactionSlice.reducer;

// Selectors
export const selectAddTransactionData = (state) => ({
  categories: state.addTransaction.categories,
  accounts: state.addTransaction.accounts,
  status: state.addTransaction.status,
  error: state.addTransaction.error,
});
export const selectAddTransactionSubmitState = (state) => ({
  submitStatus: state.addTransaction.submitStatus,
  submitError: state.addTransaction.submitError,
});
