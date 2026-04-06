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
      })
      // submitTransaction (Optimistic)
      .addMatcher(
        (action) => action.type === 'addTransaction/submit/pending',
        (state, action) => {
          if (action.meta.arg.optimisticTx) {
            state.items = [action.meta.arg.optimisticTx, ...state.items];
          }
        }
      )
      .addMatcher(
        (action) => action.type === 'addTransaction/submit/fulfilled',
        (state, action) => {
          if (action.meta.arg.optimisticTx) {
            // Replace the optimistic transaction with the actual one from server
            state.items = state.items.map(item => 
              item.id === action.meta.arg.optimisticTx.id ? action.payload : item
            );
          }
        }
      )
      .addMatcher(
        (action) => action.type === 'addTransaction/submit/rejected',
        (state, action) => {
          if (action.meta.arg.optimisticTx) {
            // Remove the optimistic transaction on failure
            state.items = state.items.filter(item => item.id !== action.meta.arg.optimisticTx.id);
          }
        }
      )
      // updateTransaction (Optimistic)
      .addMatcher(
        (action) => action.type === 'editTransaction/update/pending',
        (state, action) => {
          if (action.meta.arg.optimisticTx) {
            state.items = state.items.map(item => 
              item.id === action.meta.arg.id ? action.meta.arg.optimisticTx : item
            );
          }
        }
      )
      .addMatcher(
        (action) => action.type === 'editTransaction/update/fulfilled',
        (state, action) => {
          // Sync with server data (id is action.payload.id)
          state.items = state.items.map(item => 
            item.id === action.payload.id ? action.payload : item
          );
        }
      )
      .addMatcher(
        (action) => action.type === 'editTransaction/update/rejected',
        (state, action) => {
          if (action.meta.arg.oldTx) {
            // Revert to old transaction state on failure
            state.items = state.items.map(item => 
              item.id === action.meta.arg.id ? action.meta.arg.oldTx : item
            );
          }
        }
      )
      // deleteTransaction (Optimistic)
      .addMatcher(
        (action) => action.type === 'editTransaction/delete/pending',
        (state, action) => {
          state.items = state.items.filter(item => item.id !== action.meta.arg.id);
        }
      )
      .addMatcher(
        (action) => action.type === 'editTransaction/delete/rejected',
        (state, action) => {
          if (action.meta.arg.oldTx) {
            // Revert back by re-adding the deleted transaction (approximate position)
            state.items = [action.meta.arg.oldTx, ...state.items];
          }
        }
      );
  },
});

export const { setFilters } = transactionsSlice.actions;

export default transactionsSlice.reducer;

// Selectors
export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectTransactionsFilters = (state) => state.transactions.filters;
