import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../store/slices/authSlice';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};
