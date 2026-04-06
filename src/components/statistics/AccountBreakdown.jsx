import React from 'react';
import { Landmark, Banknote, QrCode, CreditCard, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

// Simple fallback icon mapping if needed
const getAccountIcon = (type) => {
  switch (type) {
    case 'bank': return Landmark;
    case 'cash': return Banknote;
    case 'digital': return QrCode;
    case 'credit': return CreditCard;
    default: return Wallet;
  }
};

/**
 * @param {{
 *   accounts: Array<any>,
 *   currencyCode: string,
 *   totalBalance: number
 * }} props
 */
export const AccountBreakdown = ({ accounts, currencyCode, totalBalance }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">Account Breakdown</h2>
      <div className="space-y-3">
        {accounts.map((acc) => {
          const balance = acc.converted_balance || 0;
          if (balance <= 0) return null; // Only show accounts with positive balance

          const Icon = getAccountIcon(acc.type);

          let pct = 0;
          if (totalBalance > 0) {
            pct = Math.min((balance / totalBalance) * 100, 100);
          }

          return (
            <div key={acc.id} className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{acc.name}</span>
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(balance, currencyCode)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${acc.color.bg}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
