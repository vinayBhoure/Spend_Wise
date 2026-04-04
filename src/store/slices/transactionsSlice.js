import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsService } from '../../services/transactions';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async ({ userId, filters }, { rejectWithValue }) => {
    try {
      return await transactionsService.fetchTransactions(userId, filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  items: [],
  filters: {
    startDate: '', // YYYY-MM-DD string
    endDate: '',   // YYYY-MM-DD string
    type: 'all',   // 'all', 'income', 'expense', 'transfer'
    minAmount: '',
    maxAmount: '',
    categories: [], // Array of category IDs
    accounts: [],   // Array of account IDs
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
        // fetchTransactions
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilters } = transactionsSlice.actions;

export default transactionsSlice.reducer;

// Selectors
export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectTransactionsFilters = (state) => state.transactions.filters;
