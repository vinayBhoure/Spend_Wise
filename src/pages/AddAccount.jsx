import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Landmark, Banknote, QrCode, CreditCard, ArrowRight, Loader2, AlertCircle, Pencil, Wallet } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { useProfile } from '../hooks/useProfile';
import { getCurrencySymbol } from '../utils/currency';

const ACCOUNT_TYPES = [
  { id: 'bank', label: 'Bank', icon: Landmark },
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'upi', label: 'UPI', icon: QrCode },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
];

export default function AddAccount() {
  const navigate = useNavigate();
  const { addAccount } = useAccounts();
  const { data: profileData } = useProfile(true);
  const selectedCurrency = profileData?.currency || 'INR';

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
    <div className="h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-4 font-manrope antialiased overflow-hidden">
      {/* Main Container Card */}
      <div className="w-full max-w-[400px] bg-card-dark rounded-xl shadow-2xl overflow-hidden border border-white/5 flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-1">
          <button
            onClick={() => navigate('/accounts')}
            className="text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronLeft className="size-8" />
          </button>
          <h2 className="text-lg font-bold tracking-tight">Add New Account</h2>
          <div className="w-8"></div> {/* Spacer for symmetry */}
        </div>

        <form onSubmit={handleSubmit} className="p-5 pt-3 flex flex-col gap-5 overflow-y-auto hide-scrollbar">
          {/* Abstract Hero Pattern */}
          <div className="relative h-24 shrink-0 w-full rounded-xl overflow-hidden bg-primary/5 border border-primary/10">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#00e6cb,transparent_70%)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Wallet className="size-10 text-primary opacity-80" />
            </div>
          </div>

          {/* Initial Balance Large Field */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Initial Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{getCurrencySymbol(selectedCurrency)}</span>
              <input
                className="bg-transparent border-none p-0 text-5xl font-extrabold text-center focus:outline-none focus:ring-0 w-full max-w-[200px] text-white placeholder-slate-700"
                placeholder="0.00"
                type="text"
                value={formData.initial_balance}
                onChange={handleBalanceChange}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 shrink-0">
            {/* Account Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 ml-1">Account Name</label>
              <div className="relative group">
                <input
                  className="w-full h-11 px-4 rounded-lg bg-slate-900/50 border-2 border-white/5 focus:border-slate-800 text-white focus:outline-none transition-all pr-12 focus:ring-0"
                  placeholder="e.g. My Savings"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <div className="absolute right-3 top-2.5 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none">
                  <Pencil className="size-4" />
                </div>
              </div>
            </div>

            {/* Account Type Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 ml-1">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                {ACCOUNT_TYPES.map(({ id, label, icon: Icon }) => {
                  const isActive = formData.type === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('type', id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border-2 transition-all ${isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-transparent bg-slate-900/50 text-slate-400 hover:border-slate-700'
                        }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-sm font-bold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-semibold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 shrink-0">
              <AlertCircle className="size-3.5" />
              <span>{error}</span>
            </div>
          )}

          {/* CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-1 shrink-0 bg-primary text-background-dark font-extrabold text-base rounded-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="size-5 font-bold" strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        {/* Safe Area Indicator
        <div className="p-3 flex justify-center opacity-10">
          <div className="w-24 h-1 bg-slate-100 rounded-full"></div>
        </div> */}
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none text-xs">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
