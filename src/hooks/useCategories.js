import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  clearCategoriesError,
} from '../store/slices/categoriesSlice';
import { useAuth } from './useAuth';
import { usePlan } from './usePlan';

export const useCategories = (autoFetch = false) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { canManageCustomCategories } = usePlan();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  const fetchAll = useCallback(() => {
    if (user?.id) {
      dispatch(fetchCategoriesThunk(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (autoFetch && user?.id && categories.length === 0 && !loading) {
      fetchAll();
    }
  }, [autoFetch, user?.id, categories.length, loading, fetchAll]);

  const addCategory = useCallback(
    (categoryData) => {
      if (!canManageCustomCategories) {
        return Promise.reject(new Error('Custom categories require Plus plan'));
      }
      if (user?.id) {
        return dispatch(createCategoryThunk({ userId: user.id, categoryData })).unwrap();
      }
    },
    [dispatch, user?.id, canManageCustomCategories]
  );

  const editCategory = useCallback(
    (categoryId, updates) => {
      if (!canManageCustomCategories) {
        return Promise.reject(new Error('Editing categories requires Plus plan'));
      }
      return dispatch(updateCategoryThunk({ categoryId, updates })).unwrap();
    },
    [dispatch, canManageCustomCategories]
  );

  const removeCategory = useCallback(
    (categoryId) => {
      if (!canManageCustomCategories) {
        return Promise.reject(new Error('Deleting categories requires Plus plan'));
      }
      return dispatch(deleteCategoryThunk(categoryId)).unwrap();
    },
    [dispatch, canManageCustomCategories]
  );

  const clearError = useCallback(() => {
    dispatch(clearCategoriesError());
  }, [dispatch]);

  return {
    categories,
    loading,
    error,
    fetchAll,
    addCategory,
    editCategory,
    removeCategory,
    clearError,
  };
};
