import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactionById, 
  fetchCategoriesThunk, 
  fetchAccountsThunk, 
  fetchProfileThunk,
  updateTransactionThunk,
  deleteTransactionThunk,
  resetEditState,
  selectCurrentTransaction,
  selectEditCategories,
  selectEditAccounts,
  selectEditCurrency,
  selectEditStatus,
  selectSaveStatus,
  selectDeleteStatus,
  selectEditError
} from '../store/slices/editTransactionSlice';
import { useAuth } from './useAuth';
import { usePlan } from './usePlan';

/**
 * Hook to manage edit transaction state and actions
 * @param {string} id - Transaction ID
 */
export const useEditTransaction = (id) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { canManageCustomCategories } = usePlan();

  const transaction = useSelector(selectCurrentTransaction);
  const allCategories = useSelector(selectEditCategories);

  // Free users only see system categories; Plus users see all
  const categories = canManageCustomCategories
    ? allCategories
    : allCategories.filter((cat) => !cat.is_deletable);
  const accounts = useSelector(selectEditAccounts);
  const currency = useSelector(selectEditCurrency);
  const status = useSelector(selectEditStatus);
  const saveStatus = useSelector(selectSaveStatus);
  const deleteStatus = useSelector(selectDeleteStatus);
  const error = useSelector(selectEditError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTransactionById(id));
    }
    if (user?.id) {
      dispatch(fetchCategoriesThunk(user.id));
      dispatch(fetchAccountsThunk(user.id));
      dispatch(fetchProfileThunk(user.id));
    }

    return () => {
      dispatch(resetEditState());
    };
  }, [dispatch, id, user?.id]);

  const handleUpdate = async (payload) => {
    // Construct optimistic projection
    const selectedAccount = accounts.find(a => a.id === payload.account_id);
    const selectedCategory = categories.find(c => c.id === payload.category_id);

    const optimisticTx = {
      ...transaction,
      ...payload,
      accounts: selectedAccount || transaction.accounts,
      categories: selectedCategory || transaction.categories,
      status: 'updating'
    };

    return dispatch(updateTransactionThunk({ id, payload, optimisticTx, oldTx: transaction })).unwrap();
  };

  const handleDelete = async () => {
    return dispatch(deleteTransactionThunk({ id, oldTx: transaction })).unwrap();
  };

  return {
    transaction,
    categories,
    accounts,
    currency,
    status,
    saveStatus,
    deleteStatus,
    error,
    handleUpdate,
    handleDelete
  };
};
