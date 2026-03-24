import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDashboardData, 
  selectDashboardData, 
  selectDashboardLoading, 
  selectDashboardError 
} from '../store/slices/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useDispatch();
  
  // Try to get user from auth. Replace with actual auth state selector.
  // Assuming standard implementation:
  const user = useSelector((state) => state.auth?.user);
  
  const data = useSelector(selectDashboardData);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDashboardData(user.id));
    }
  }, [dispatch, user?.id]);

  const refreshData = () => {
    if (user?.id) {
      dispatch(fetchDashboardData(user.id));
    }
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};
