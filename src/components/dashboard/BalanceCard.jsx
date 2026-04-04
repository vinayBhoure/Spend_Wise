import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';

/**
 * @param {{
 *   balance: number,
 *   currencyCode: string
 * }} props
 */
export const BalanceCard = ({ balance, currencyCode = 'INR' }) => {
  const formattedBalance = formatCurrency(balance, currencyCode);

  return (
    <Card variant="emerald">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Available to Spend</p>
          <span className="bg-primary/10 text-primary text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Safe Area
          </span>
        </div>
        
        <h2 className="text-4xl font-bold tracking-tight mb-2">{formattedBalance}</h2>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 size-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
    </Card>
  );
};
