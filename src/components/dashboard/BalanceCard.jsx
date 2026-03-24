import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';

/**
 * @param {{
 *   balance: number,
 *   budgetTotal: number,
 *   budgetPercentage: number,
 *   currencyCode: string
 * }} props
 */
export const BalanceCard = ({ balance, budgetTotal, budgetPercentage, currencyCode = 'INR' }) => {
  const formattedBalance = formatCurrency(balance, currencyCode);

  const formattedBudget = formatCurrency(budgetTotal, currencyCode);

  return (
    <Card variant="emerald">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Available to Spend</p>
          <span className="bg-primary/10 text-primary text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Safe Area
          </span>
        </div>
        
        <h2 className="text-4xl font-bold tracking-tight mb-8">{formattedBalance}</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider">
            <span className="text-slate-500">Monthly Budget: {formattedBudget}</span>
            <span className={budgetPercentage > 90 ? 'text-destructive' : 'text-primary'}>
              {budgetPercentage}% used
            </span>
          </div>
          
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${budgetPercentage > 90 ? 'bg-destructive shadow-[0_0_8px_rgba(255,90,126,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(0,230,203,0.5)]'}`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 size-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
    </Card>
  );
};
