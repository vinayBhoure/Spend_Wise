import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccounts } from '../../services/accounts';
import { transactionsService } from '../../services/transactions';

// Thunks
export const fetchTransferAccounts = createAsyncThunk(
  'transferFunds/fetchAccounts',
  async (userId, { rejectWithValue }) => {
    try {
      const accounts = await fetchAccounts(userId);
      return accounts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitTransfer = createAsyncThunk(
  'transferFunds/submit',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await transactionsService.createTransfer(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const initialState = {
  accounts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  submitStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  submitError: null,
};

const transferFundsSlice = createSlice({
  name: 'transferFunds',
  initialState,
  reducers: {
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle';
      state.submitError = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Accounts
    builder.addCase(fetchTransferAccounts.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchTransferAccounts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.accounts = action.payload;
    });
    builder.addCase(fetchTransferAccounts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Submit Transfer
    builder.addCase(submitTransfer.pending, (state) => {
      state.submitStatus = 'loading';
      state.submitError = null;
    });
    builder.addCase(submitTransfer.fulfilled, (state) => {
      state.submitStatus = 'succeeded';
    });
    builder.addCase(submitTransfer.rejected, (state, action) => {
      state.submitStatus = 'failed';
      state.submitError = action.payload;
    });
  },
});

export const { resetSubmitStatus } = transferFundsSlice.actions;

export default transferFundsSlice.reducer;

// Selectors
export const selectTransferFundsData = (state) => ({
  accounts: state.transferFunds.accounts,
  status: state.transferFunds.status,
  error: state.transferFunds.error,
});
export const selectTransferSubmitState = (state) => ({
  submitStatus: state.transferFunds.submitStatus,
  submitError: state.transferFunds.submitError,
});
