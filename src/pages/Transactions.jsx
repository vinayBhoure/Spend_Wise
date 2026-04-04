import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransactions,
  selectAllTransactions,
  selectTransactionsStatus,
  selectTransactionsError,
  selectTransactionsFilters,
  setFilters
} from '../store/slices/transactionsSlice';
import { fetchCategoriesThunk, selectCategories } from '../store/slices/categoriesSlice';
import { fetchAccountsData, selectAccounts } from '../store/slices/accountsSlice';
import { TransactionsHeader } from '../components/transactions/TransactionsHeader';
import { TransactionGroup } from '../components/transactions/TransactionGroup';
import { TransactionFilter } from '../components/ui/TransactionFilter';
import { BottomNav } from '../components/layout/BottomNav';
import { ReceiptText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { usePlan } from '../hooks/usePlan';
import { formatCurrency } from '../utils/currency';

// Helper to group transactions by date
const groupTransactionsByDate = (transactions) => {
  const groups = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  transactions.forEach(tx => {
    const txDateStr = tx.date; // format: "2023-10-15"
    if (!txDateStr) return;

    const [year, month, day] = txDateStr.split('-').map(Number);
    const txDate = new Date(year, month - 1, day);

    let groupLabel = txDateStr;

    if (txDate.getTime() === today.getTime()) {
      groupLabel = 'Today';
    } else if (txDate.getTime() === yesterday.getTime()) {
      groupLabel = 'Yesterday';
    } else {
      // Format as "Oct 15, 2023"
      groupLabel = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    if (!groups[groupLabel]) {
      groups[groupLabel] = {
        title: groupLabel,
        transactions: [],
        totalBase: 0 // to sum expenses
      };
    }

    groups[groupLabel].transactions.push(tx);
    if (tx.type === 'expense') {
      groups[groupLabel].totalBase -= Number(tx.amount);
    } else if (tx.type === 'income') {
      groups[groupLabel].totalBase += Number(tx.amount);
    }
  });

  // Convert object to array
  return Object.values(groups);
};

export const Transactions = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data: profileData } = useProfile(true);
  const currencyCode = profileData?.currency || 'INR';

  const transactions = useSelector(selectAllTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const filters = useSelector(selectTransactionsFilters);
  const categories = useSelector(selectCategories);
  const accounts = useSelector(selectAccounts);
  const { historyMonthsLimit } = usePlan();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate active filter count
  let activeFilterCount = 0;
  if (filters.startDate || filters.endDate) activeFilterCount += 1;
  if (filters.type !== 'all') activeFilterCount += 1;
  if (filters.minAmount || filters.maxAmount) activeFilterCount += 1;
  if (filters.categories && filters.categories.length > 0) activeFilterCount += 1;
  if (filters.accounts && filters.accounts.length > 0) activeFilterCount += 1;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions({ userId: user.id, filters: { ...filters, historyMonthsLimit } }));
      
      if (categories.length === 0) dispatch(fetchCategoriesThunk(user.id));
      if (accounts.length === 0) dispatch(fetchAccountsData(user.id));
    }
  }, [dispatch, user, filters, historyMonthsLimit]); // deliberately excluding categories/accounts to avoid over-fetching

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen flex flex-col">
      <TransactionsHeader
        onOpenFilter={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <main className="flex-1 px-6 pb-32">

        {/* State Handling */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading transactions...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
            <p className="text-rose-500 font-bold mb-2">Failed to load data</p>
            <p className="text-slate-400 text-sm">{error}</p>
            <button
              onClick={() => {
                dispatch(fetchTransactions({ userId: user.id, filters: { ...filters, historyMonthsLimit } }));
              }}
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'succeeded' && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-500">
              <ReceiptText size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">No Transactions Yet</h3>
            <p className="text-slate-500 text-sm">When you spend or receive money, it will show up here.</p>
          </div>
        )}

        {status === 'succeeded' && transactions.length > 0 && (
          <div className="space-y-10">
            {groupedTransactions.map((group) => (
              <TransactionGroup
                key={group.title}
                title={group.title}
                transactions={group.transactions}
                summaryTotal={group.totalBase}
                currencyCode={currencyCode}
              />
            ))}
          </div>
        )}
      </main>

      <TransactionFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={filters}
        onApply={(newFilters) => {
          dispatch(setFilters(newFilters));
          setIsFilterOpen(false);
        }}
      />

      <BottomNav />
    </div>
  );
};

export default Transactions;
