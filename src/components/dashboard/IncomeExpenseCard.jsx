import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

/**
 * @param {{
 *   income: number,
 *   expense: number,
 *   savings: number,
 *   currencyCode: string
 * }} props
 */
export const IncomeExpenseCard = ({ income, expense, savings, currencyCode = 'INR' }) => {
  return (
    <Card variant="default" className="p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,230,203,0.6)]"></div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">This Month</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-emerald-500">
            <TrendingUp className="size-3" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Income</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-100">
            {formatCurrency(income, currencyCode)}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-destructive">
            <TrendingDown className="size-3" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Expense</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-100">
            {formatCurrency(expense, currencyCode)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <PiggyBank className="size-4" />
          <span className="text-[11px] uppercase font-bold tracking-widest text-slate-300">Savings</span>
        </div>
        <span className="text-base font-black tracking-tight text-primary">
          {formatCurrency(savings, currencyCode)}
        </span>
      </div>
    </Card>
  );
};
