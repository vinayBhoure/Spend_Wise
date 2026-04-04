import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  ensureOtherCategory,
} from '../../services/categories';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetchCategories',
  async (userId, { rejectWithValue }) => {
    try {
      const categories = await fetchCategories(userId);
      // Ensure "Other" catch-all exists for both income & expense
      const withOther = await ensureOtherCategory(userId, categories);
      return withOther;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  'categories/createCategory',
  async ({ userId, categoryData }, { rejectWithValue }) => {
    try {
      return await createCategory(userId, categoryData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, updates }, { rejectWithValue }) => {
    try {
      return await updateCategory(categoryId, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCategoriesError, clearCategories } = categoriesSlice.actions;

export const selectCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

export default categoriesSlice.reducer;
