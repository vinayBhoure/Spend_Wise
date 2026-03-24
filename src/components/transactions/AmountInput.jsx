import { forwardRef } from 'react';
import { getCurrencySymbol } from '../../utils/currency';

export const AmountInput = forwardRef(({ value, onChange, currencyCode = 'INR' }, ref) => {
  const handleInputChange = (e) => {
    // Only allow numbers and decimal point
    const val = e.target.value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimals
    if ((val.match(/\./g) || []).length > 1) return;
    onChange(val);
  };

  return (
    <div className="flex flex-col items-center py-8 mb-4">
      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
        Enter Amount
      </span>
      <div className="flex items-center gap-2 w-full justify-center px-6">
        <span className="text-3xl font-bold text-primary">{getCurrencySymbol(currencyCode)}</span>
        <input
          ref={ref}
          autoFocus
          type="text"
          inputMode="decimal"
          className="bg-transparent border-none text-center text-7xl font-extrabold focus:ring-0 p-0 w-full max-w-[280px] text-slate-100 placeholder:text-slate-800"
          placeholder="0"
          value={value}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
});

AmountInput.displayName = 'AmountInput';

