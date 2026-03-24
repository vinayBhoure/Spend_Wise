import React from 'react';
import { formatCurrency } from '../../utils/currency';

/**
 * @param {{
 *   categories: Array<{name: string, emoji: string, percentage: number, amount: number, color: any}>,
 *   currencyCode: string
 * }} props
 */
export const DetailedCategoryBreakdown = ({ categories, currencyCode }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight px-0">Expense Breakdown</h2>
      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${cat.color.bgOpacity} text-xl`}>
                  {cat.emoji || '❔'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {cat.percentage.toFixed(1)}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(cat.amount, currencyCode)}
                </p>
              </div>
            </div>
            
            {/* Slim Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${cat.color.bg} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
                style={{ width: `${Math.min(100, cat.percentage)}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
