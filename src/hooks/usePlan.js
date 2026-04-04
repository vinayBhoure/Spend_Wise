import { useSelector } from 'react-redux';
import { selectProfileData } from '../store/slices/profileSlice';

/**
 * @typedef {Object} PlanInfo
 * @property {'free' | 'plus'} plan - Current user plan
 * @property {boolean} isPlusUser - Whether the user is on Plus
 * @property {boolean} canManageCustomCategories - Whether user can CRUD custom categories
 * @property {number} maxAccounts - Maximum number of accounts allowed
 * @property {number|null} historyMonthsLimit - Limit in months for transaction history (null for unlimited)
 * @property {boolean} canMultiSelectFilters - Whether the user can select multiple filters
 */

/**
 * Hook to check current user's subscription plan and feature gates.
 * Reads from the profile data already in Redux — no extra fetch needed.
 * @returns {PlanInfo}
 */
export const usePlan = () => {
  const profile = useSelector(selectProfileData);
  const plan = profile?.plan ?? 'free';
  const isPlusUser = plan === 'plus';

  return {
    plan,
    isPlusUser,
    canManageCustomCategories: isPlusUser,
    maxAccounts: isPlusUser ? Infinity : 3,
    historyMonthsLimit: isPlusUser ? null : 6,
    canMultiSelectFilters: isPlusUser
  };
};
