import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Landmark, Banknote, QrCode, CreditCard, ArrowRight, Loader2, AlertCircle, Pencil, Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useAccounts } from '../hooks/useAccounts';
import { getCurrencySymbol } from '../utils/currency';

const ACCOUNT_TYPES = [
  { id: 'bank', label: 'Bank', icon: Landmark },
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'upi', label: 'UPI', icon: QrCode },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
];

export default function SetupAccount() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, markOnboardingComplete } = useProfile(true);
  const { addAccount } = useAccounts();

  const selectedCurrency = profile?.currency || 'INR';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    initial_balance: '0.00',
  });

  // Auth guard
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBalanceChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    handleInputChange('initial_balance', val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addAccount({
        name: formData.name.trim(),
        type: formData.type,
        initial_balance: parseFloat(formData.initial_balance) || 0,
        currency: selectedCurrency,
      });
      await markOnboardingComplete();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-body antialiased relative overflow-hidden">
      {/* Decorative background */}
      <div className="fixed top-[-15%] right-[-15%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0"></div>
      <div className="fixed bottom-[-15%] left-[-15%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30 z-0"></div>

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-[430px] mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 flex-1 rounded-full bg-primary"></div>
          <div className="h-1 flex-1 rounded-full bg-primary"></div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Wallet className="text-primary" size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            Create your first <span className="text-primary">account</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
            Add a bank, cash, or UPI account to start tracking your finances.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          {/* Balance */}
          <div className="flex flex-col items-center gap-1 bg-card-dark p-5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Initial Balance</p>
            <div className="flex items-baseline justify-center gap-2 w-full">
              <span className="text-3xl font-bold text-primary">{getCurrencySymbol(selectedCurrency)}</span>
              <input
                className="bg-transparent border-none p-0 text-5xl font-extrabold text-center focus:outline-none focus:ring-0 w-full max-w-[200px] text-white placeholder-slate-800"
                placeholder="0.00"
                type="text"
                value={formData.initial_balance}
                onChange={handleBalanceChange}
              />
            </div>
          </div>

          {/* Account Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Account Name</label>
            <div className="relative group">
              <input
                className="w-full h-14 px-5 rounded-xl bg-card-dark border border-white/5 focus:border-primary/30 text-slate-100 focus:outline-none transition-all pr-12 focus:ring-0"
                placeholder="e.g. My Savings"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <div className="absolute right-4 top-4.5 text-slate-600 group-focus-within:text-primary transition-colors pointer-events-none">
                <Pencil className="size-5" />
              </div>
            </div>
          </div>

          {/* Account Type */}
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {ACCOUNT_TYPES.map(({ id, label, icon: Icon }) => {
                const isActive = formData.type === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleInputChange('type', id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,230,203,0.1)]'
                        : 'border-white/5 bg-card-dark text-slate-400 hover:border-slate-700/50'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 text-rose-500 text-xs font-semibold bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-auto bg-primary text-background-dark font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <span>Finish Setup</span>
                <ArrowRight className="size-5" strokeWidth={3} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
