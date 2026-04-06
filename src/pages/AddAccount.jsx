import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Landmark, Banknote, QrCode, CreditCard, ArrowRight, Loader2, AlertCircle, Pencil, Wallet } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { useProfile } from '../hooks/useProfile';
import { usePlan } from '../hooks/usePlan';
import { getCurrencySymbol } from '../utils/currency';
import { PageHeader } from '../components/layout/PageHeader';

const ACCOUNT_TYPES = [
  { id: 'bank', label: 'Bank', icon: Landmark },
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'upi', label: 'UPI', icon: QrCode },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
];

export default function AddAccount() {
  const navigate = useNavigate();
  const { addAccount, accounts } = useAccounts();
  const { data: profileData } = useProfile(true);
  const { maxAccounts } = usePlan();
  const selectedCurrency = profileData?.currency || 'INR';

  const isLimitReached = accounts.length >= maxAccounts;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    initial_balance: '0.00'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        currency: selectedCurrency
      });
      navigate('/accounts');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-background-dark text-slate-100 flex flex-col font-manrope antialiased overflow-hidden">
      <PageHeader 
        title="Add New Account"
        showBack={true}
        onBack={() => navigate('/accounts')}
      />

      <main className="flex-1 px-6 pt-4 pb-6 overflow-y-auto no-scrollbar">
        {loading && !accounts.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center mx-auto">
            <Loader2 className="size-10 text-primary animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Checking account limits...</p>
          </div>
        ) : isLimitReached ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-[340px] mx-auto px-6">
            <div className="size-20 rounded-[2rem] bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.1)] border border-amber-500/20">
              <AlertCircle size={40} className="text-amber-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-7">Account Limit <br/> Reached</h3>
            <p className="text-slate-400 text-[15px] font-medium leading-relaxed mb-6">
              The Free plan allows up to <span className="text-white font-bold">{maxAccounts} accounts</span>. Upgrade to Plus for unlimited institutional tracking.
            </p>
            <button
              onClick={() => navigate('/plans')}
              className="w-full h-14 bg-amber-500 text-amber-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>Explore Plus Plan</span>
              <ArrowRight className="size-5" strokeWidth={3} />
            </button>
            <button 
              onClick={() => navigate('/accounts')}
              className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
        <form id="add-account-form" onSubmit={handleSubmit} className="flex flex-col h-full justify-between max-w-[400px] mx-auto">
          <div className="flex flex-col gap-5">
            {/* Abstract Hero Pattern */}
            <div className="relative h-24 shrink-0 w-full rounded-2xl overflow-hidden bg-primary/5 border border-primary/10">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#00e6cb,transparent_70%)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wallet className="size-10 text-primary opacity-80" />
              </div>
            </div>

            {/* Initial Balance Large Field */}
            <div className="flex flex-col items-center gap-1 shrink-0 bg-card-dark p-4 rounded-2xl border border-white/5">
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

          {/* Form Fields */}
          <div className="space-y-4">
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

            {/* Account Type Selector */}
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
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${isActive
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
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 text-rose-500 text-xs font-semibold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 mt-4">
              <AlertCircle className="size-4" />
              <span>{error}</span>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-6 mb-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-background-dark font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="size-5" strokeWidth={3} />
              </>
            )}
            </button>
          </div>
        </form>
        )}
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none text-xs">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
