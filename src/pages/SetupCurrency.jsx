import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Coins, ArrowRight, Search, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { CURRENCIES } from '../utils/currency';

export default function SetupCurrency() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, updateCurrency, currencyUpdating } = useProfile(true);

  const [selectedCurrency, setSelectedCurrency] = useState(profile?.currency || 'INR');
  const [searchQuery, setSearchQuery] = useState('');

  // Auth guard
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = async () => {
    try {
      await updateCurrency(selectedCurrency);
      navigate('/setup-account');
    } catch {
      // Error handled by slice
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-body antialiased relative overflow-hidden">
      {/* Decorative background */}
      <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0"></div>
      <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30 z-0"></div>

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-[430px] mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-1 flex-1 rounded-full bg-primary"></div>
          <div className="h-1 flex-1 rounded-full bg-white/10"></div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Coins className="text-primary" size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            Welcome to <span className="text-primary">SpendWise</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
            Choose your primary currency. All your accounts and transactions will use this by default.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search currency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-card-dark border border-white/5 focus:border-primary/30 text-slate-100 text-sm focus:outline-none focus:ring-0 transition-all placeholder-slate-600"
          />
        </div>

        {/* Currency list */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[320px] no-scrollbar mb-8">
          {filteredCurrencies.map((currency) => {
            const isSelected = selectedCurrency === currency.code;
            return (
              <button
                key={currency.code}
                type="button"
                onClick={() => setSelectedCurrency(currency.code)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,230,203,0.08)]'
                    : 'border-white/5 bg-card-dark hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                    {currency.symbol}
                  </span>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {currency.code}
                    </p>
                    <p className="text-xs text-slate-500">{currency.name}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="size-3.5 text-background-dark" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}

          {filteredCurrencies.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No currencies found for "{searchQuery}"
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={currencyUpdating}
          className="w-full h-14 bg-primary text-background-dark font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
          {currencyUpdating ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="size-5" strokeWidth={3} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
