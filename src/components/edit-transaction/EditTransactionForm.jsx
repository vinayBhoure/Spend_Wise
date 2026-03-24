import React from 'react';
import { StyledSelect } from '../ui/StyledSelect';
import {
  Utensils,
  Wallet,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getCurrencySymbol } from '../../utils/currency';

/**
 * @typedef {Object} EditTransactionFormProps
 * @property {object} formData
 * @property {(field: string, value: any) => void} onChange
 * @property {object} transaction
 * @property {Array} categories
 * @property {Array} accounts
 * @property {string} currencyCode
 * @property {() => void} onDelete
 * @property {boolean} [loading]
 * @property {boolean} [deleting]
 * @property {boolean} [error]
 */

export const EditTransactionForm = ({
  formData,
  onChange,
  transaction,
  categories = [],
  accounts = [],
  currencyCode = 'INR',
  onDelete,
  loading = false,
  deleting = false,
  error = false
}) => {
  if (loading) {
    return (
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full space-y-8 animate-pulse">
        <div className="h-32 bg-slate-800/10 rounded-xl mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-slate-800 rounded-lg"></div>
          <div className="h-20 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-32 bg-slate-800 rounded-lg"></div>
        <div className="h-16 bg-slate-800 rounded-lg"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full text-center flex flex-col items-center justify-center space-y-3">
        <AlertCircle className="size-16 text-danger opacity-50" />
        <h3 className="text-slate-100 font-bold">Failed to Load Transaction</h3>
        <p className="text-slate-400 text-sm">Please try again later.</p>
      </main>
    );
  }

  // Map categories and accounts to StyledSelect options
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    icon: cat.emoji,
  }));

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.name,
  }));

  return (
    <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full space-y-8 pb-10">
      {/* Amount Section */}
      <div className="text-center py-6">
        <label className="block text-slate-400 text-sm font-medium mb-1">Amount</label>
        <div className="relative inline-flex items-center">
          <span className="text-4xl font-extrabold text-slate-100 mr-1">
            {getCurrencySymbol(currencyCode)}
          </span>
          <input
            className="bg-transparent border-none text-center text-4xl font-extrabold text-slate-100 p-0 focus:ring-0 w-48 placeholder:text-slate-700"
            type="text"
            value={formData.amount}
            onChange={(e) => onChange('amount', e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Category & Account */}
        <div className="grid grid-cols-2 gap-4">
          <StyledSelect
            label="Category"
            leftIcon={Utensils}
            leftIconColor="text-primary"
            options={categoryOptions}
            value={formData.category_id}
            onChange={(val) => onChange('category_id', val)}
            placeholder="Select category"
          />
          <StyledSelect
            label="Account"
            leftIcon={Wallet}
            leftIconColor="text-emerald-400"
            options={accountOptions}
            value={formData.account_id}
            onChange={(val) => onChange('account_id', val)}
            placeholder="Select account"
          />
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">Date</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-primary">
                <Calendar size={18} />
              </div>
              <input
                className="w-full bg-card-dark border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-slate-100 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                type="date"
                value={formData.date}
                onChange={(e) => onChange('date', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">Time</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-primary">
                <Clock size={18} />
              </div>
              <input
                className="w-full bg-card-dark border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-slate-100 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                type="time"
                value={formData.time}
                onChange={(e) => onChange('time', e.target.value)}
              />
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="time"]::-webkit-calendar-picker-indicator {
            opacity: 0;
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        `}} />

        {/* Note Section */}
        <div className="space-y-2">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">Note</label>
          <textarea
            className="w-full bg-card-dark border border-white/5 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-100 focus:border-primary/50 focus:ring-0 resize-none placeholder:text-slate-600 transition-all"
            placeholder="Add a description..."
            rows="3"
            value={formData.note}
            onChange={(e) => onChange('note', e.target.value)}
          />
        </div>

        {/* Labels Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">Labels</label>
            <button className="text-primary text-[11px] font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Plus size={14} />
              ADD LABELS
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Personal</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">SpendWise</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-10">
        <button
          onClick={onDelete}
          disabled={deleting}
          className="w-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive font-bold py-4.5 rounded-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {deleting ? (
            <Loader2 className="animate-spin size-5" />
          ) : (
            <Trash2 size={20} />
          )}
          {deleting ? 'DELETING...' : 'DELETE TRANSACTION'}
        </button>
      </div>
    </main>
  );
};
