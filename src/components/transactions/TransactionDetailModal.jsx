import PropTypes from 'prop-types';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import { Pencil, X } from 'lucide-react';

export const TransactionDetailModal = ({ 
  transaction, 
  currencyCode = 'INR',
  onClose, 
  onEdit
}) => {
  if (!transaction) return null;

  const { amount, type, note, date, time, categories, accounts, is_transfer } = transaction;

  const isIncome = type === 'income';
  
  // Use currency conversion exactly like TransactionRow does
  const txCurrency = accounts?.currency || 'INR';
  const convertedAmount = convertCurrency(amount, txCurrency, currencyCode);
  const formattedAmount = formatCurrency(convertedAmount, currencyCode);
  const displayAmount = isIncome ? `+${formattedAmount}` : `-${formattedAmount}`;
  
  const amountColor = isIncome ? 'text-emerald-400' : 'text-white';
  
  const categoryName = categories?.name || 'Uncategorized';
  const accountName = accounts?.name || 'Unknown Account';
  
  // Format date nicely
  // e.g., "Mon, Oct 15, 2023"
  const dateObj = new Date(`${date}T${time || '00:00:00'}`);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = time ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl shadow-sm">
            {categories?.emoji || '🏷️'}
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-700 transition-colors active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Amount & Title */}
        <div className="mb-8 pl-1">
          <h2 className="text-xl text-slate-300 font-bold mb-1">{note || categoryName}</h2>
          <p className={`text-4xl font-black tracking-tight ${amountColor}`}>
            {displayAmount}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-1 mb-8">
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400 text-sm font-medium">Status</span>
            <span className="text-white text-sm font-bold capitalize pr-2">{type}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400 text-sm font-medium">Account</span>
            <span className="text-white text-sm font-bold pr-2">{accountName}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400 text-sm font-medium">Category</span>
            <span className="text-white text-sm font-bold pr-2">{categoryName}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400 text-sm font-medium">Date</span>
            <span className="text-white text-sm font-bold text-right pr-2">
              {formattedDate} {formattedTime && <span className="block text-slate-400 text-[12px] mt-0.5">{formattedTime}</span>}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button 
            className="flex-1 bg-primary text-background-dark hover:bg-primary/90 font-black py-4 rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            onClick={() => onEdit(transaction.id)}
          >
            <Pencil className="size-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

TransactionDetailModal.propTypes = {
  transaction: PropTypes.object,
  currencyCode: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};
