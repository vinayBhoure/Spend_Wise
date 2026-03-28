import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccounts, createAccount, archiveAccount, updateAccount, deleteAccountPermanent } from '../../services/accounts';
import { convertCurrency } from '../../utils/currency';

// ---------- Async Thunks ----------

export const fetchAccountsData = createAsyncThunk(
  'accounts/fetchAccountsData',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchAccounts(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewAccount = createAsyncThunk(
  'accounts/addNewAccount',
  async ({ userId, accountData }, { rejectWithValue }) => {
    try {
      return await createAccount(userId, accountData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAccountThunk = createAsyncThunk(
  'accounts/updateAccount',
  async ({ accountId, accountData }, { rejectWithValue }) => {
    try {
      const data = await updateAccount(accountId, accountData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const archiveAccountThunk = createAsyncThunk(
  'accounts/archiveAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      await archiveAccount(accountId);
      return accountId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAccountThunk = createAsyncThunk(
  'accounts/deleteAccountPermanent',
  async (accountId, { rejectWithValue }) => {
    try {
      await deleteAccountPermanent(accountId);
      return accountId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---------- Slice ----------

const initialState = {
  accounts: [],
  loading: false,
  error: null,
  filter: 'all', // 'all' | 'bank' | 'cash' | 'upi' | 'credit_card'
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearAccountsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAccountsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsData.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccountsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch accounts';
      })
      // Add
      .addCase(addNewAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      // Update
      .addCase(updateAccountThunk.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      // Archive
      .addCase(archiveAccountThunk.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
      })
      // Delete
      .addCase(deleteAccountThunk.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
      });
  },
});

export const { setFilter, clearAccountsError } = accountsSlice.actions;

// ---------- Selectors ----------

export const selectAccounts = (state) => state.accounts.accounts;
export const selectAccountsLoading = (state) => state.accounts.loading;
export const selectAccountsError = (state) => state.accounts.error;
export const selectActiveFilter = (state) => state.accounts.filter;

export const selectNetWorth = (state) => {
  const userCurrency = state.profile.data?.currency || 'INR';
  return state.accounts.accounts.reduce((sum, acc) => {
    const balance = Number(acc.current_balance) || 0;
    const converted = convertCurrency(balance, acc.currency || 'INR', userCurrency);
    return sum + converted;
  }, 0);
};

export const selectFilteredAccounts = (state) => {
  const filter = state.accounts.filter;
  const accounts = state.accounts.accounts;
  if (filter === 'all') return accounts;
  return accounts.filter((a) => a.type === filter);
};

export default accountsSlice.reducer;
