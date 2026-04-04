import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { usePlan } from '../hooks/usePlan';
import { 
  fetchTransactions, 
  selectAllTransactions, 
  selectTransactionsFilters 
} from '../store/slices/transactionsSlice';
import { fetchAccountsData, selectAccounts } from '../store/slices/accountsSlice';

import { BottomNav } from '../components/layout/BottomNav';
import { PageHeader } from '../components/layout/PageHeader';
import { UpgradeModal } from '../components/ui/UpgradeModal';
import { DonutChart } from '../components/statistics/DonutChart';
import { CategoryBreakdown } from '../components/statistics/CategoryBreakdown';
import { DetailedCategoryBreakdown } from '../components/statistics/DetailedCategoryBreakdown';
import { AccountBreakdown } from '../components/statistics/AccountBreakdown';
import { TransactionRow } from '../components/transactions/TransactionRow';
import { getCurrencySymbol, formatCurrency, convertCurrency } from '../utils/currency';
import { STATS_COLORS, DEFAULT_COLOR } from '../components/statistics/colors';

export default function Statistics() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data: profileData } = useProfile(true);
  const { isPlusUser } = usePlan();
  const currencyCode = profileData?.currency || 'INR';

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const transactions = useSelector(selectAllTransactions);
  const rawAccounts = useSelector(selectAccounts);

  const { historyMonthsLimit } = usePlan();
  const filters = useSelector(selectTransactionsFilters);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions({ userId: user.id, filters: { ...filters, historyMonthsLimit } }));
      dispatch(fetchAccountsData(user.id));
    }
  }, [user?.id, dispatch, filters, historyMonthsLimit]);

  // For Free plan, force current month. Plus defaults to current month until custom date range is selected.
  const currentYearMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (!isPlusUser) {
         return String(tx.date).startsWith(currentYearMonth);
      }
      return String(tx.date).startsWith(currentYearMonth); // Defaults to current month for now
    });
  }, [transactions, isPlusUser, currentYearMonth]);

  // Compute category breakdown data
  const { categoryData, totalExpense } = useMemo(() => {
    let total = 0;
    const groups = {};

    filteredTransactions.forEach(tx => {
      // Look at expenses only
      if (tx.type !== 'expense') return;
      
      const originalAmount = Number(tx.amount) || 0;
      const txCurrency = tx.accounts?.currency || 'INR';
      const convertedAmount = convertCurrency(originalAmount, txCurrency, currencyCode);
      
      total += convertedAmount;

      const catName = tx.categories?.name || 'Uncategorized';
      const catEmoji = tx.categories?.emoji || '❔';
      
      if (!groups[catName]) {
        groups[catName] = { name: catName, emoji: catEmoji, amount: 0 };
      }
      groups[catName].amount += convertedAmount;
    });

    // Convert to array
    let sortedCats = Object.values(groups)
      .map(g => ({
        ...g,
        percentage: total > 0 ? (g.amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Assign colors based on sorted index
    const coloredCats = sortedCats.map((cat, index) => ({
      ...cat,
      color: STATS_COLORS[index % STATS_COLORS.length]
    }));

    return { categoryData: coloredCats, totalExpense: total };
  }, [filteredTransactions, currencyCode]);

  // Compute account breakdown data
  const { accountsWithColors, totalBalance } = useMemo(() => {
    let total = 0;
    const validAccounts = [];

    rawAccounts.forEach(acc => {
      const bal = Number(acc.current_balance) || 0;
      const convertedBal = convertCurrency(bal, acc.currency || 'INR', currencyCode);
      
      if (bal > 0) {
        validAccounts.push({
          ...acc,
          converted_balance: convertedBal
        });
        total += convertedBal;
      }
    });

    const coloredAccounts = validAccounts.map((acc, index) => ({
      ...acc,
      color: STATS_COLORS[index % STATS_COLORS.length]
    }));

    // Sort by converted_balance desc
    coloredAccounts.sort((a, b) => b.converted_balance - a.converted_balance);

    return { accountsWithColors: coloredAccounts, totalBalance: total };
  }, [rawAccounts, currencyCode]);

  // Get last 3 records
  const recentTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
      return dateB - dateA;
    }).slice(0, 3);
  }, [filteredTransactions]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display pb-32">
      <PageHeader 
        title="Spending Overview"
        showBack={true}
        rightElement={
          <button 
            onClick={() => {
              if (!isPlusUser) {
                setUpgradeModalOpen(true);
              }
            }}
            aria-label="Calendar"
            className={`size-10 rounded-xl flex items-center justify-center transition-transform ${
              !isPlusUser 
                ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 opacity-60'
                : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 active:scale-95 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="size-5" />
          </button>
        }
      />

      <main className="px-6 space-y-8 mt-4">
        <section className="flex flex-col items-center justify-center pt-4">
          <DonutChart 
            totalSpent={totalExpense} 
            currencyCode={currencyCode} 
            categories={categoryData} 
          />
          <div className="w-full relative mt-8">
            <CategoryBreakdown categories={categoryData} />
          </div>
        </section>

        {categoryData.length > 0 && (
          <DetailedCategoryBreakdown 
            categories={categoryData} 
            currencyCode={currencyCode} 
          />
        )}

        {accountsWithColors.length > 0 && (
          <section className="space-y-4">
            <AccountBreakdown 
              accounts={accountsWithColors} 
              currencyCode={currencyCode} 
              totalBalance={totalBalance}
            />
          </section>
        )}

        {recentTransactions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Last Records</h2>
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  currencyCode={currencyCode}
                  onClick={() => navigate(`/edit-transaction/${tx.id}`)}
                />
              ))}
            </div>
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => navigate('/transactions')}
                className="text-primary font-bold text-sm tracking-widest uppercase hover:text-primary/80 transition-colors"
              >
                View More
              </button>
            </div>
          </section>
        )}
      </main>

      <UpgradeModal 
        isOpen={upgradeModalOpen} 
        onClose={() => setUpgradeModalOpen(false)} 
        featureName="Custom Date Ranges"
      />

      <BottomNav />
    </div>
  );
}
