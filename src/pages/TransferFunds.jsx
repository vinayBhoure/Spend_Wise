import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Send, StickyNote } from 'lucide-react';
import { 
  fetchTransferAccounts, 
  submitTransfer, 
  selectTransferFundsData, 
  selectTransferSubmitState,
  resetSubmitStatus
} from '../store/slices/transferFundsSlice';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { getCurrencySymbol } from '../utils/currency';
import { PageHeader } from '../components/layout/PageHeader';

import { AmountInput } from '../components/transactions/AmountInput';
import { TransferAccountCard } from '../components/transactions/TransferAccountCard';
import { QuickAmountSelect } from '../components/transactions/QuickAmountSelect';

export default function TransferFunds() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { accounts, status } = useSelector(selectTransferFundsData);
  const { submitStatus, submitError } = useSelector(selectTransferSubmitState);
  const { data: profileData } = useProfile(true);
  const selectedCurrency = profileData?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const [fromAccountId, setFromAccountId] = useState(null);
  const [toAccountId, setToAccountId] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const quickAmounts = [
    { label: `+${currencySymbol}500`, value: '500' },
    { label: `+${currencySymbol}1,000`, value: '1000' },
    { label: `+${currencySymbol}5,000`, value: '5000' },
    { label: 'Max', value: 'max' },
  ];

  useEffect(() => {
    if (user?.id && status === 'idle') {
      dispatch(fetchTransferAccounts(user.id));
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    // Auto-select accounts if available and not selected
    if (accounts.length > 0) {
      if (!fromAccountId) setFromAccountId(accounts[0].id);
      if (!toAccountId && accounts.length > 1) {
        // Try to pick a different account for "to"
        setToAccountId(accounts[1].id);
      } else if (!toAccountId) {
        setToAccountId(accounts[0].id);
      }
    }
  }, [accounts, fromAccountId, toAccountId]);

  useEffect(() => {
    if (submitStatus === 'succeeded') {
      dispatch(resetSubmitStatus());
      navigate('/transactions');
    }
  }, [submitStatus, navigate, dispatch]);

  const handleQuickAmount = (val) => {
    if (val === 'max' && fromAccountId) {
      const acc = accounts.find(a => a.id === fromAccountId);
      if (acc) setAmount(acc.current_balance.toString());
    } else if (val !== 'max') {
      const currentAmount = parseFloat(amount || 0);
      setAmount((currentAmount + parseFloat(val)).toString());
    }
  };

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!fromAccountId || !toAccountId) {
      alert("Please select both From and To accounts.");
      return;
    }
    if (fromAccountId === toAccountId) {
      alert("From and To accounts must be different.");
      return;
    }

    const now = new Date();
    
    // Transfer logic maps to our db:
    // It is created as a single transaction row conceptually, where 'account_id' is sender, 'transfer_to_account_id' is receiver
    const payload = {
      user_id: user.id,
      account_id: fromAccountId,
      transfer_to_account_id: toAccountId,
      amount: Number(amount),
      is_transfer: true,
      type: 'transfer', 
      date: now.toISOString().split('T')[0],
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      note: note,
    };

    dispatch(submitTransfer(payload));
  };

  const handleTypeChange = (newType) => {
    if (newType !== 'transfer') {
      navigate('/add-transaction'); // This takes them back to Income/Expense form
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading accounts...</div>;
  }

  if (status === 'failed') {
    return <div className="min-h-screen flex items-center justify-center text-red-400">Failed to load data.</div>;
  }

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Transfer Funds"
        showBack={true}
        onBack={() => navigate('/dashboard')}
        rightElement={
          <button 
            aria-label="Info"
            className="size-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-900 dark:text-slate-100 active:scale-95 transition-transform hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
          >
            <Info className="size-5" />
          </button>
        }
      />

      <main className="flex-1 flex flex-col px-6 pt-6 max-w-md mx-auto w-full pb-32">
        {/* Transaction Type Switcher */}
        <div className="mb-8">
          <div className="flex h-12 items-center justify-center rounded-xl bg-surface-dark border border-slate-800/50 p-1">
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500 text-xs font-extrabold uppercase transition-all has-[:checked]:bg-slate-800/80 has-[:checked]:text-primary has-[:checked]:shadow-sm">
              <span>Income</span>
              <input 
                className="hidden" 
                name="txn-type" 
                type="radio" 
                value="income" 
                onChange={() => handleTypeChange('income')}
              />
            </label>
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500 text-xs font-extrabold uppercase transition-all has-[:checked]:bg-slate-800/80 has-[:checked]:text-primary has-[:checked]:shadow-sm">
              <span>Expense</span>
              <input 
                className="hidden" 
                name="txn-type" 
                type="radio" 
                value="expense" 
                onChange={() => handleTypeChange('expense')}
              />
            </label>
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500 text-xs font-extrabold uppercase transition-all has-[:checked]:bg-slate-800/80 has-[:checked]:text-primary has-[:checked]:shadow-sm">
              <span>Transfer</span>
              <input 
                className="hidden" 
                name="txn-type" 
                type="radio" 
                value="transfer" 
                checked={true}
                onChange={() => {}}
              />
            </label>
          </div>
        </div>

        <AmountInput value={amount} onChange={setAmount} currencyCode={selectedCurrency} />

        <div className="relative flex flex-col gap-4 mt-4">
          <TransferAccountCard 
            type="from" 
            accountId={fromAccountId} 
            accounts={accounts} 
            onSelect={setFromAccountId} 
          />
          <TransferAccountCard 
            type="to" 
            accountId={toAccountId} 
            accounts={accounts} 
            onSelect={setToAccountId} 
          />
        </div>

        <div className="mt-8">
          <div className="relative">
            <input 
              className="w-full bg-surface-dark border border-slate-800 rounded-lg py-4 px-5 pr-12 text-slate-200 placeholder-slate-600 focus:ring-0 focus:outline-none transition-all" 
              placeholder="Add a note (e.g. Rent, Dinner)" 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <StickyNote className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          </div>
        </div>

        <QuickAmountSelect amounts={quickAmounts} onSelect={handleQuickAmount} />

        {submitError && (
          <div className="mt-4 text-red-500 text-sm font-semibold">
            Error: {submitError}
          </div>
        )}

      </main>

      {/* Primary Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-10 z-20">
        <button 
          onClick={handleSubmit}
          disabled={submitStatus === 'loading'}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-background-dark font-extrabold py-4 rounded-lg shadow-xl shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <span>{submitStatus === 'loading' ? 'Transferring...' : 'Transfer Funds'}</span>
          <Send size={20} />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-[-5%] right-[-5%] w-72 h-72 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[10%] left-[-10%] w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
}
