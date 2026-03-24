import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { HabitStreakTracker } from '../components/dashboard/HabitStreakTracker';
import { SpendingTrendGraph } from '../components/dashboard/SpendingTrendGraph';
import { RecentTransactionsList } from '../components/dashboard/RecentTransactionsList';
import { BottomNav } from '../components/layout/BottomNav';
import { Loader2, WifiOff, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data, loading, error, refreshData } = useDashboard();
  const { data: profileData } = useProfile(true);
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
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-6">
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
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-6">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Loading Dashboard</p>
      </div>
    );
  }

  // Error State
  if (error && !data) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-6">
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

  // Empty State handled implicitly if data exists but zero balance, etc.
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 pb-28 font-manrope antialiased">
      <DashboardHeader 
        user={user} 
        notificationsCount={1} // Example notification count
      />
      
      <main className="px-6 space-y-8 mt-2">
        {data ? (
          <>
            <BalanceCard 
              balance={data.balance} 
              budgetTotal={data.budget.total}
              budgetUsed={data.budget.used}
              budgetPercentage={data.budget.percentage}
              currencyCode={currencyCode}
            />
            
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
