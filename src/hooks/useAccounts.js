import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAccountsData,
  addNewAccount,
  updateAccountThunk,
  archiveAccountThunk,
  deleteAccountThunk,
  setFilter,
  selectAccounts,
  selectFilteredAccounts,
  selectAccountsLoading,
  selectAccountsError,
  selectNetWorth,
  selectActiveFilter,
} from '../store/slices/accountsSlice';

export const useAccounts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const accounts = useSelector(selectAccounts);
  const filteredAccounts = useSelector(selectFilteredAccounts);
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);
  const netWorth = useSelector(selectNetWorth);
  const filter = useSelector(selectActiveFilter);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccountsData(user.id));
    }
  }, [dispatch, user?.id]);

  const refreshAccounts = useCallback(() => {
    if (user?.id) {
      dispatch(fetchAccountsData(user.id));
    }
  }, [dispatch, user?.id]);

  const changeFilter = useCallback(
    (newFilter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch]
  );

  const addAccount = useCallback(
    async (accountData) => {
      if (user?.id) {
        return dispatch(addNewAccount({ userId: user.id, accountData })).unwrap();
      }
    },
    [dispatch, user?.id]
  );

  const removeAccount = useCallback(
    async (accountId) => {
      return dispatch(archiveAccountThunk(accountId)).unwrap();
    },
    [dispatch]
  );

  const updateAccount = useCallback(
    async (accountId, accountData) => {
      return dispatch(updateAccountThunk({ accountId, accountData })).unwrap();
    },
    [dispatch]
  );

  const deleteAccountPermanently = useCallback(
    async (accountId) => {
      return dispatch(deleteAccountThunk(accountId)).unwrap();
    },
    [dispatch]
  );

  return {
    accounts,
    filteredAccounts,
    netWorth,
    loading,
    error,
    filter,
    changeFilter,
    addAccount,
    updateAccount,
    removeAccount,
    deleteAccountPermanently,
    refreshAccounts,
  };
};
