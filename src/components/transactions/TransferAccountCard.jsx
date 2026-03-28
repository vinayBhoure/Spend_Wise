import { Building2, Wallet, ChevronDown, ArrowDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getCurrencySymbol, formatCurrency, convertCurrency } from '../../utils/currency';
import { selectProfileData } from '../../store/slices/profileSlice';

export const TransferAccountCard = ({ type, accountId, accounts, onSelect }) => {
  const isFrom = type === 'from';
  const profile = useSelector(selectProfileData);
  const userCurrency = profile?.currency || 'INR';
  const selectedAccount = accounts.find(a => a.id === accountId);
  
  const balanceText = selectedAccount 
    ? formatCurrency(convertCurrency(selectedAccount.current_balance || 0, selectedAccount.currency || 'INR', userCurrency), userCurrency)
    : formatCurrency(0, userCurrency);

  return (
    <div className={`relative bg-surface-dark rounded-xl p-5 border flex items-center gap-4 transition-all group ${isFrom ? 'border-slate-800' : 'border-primary/20 mt-4'}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isFrom ? 'bg-slate-800 border-slate-700' : 'bg-primary/10 border-primary/20'}`}>
        {isFrom ? (
           <Building2 className="text-slate-400" size={24} />
        ) : (
           <Wallet className="text-primary" size={24} />
        )}
      </div>
      
      <div className="flex-1 relative">
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isFrom ? 'text-slate-500' : 'text-primary'}`}>
          {isFrom ? 'From' : 'To'}
        </p>
        
        {/* Invisible select overlay */}
        <select 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          value={accountId || ''}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="" disabled>Select Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
        
        <h3 className="text-base font-bold text-slate-100">
          {selectedAccount ? selectedAccount.name : 'Select Account'}
        </h3>
        <p className="text-sm text-slate-400">
          Balance: {balanceText}
        </p>
      </div>
      
      <ChevronDown className="text-slate-600 group-active:text-primary pointer-events-none" size={20} />
      
      {/* Flow Indicator (only on From card) */}
      {isFrom && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 z-10">
          <div className="bg-background-dark border border-slate-700 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl shadow-black">
            <ArrowDown className="text-primary font-bold" size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

