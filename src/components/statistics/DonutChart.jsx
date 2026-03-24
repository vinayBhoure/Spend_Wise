import React from 'react';
import { formatCurrency } from '../../utils/currency';

/**
 * @param {{
 *   totalSpent: number,
 *   currencyCode: string,
 *   categories: Array<{percentage: number, color: {hex: string}}>
 * }} props
 */
export const DonutChart = ({ totalSpent, currencyCode, categories }) => {
  // Build conic-gradient string
  let gradientString = '';
  if (categories.length === 0) {
    // If no categories, mostly transparent or grey
    gradientString = 'conic-gradient(#334155 0% 100%)';
  } else {
    let currentPercent = 0;
    const gradientStops = categories.map((cat) => {
      const start = currentPercent;
      const end = currentPercent + cat.percentage;
      currentPercent = end;
      // Handle floating point imprecision
      const endStr = Math.min(end, 100).toFixed(2);
      return `${cat.color.hex} ${start.toFixed(2)}% ${endStr}%`;
    });
    
    // Fill the rest if it doesn't sum exactly to 100%
    if (currentPercent < 100) {
      gradientStops.push(`transparent ${currentPercent.toFixed(2)}% 100%`);
    }

    gradientString = `conic-gradient(${gradientStops.join(', ')})`;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-4">
      <div 
        className="relative flex items-center justify-center w-64 h-64 rounded-full"
        style={{ background: gradientString }}
      >
        <div className="flex flex-col items-center justify-center w-48 h-48 rounded-full bg-background-light dark:bg-background-dark shadow-inner shadow-slate-200 dark:shadow-slate-900/50">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalSpent, currencyCode)}
          </span>
        </div>
      </div>
    </div>
  );
};
