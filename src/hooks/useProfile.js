import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfileThunk,
  updateCurrencyThunk,
  updateProfileThunk,
  deleteUserAccountThunk,
  markOnboardingCompleteThunk,
  selectProfileData,
  selectProfileLoading,
  selectProfileError,
  selectCurrencyUpdating,
  selectProfileUpdating,
  selectProfileDeleting,
  selectIsOnboarded,
  clearProfileError,
} from '../store/slices/profileSlice';
import { useAuth } from './useAuth';

export const useProfile = (autoFetch = false) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const data = useSelector(selectProfileData);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);
  const currencyUpdating = useSelector(selectCurrencyUpdating);
  const profileUpdating = useSelector(selectProfileUpdating);
  const deleting = useSelector(selectProfileDeleting);
  const isOnboarded = useSelector(selectIsOnboarded);

  const fetchUserProfile = useCallback(() => {
    if (user?.id) {
      dispatch(fetchUserProfileThunk(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (autoFetch && user?.id && !data && !loading) {
      fetchUserProfile();
    }
  }, [autoFetch, user?.id, data, loading, fetchUserProfile]);

  const updateCurrency = useCallback(
    (currency) => {
      if (user?.id) {
        return dispatch(updateCurrencyThunk({ userId: user.id, currency })).unwrap();
      }
    },
    [dispatch, user?.id]
  );

  const updateProfileDetails = useCallback(
    ({ username, fullName, avatarFile }) => {
      if (user?.id) {
        return dispatch(
          updateProfileThunk({ userId: user.id, username, fullName, avatarFile })
        ).unwrap();
      }
    },
    [dispatch, user?.id]
  );

  const deleteAccount = useCallback(() => {
    return dispatch(deleteUserAccountThunk()).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearProfileError());
  }, [dispatch]);

  const markOnboardingComplete = useCallback(() => {
    if (user?.id) {
      return dispatch(markOnboardingCompleteThunk(user.id)).unwrap();
    }
  }, [dispatch, user?.id]);

  return {
    data,
    loading,
    error,
    currencyUpdating,
    profileUpdating,
    deleting,
    isOnboarded,
    fetchUserProfile,
    updateCurrency,
    updateProfileDetails,
    deleteAccount,
    clearError,
    markOnboardingComplete,
  };
};
