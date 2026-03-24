import React from 'react';
import { getCurrencySymbol } from '../../utils/currency';

/**
 * Interface definition for AmountInput props
 * @typedef {Object} AmountInputProps
 * @property {string} value - The current amount string
 * @property {(value: string) => void} onChange - Callback when amount changes
 * @property {string} currencyCode - ISO currency code (e.g. 'INR')
 * @property {boolean} [loading] - Whether component is loading
 * @property {boolean} [error] - Whether component has an error
 */

/**
 * Large centered amount input component using Tailwind tokens
 * @param {AmountInputProps} props
 */
export const AmountInput = ({ value, onChange, currencyCode = 'INR', loading = false, error = false }) => {
  if (loading) {
    return (
      <div className="text-center py-6 animate-pulse">
        <div className="h-4 w-12 bg-slate-800 rounded mx-auto mb-2"></div>
        <div className="h-10 w-40 bg-slate-800 rounded mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-danger">
        <p className="text-sm">Failed to load amount</p>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <label className="block text-slate-400 text-sm font-medium mb-1">Amount</label>
      <div className="relative inline-flex items-center">
        <span className="text-4xl font-extrabold text-slate-100 mr-1">
          {getCurrencySymbol(currencyCode)}
        </span>
        <input 
          className="bg-transparent border-none text-center text-4xl font-extrabold text-slate-100 p-0 focus:ring-0 w-48 placeholder:text-slate-700" 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};
