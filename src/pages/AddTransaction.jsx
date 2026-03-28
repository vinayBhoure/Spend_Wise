import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, CheckCircle2, Wallet } from 'lucide-react';
import { 
  fetchFormData, 
  submitTransaction, 
  selectAddTransactionData, 
  selectAddTransactionSubmitState,
  resetSubmitStatus
} from '../store/slices/addTransactionSlice';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

import { AmountInput } from '../components/transactions/AmountInput';
import { CategorySelect } from '../components/categories/CategorySelect';
import { DateTimeSelector } from '../components/transactions/DateTimeSelector';
import { StyledSelect } from '../components/ui/StyledSelect';
import { PageHeader } from '../components/layout/PageHeader';

export default function AddTransaction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { categories, accounts, status } = useSelector(selectAddTransactionData);
  const { submitStatus, submitError } = useSelector(selectAddTransactionSubmitState);
  const { data: profileData } = useProfile(true);
  const selectedCurrency = profileData?.currency || 'INR';

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [datetime, setDatetime] = useState(new Date());
  const [note, setNote] = useState('');

  useEffect(() => {
    if (user?.id && status === 'idle') {
      dispatch(fetchFormData(user.id));
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  useEffect(() => {
    if (submitStatus === 'succeeded') {
      dispatch(resetSubmitStatus());
      navigate('/transactions');
    }
  }, [submitStatus, navigate, dispatch]);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.name,
  }));

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!categoryId) {
      alert("Please select a category.");
      return;
    }
    if (!accountId) {
      alert("Please select an account.");
      return;
    }

    const payload = {
      user_id: user.id,
      account_id: accountId,
      category_id: categoryId,
      amount: Number(amount),
      type: type,
      date: datetime.toISOString().split('T')[0],
      time: `${String(datetime.getHours()).padStart(2, '0')}:${String(datetime.getMinutes()).padStart(2, '0')}`,
      note: note,
      is_transfer: false
    };

    dispatch(submitTransaction(payload));
  };

  const handleTypeChange = (newType) => {
    if (newType === 'transfer') {
      navigate('/transfer');
    } else {
      setType(newType);
      setCategoryId(null);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading form data...</div>;
  }

  if (status === 'failed') {
    return <div className="min-h-screen flex items-center justify-center text-red-400">Failed to load data.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="fixed top-[-5%] right-[-5%] w-72 h-72 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[10%] left-[-10%] w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <PageHeader 
        title="Add Transaction"
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

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Transaction Type Switcher */}
        <div className="px-6 py-6">
          <div className="flex h-12 items-center justify-center rounded-xl bg-surface-dark border border-slate-800/50 p-1">
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500 text-xs font-extrabold uppercase transition-all has-[:checked]:bg-slate-800/80 has-[:checked]:text-primary has-[:checked]:shadow-sm">
              <span>Income</span>
              <input 
                className="hidden" 
                name="txn-type" 
                type="radio" 
                value="income" 
                checked={type === 'income'}
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
                checked={type === 'expense'}
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
                checked={type === 'transfer'}
                onChange={() => handleTypeChange('transfer')}
              />
            </label>
          </div>
        </div>

        <AmountInput value={amount} onChange={setAmount} currencyCode={selectedCurrency} />
        
        <CategorySelect 
          categories={filteredCategories} 
          value={categoryId} 
          onChange={setCategoryId}
          loading={status === 'loading'}
          error={status === 'failed'}
        />
        
        <DateTimeSelector 
          datetime={datetime} 
          onChange={setDatetime} 
        />
        
        <div className="px-6 mb-6">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block ml-1">
            Note
          </label>
          <div className="relative">
            <input 
              className="w-full bg-surface-dark border border-slate-800 rounded-lg py-4 px-5 text-slate-200 placeholder-slate-600 focus:ring-0 focus:outline-none transition-all text-[13px]" 
              placeholder="Add a note (e.g. Rent, Dinner)" 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Account Selector */}
        <div className="px-6 mb-10">
          <StyledSelect
            label="Account"
            leftIcon={Wallet}
            leftIconColor="text-emerald-400"
            options={accountOptions}
            value={accountId}
            onChange={setAccountId}
            placeholder="Select account"
          />
        </div>
        
        {submitError && (
          <div className="px-6 mb-4 text-red-500 text-sm font-semibold">
            Error: {submitError}
          </div>
        )}
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-10 z-20">
        <button 
          onClick={handleSubmit} 
          disabled={submitStatus === 'loading'}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-background-dark font-black py-5 rounded-xl shadow-2xl shadow-primary/10 transition-all active:scale-[0.98] text-base uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <span>{submitStatus === 'loading' ? 'Saving...' : 'Save Transaction'}</span>
          <CheckCircle2 size={24} />
        </button>
      </div>
    </div>
  );
}
