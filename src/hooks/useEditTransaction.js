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

/**
 * Hook to manage edit transaction state and actions
 * @param {string} id - Transaction ID
 */
export const useEditTransaction = (id) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const transaction = useSelector(selectCurrentTransaction);
  const categories = useSelector(selectEditCategories);
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
    return dispatch(updateTransactionThunk({ id, payload })).unwrap();
  };

  const handleDelete = async () => {
    return dispatch(deleteTransactionThunk(id)).unwrap();
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
