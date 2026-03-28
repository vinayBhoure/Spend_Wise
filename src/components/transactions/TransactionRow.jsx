import PropTypes from 'prop-types';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import { 
  Coffee, 
  ShoppingBag, 
  Car, 
  Home, 
  TrendingDown, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  Zap, 
  Tv, 
  Heart, 
  DollarSign, 
  Utensils, 
  Briefcase, 
  Smartphone,
  Gift,
  ArrowRightLeft
} from 'lucide-react';

// Enhanced category icon mapping for better coverage
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('food') || name.includes('dining')) return Utensils;
  if (name.includes('coffee') || name.includes('drink')) return Coffee;
  if (name.includes('transport') || name.includes('ride') || name.includes('taxi')) return Car;
  if (name.includes('shop') || name.includes('grocery') || name.includes('mall')) return ShoppingBag;
  if (name.includes('rent') || name.includes('home') || name.includes('house')) return Home;
  if (name.includes('bill') || name.includes('utility') || name.includes('invoice')) return FileText;
  if (name.includes('electric') || name.includes('gas') || name.includes('power')) return Zap;
  if (name.includes('entertainment') || name.includes('netflix') || name.includes('movie') || name.includes('tv')) return Tv;
  if (name.includes('health') || name.includes('medical') || name.includes('doctor')) return Heart;
  if (name.includes('salary') || name.includes('income') || name.includes('work')) return TrendingUp;
  if (name.includes('transfer')) return ArrowRightLeft;
  if (name.includes('phone') || name.includes('internet') || name.includes('mobile')) return Smartphone;
  if (name.includes('gift') || name.includes('present')) return Gift;
  if (name.includes('job') || name.includes('business')) return Briefcase;
  if (name.includes('investment') || name.includes('stock')) return TrendingUp;
  
  return TrendingDown; // Generic expense fallback
};

const formatRelativeDate = (dateString, timeString) => {
  if (!dateString) return null;
  
  const txDate = new Date(`${dateString}T${timeString || '00:00:00'}`);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formattedTime = timeString ? txDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
  
  if (txDate.toDateString() === today.toDateString()) {
    return `Today${formattedTime ? `, ${formattedTime}` : ''}`;
  } else if (txDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday${formattedTime ? `, ${formattedTime}` : ''}`;
  }
  
  const dateFmt = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dateFmt}${formattedTime ? `, ${formattedTime}` : ''}`;
};

export const TransactionRow = ({ transaction, onClick, currencyCode = 'INR' }) => {
  const { amount, type, note, date, time, categories, accounts, is_transfer } = transaction;

  const isIncome = type === 'income';
  
  const txCurrency = accounts?.currency || 'INR';
  const convertedAmount = convertCurrency(amount, txCurrency, currencyCode);
  const formattedAmount = formatCurrency(convertedAmount, currencyCode);
  const displayAmount = isIncome ? `+${formattedAmount}` : `-${formattedAmount}`;
  const amountColor = isIncome ? 'text-emerald-400' : 'text-white';
  
  // Icon styling based on transaction type for consistent visuals
  let iconBg = 'bg-white/5 border border-white/5 text-slate-400';
  if (isIncome) iconBg = 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400';
  else if (is_transfer) iconBg = 'bg-blue-500/10 border-blue-500/10 text-blue-400';
  else if (categories?.emoji) iconBg = 'bg-white/5 border border-white/5 text-white';

  const categoryName = categories?.name || 'Uncategorized';
  const accountName = accounts?.name || 'Unknown Account';
  const emoji = categories?.emoji;
  
  const Icon = !emoji ? getCategoryIcon(categoryName) : null;
  const displayTime = formatRelativeDate(date, time);

  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between gap-4 p-4 rounded-xl bg-card-dark border border-white/5 shadow-md transition-colors ${onClick ? 'cursor-pointer hover:bg-white/5 active:scale-[0.98]' : ''}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`size-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {emoji ? (
            <span className="text-xl">{emoji}</span>
          ) : (
            <Icon className="size-5" />
          )}
        </div>
        
        <div className="min-w-0">
          <p className="text-[14px] text-white font-bold tracking-tight truncate">
            {note || categoryName}
          </p>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate mt-0.5">
             {accountName} {displayTime && `• ${displayTime}`}
          </p>
        </div>
      </div>
      
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold tracking-tight ${amountColor}`}>
          {displayAmount}
        </p>
      </div>
    </div>
  );
};

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.string.isRequired,
    note: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    is_transfer: PropTypes.bool,
    categories: PropTypes.shape({
      name: PropTypes.string,
      emoji: PropTypes.string,
      type: PropTypes.string
    }),
    accounts: PropTypes.shape({
      name: PropTypes.string,
      currency: PropTypes.string
    })
  }).isRequired,
  onClick: PropTypes.func
};
