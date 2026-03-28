import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, WifiOff, Wallet } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { useProfile } from '../hooks/useProfile';
import { NetWorthCard } from '../components/accounts/NetWorthCard';
import { AccountFilters } from '../components/accounts/AccountFilters';
import { AccountCard } from '../components/accounts/AccountCard';
import { AddAccountButton } from '../components/accounts/AddAccountButton';
import { BottomNav } from '../components/layout/BottomNav';
import { PageHeader } from '../components/layout/PageHeader';

export default function Accounts() {
  const navigate = useNavigate();
  const {
    filteredAccounts,
    netWorth,
    loading,
    error,
    filter,
    changeFilter,
    refreshAccounts,
  } = useAccounts();
  const { data: profileData } = useProfile(true);
  const selectedCurrency = profileData?.currency || 'INR';

  const isOnline = navigator.onLine;

  // ---------- Offline ----------
  if (!isOnline && !filteredAccounts.length) {
    return (
      <div className="min-h-screen max-w-[430px] mx-auto bg-background-dark text-slate-100 flex flex-col items-center justify-center p-6">
        <WifiOff className="size-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">You are offline</h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Check your connection and try again to view accounts.
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

  // ---------- Loading ----------
  if (loading && !filteredAccounts.length) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-6">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">
          Loading Accounts
        </p>
      </div>
    );
  }

  // ---------- Error ----------
  if (error && !filteredAccounts.length) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-6">
        <AlertCircle className="size-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-slate-400 text-center text-sm mb-6">{error}</p>
        <button
          onClick={refreshAccounts}
          className="bg-primary text-background-dark font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---------- Status for NetWorthCard ----------
  const netWorthStatus = loading ? 'loading' : filteredAccounts.length === 0 && filter === 'all' ? 'empty' : 'ready';

  return (
    <div className="min-h-screen max-w-[430px] mx-auto bg-background-dark text-slate-100 pb-28 font-manrope antialiased overflow-x-hidden">
      <PageHeader 
        title="Accounts"
        showBack={true}
        onBack={() => navigate('/settings')}
      />

      <main className="px-6 pb-8">
        <NetWorthCard netWorth={netWorth} currency={selectedCurrency} status={netWorthStatus} />

        <AccountFilters activeFilter={filter} onFilterChange={changeFilter} />

        {/* Account List */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
            Your Institutions
          </h3>

          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} netWorth={netWorth} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Wallet className="size-12 mb-3 opacity-40" />
              <p className="font-semibold text-sm">No accounts found</p>
              <p className="text-xs text-slate-600 mt-1">
                {filter !== 'all'
                  ? `You don't have any ${filter === 'credit_card' ? 'debt' : filter} accounts yet.`
                  : 'Add your first account to get started.'}
              </p>
            </div>
          )}

          <AddAccountButton onClick={() => navigate('/add-account')} />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
