import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { HabitStreakTracker } from '../components/dashboard/HabitStreakTracker';
import { SpendingTrendGraph } from '../components/dashboard/SpendingTrendGraph';
import { RecentTransactionsList } from '../components/dashboard/RecentTransactionsList';
import { IncomeExpenseCard } from '../components/dashboard/IncomeExpenseCard';
import { DonutChart } from '../components/statistics/DonutChart';
import { BottomNav } from '../components/layout/BottomNav';
import { Loader2, WifiOff, AlertCircle, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refreshData } = useDashboard();
  const { data: profileData, loading: profileLoading } = useProfile(true);
  const currencyCode = profileData?.currency || 'INR';

  // Basic internet connectivity check
  const isOnline = navigator.onLine;

  useEffect(() => {
    // Force refresh if component mounts and we want fresh data
    if (user?.id && !data && !loading) {
      refreshData();
    }
  }, [user?.id, data, loading, refreshData]);

  // Offline Fallback UI
  if (!isOnline && !data) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-5">
        <WifiOff className="size-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">You are offline</h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Please check your internet connection and try again to view your dashboard.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-background-dark font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Loading State
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-5">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Loading Dashboard</p>
      </div>
    );
  }

  // Error State
  if (error && !data) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-5">
        <AlertCircle className="size-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-slate-400 text-center text-sm mb-6">{error}</p>
        <button
          onClick={refreshData}
          className="bg-primary text-background-dark font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (data && data.recentLogs?.length === 0 && data.balance === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-manrope antialiased pb-28">
        <DashboardHeader 
          user={user} 
          profile={profileData}
          profileLoading={profileLoading}
        />

        <main className="px-6 flex flex-col items-center justify-center mt-20 text-center">
          <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <PlusCircle className="size-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to SpendWise</h2>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">
            Your dashboard is looking a bit empty. Let's add your first transaction to get started!
          </p>
          <button 
            onClick={() => navigate('/add-transaction')}
            className="w-full bg-primary text-background-dark font-black tracking-tight py-3 rounded-xl active:scale-95 transition-transform shadow-[0_4px_20px_rgba(0,230,203,0.3)] mb-4"
          >
            Add First Transaction
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 pb-28 font-manrope antialiased">
      <DashboardHeader 
        user={user} 
        profile={profileData}
        profileLoading={profileLoading}
      />


      <main className="px-6 space-y-4 mt-2">
        {data ? (
          <>
            <BalanceCard
              balance={data.balance}
              currencyCode={currencyCode}
            />

            <IncomeExpenseCard
              income={data.monthSummary.income}
              expense={data.monthSummary.expense}
              savings={data.monthSummary.savings}
              currencyCode={currencyCode}
            />

            <section className="bg-card-dark/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Category Breakdown</h3>
              <DonutChart 
                totalSpent={data.monthSummary.expense} 
                currencyCode={currencyCode} 
                categories={data.categoryBreakdown} 
              />
            </section>

            <HabitStreakTracker
              streakDays={data.streak.days}
              logs={data.streak.logs}
            />

            <SpendingTrendGraph
              total={data.weeklyActivity.total}
              trendPercentage={data.weeklyActivity.trendPercentage}
              isPositive={data.weeklyActivity.isPositive}
              chartData={data.weeklyActivity.chartData}
              currencyCode={currencyCode}
            />

            <RecentTransactionsList logs={data.recentLogs} currencyCode={currencyCode} />
          </>
        ) : (
          <div className="flex justify-center items-center h-48 text-slate-500">
            Fetching your data...
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
