import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Landmark, Banknote, QrCode, CreditCard, Delete, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { useProfile } from '../hooks/useProfile';
import { getCurrencySymbol } from '../utils/currency';
import { PageHeader } from '../components/layout/PageHeader';

const ACCOUNT_TYPES = [
  { id: 'bank', label: 'Bank' },
  { id: 'cash', label: 'Cash' },
  { id: 'upi', label: 'UPI' },
  { id: 'credit_card', label: 'Credit Card' },
];

export default function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, updateAccount, removeAccount, deleteAccountPermanently, loading: globalLoading } = useAccounts();
  const { data: profileData } = useProfile(true);
  const selectedCurrency = profileData?.currency || 'INR';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    initial_balance: '0.00',
    current_balance: '0.00',
    exclude_from_transactions: false,
  });

  const account = accounts.find(a => a.id === id);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        initial_balance: account.initial_balance.toFixed(2),
        current_balance: account.current_balance.toFixed(2),
        exclude_from_transactions: account.exclude_from_transactions || false,
      });
    }
  }, [account]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateAccount(id, {
        name: formData.name.trim(),
        type: formData.type,
        initial_balance: parseFloat(formData.initial_balance) || 0,
        current_balance: parseFloat(formData.current_balance) || 0,
        exclude_from_transactions: formData.exclude_from_transactions,
      });
      navigate('/accounts');
    } catch (err) {
      setError(err.message || 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Are you sure you want to archive this account?')) return;

    setLoading(true);
    try {
      await removeAccount(id);
      navigate('/accounts');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = () => {
    navigate(`/delete-confirmation?id=${id}&type=account`);
  };

  if (!account && !globalLoading) {
    return (
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-4">
        <AlertCircle className="size-12 text-slate-500 mb-4" />
        <h2 className="text-xl font-bold">Account Not Found</h2>
        <button onClick={() => navigate('/accounts')} className="mt-4 text-primary font-bold">Back to Accounts</button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark font-manrope antialiased overflow-hidden text-slate-900 dark:text-slate-100">
      <PageHeader 
        title="Edit Account"
        showBack={true}
        onBack={() => navigate('/accounts')}
        rightElement={
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-primary font-bold text-base px-2 disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : 'Save'}
          </button>
        }
      />

      <main className="flex-1 px-4 py-3 flex flex-col gap-5 overflow-y-auto hide-scrollbar">
        {error && (
          <div className="flex items-center gap-2 text-rose-500 text-[10px] font-semibold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 shrink-0">
            <AlertCircle className="size-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Details Section */}
        <section className="flex flex-col gap-3 shrink-0">
          <h2 className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest px-1">Details</h2>
          <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="flex flex-col gap-1 p-3.5 border-b border-slate-200 dark:border-white/5">
              <label className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Account Name</label>
              <input
                className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-slate-900 dark:text-slate-100 text-lg font-semibold placeholder:text-slate-400"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 p-3.5 border-b border-slate-200 dark:border-white/5">
              <label className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Current Balance</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500 text-lg font-semibold">{getCurrencySymbol(selectedCurrency)}</span>
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-slate-900 dark:text-slate-100 text-lg font-semibold placeholder:text-slate-400 w-full"
                  type="number"
                  step="0.01"
                  value={formData.current_balance}
                  onChange={(e) => handleInputChange('current_balance', e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 p-3.5">
              <label className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Account Type</label>
              <div className="relative group cursor-pointer">
                <select
                  className="appearance-none w-full bg-transparent border-none p-0 focus:ring-0 text-slate-900 dark:text-slate-100 text-lg font-semibold pr-10 cursor-pointer"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {ACCOUNT_TYPES.map(type => (
                    <option key={type.id} value={type.id} className="dark:bg-slate-900">{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="flex flex-col gap-3 shrink-0">
          <h2 className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest px-1">Preferences</h2>
          <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 p-3.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 dark:text-slate-100 text-sm font-bold">Exclude from Transactions</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">Doesn't affect total balance calculation.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.exclude_from_transactions}
                  onChange={(e) => handleInputChange('exclude_from_transactions', e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="flex flex-col gap-3 pb-4">
          <h2 className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest px-1">Danger Zone</h2>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleArchive}
              className="flex items-center justify-between w-full p-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Landmark className="size-4 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">Archive Account</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-between w-full p-3.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <Delete className="size-4 text-rose-500" />
                <span className="text-rose-500 font-bold text-sm">Delete Account</span>
              </div>
              <div className="bg-rose-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-rose-500 uppercase tracking-widest">Permanent</div>
            </button>
          </div>
          <p className="text-center text-slate-500 dark:text-slate-600 text-[10px] px-6">
            Permanent removal of all transaction data and history.
          </p>
        </section>
      </main>
    </div>
  );
}
