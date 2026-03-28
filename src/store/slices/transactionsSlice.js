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

export const fetchTransactionsSummary = createAsyncThunk(
  'transactions/fetchSummary',
  async (userId, { rejectWithValue }) => {
    try {
      return await transactionsService.fetchTransactionsSummary(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  summary: {
    totalSpent: 0,
    remaining: 0,
    percentageUsed: 0
  },
  filters: {
    period: 'all',
    type: 'all',
    includeTransfers: true
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
      })
      // fetchTransactionsSummary
      .addCase(fetchTransactionsSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export const { setFilters } = transactionsSlice.actions;

export default transactionsSlice.reducer;

// Selectors
export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectTransactionsSummary = (state) => state.transactions.summary;
export const selectTransactionsFilters = (state) => state.transactions.filters;
