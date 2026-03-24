import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Interface definition for SelectField props
 * @typedef {Object} SelectFieldProps
 * @property {string} label - The input label
 * @property {React.ElementType} icon - Lucide icon component for the left slot
 * @property {string} iconColor - Tailwind color for the icon (e.g. 'text-primary')
 * @property {string} value - Current selected value
 * @property {(value: string) => void} onChange - Callback when selection changes
 * @property {Array<{id: string, name: string}>} options - Array of options
 * @property {boolean} [loading] - Whether component is loading
 * @property {boolean} [error] - Whether component has an error
 * @property {boolean} [empty] - Whether component has no options
 */

/**
 * Labelled select with left icon and custom styles
 * @param {SelectFieldProps} props
 */
export const SelectField = ({
  label,
  icon: Icon,
  iconColor = 'text-slate-400',
  value,
  onChange,
  options = [],
  loading = false,
  error = false,
  empty = false
}) => {
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-3 w-16 bg-slate-800 rounded ml-1"></div>
        <div className="h-12 w-full bg-slate-800 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="text-danger text-xs font-semibold uppercase ml-1 italic">
          {label} (Error)
        </label>
        <div className="w-full bg-danger/10 border border-danger/20 rounded-lg py-3 px-4 text-danger text-sm">
          Failed to load options
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {Icon && <Icon className={`${iconColor}`} size={18} />}
        </div>
        <select
          className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm font-medium text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {empty && <option disabled value="">No options available</option>}
          {!empty && options.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};
