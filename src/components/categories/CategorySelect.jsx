import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { StyledSelect } from '../ui/StyledSelect';

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} emoji
 * @property {string} type - 'income' | 'expense'
 */

/**
 * @typedef {Object} CategorySelectProps
 * @property {Category[]} categories - List of categories to display
 * @property {string | null} value - Selected category ID
 * @property {(id: string) => void} onChange - Change handler
 * @property {boolean} [loading] - Loading state
 * @property {boolean} [error] - Error state
 * @property {string} [label] - Label for the group
 */

/**
 * CategorySelect component — A compact select box for picking transaction categories.
 * Uses StyledSelect internally for a premium look with emoji support.
 */
export const CategorySelect = ({
  categories = [],
  value,
  onChange,
  loading = false,
  error = false,
  label = 'Category'
}) => {
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-3 w-16 bg-slate-800 rounded ml-1"></div>
        <div className="h-12 w-full bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="text-red-400 text-[10px] font-bold uppercase tracking-widest ml-1">
          {label} (Error)
        </label>
        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl py-3.5 px-4 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>Failed to load categories</span>
        </div>
      </div>
    );
  }

  const options = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    icon: cat.emoji,
  }));

  if (options.length === 0 && !loading) {
     return (
      <div className="space-y-2">
        <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">
          {label}
        </label>
        <div className="w-full bg-slate-800/20 border border-slate-800 rounded-xl py-3.5 px-4 flex items-center gap-2 text-slate-500 text-sm">
          <Inbox size={16} />
          <span>No categories available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mb-10">
      <StyledSelect
        label={label}
        leftIcon={Tag}
        leftIconColor="text-primary"
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Select category"
      />
    </div>
  );
};

CategorySelect.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      emoji: PropTypes.string,
      type: PropTypes.string,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  label: PropTypes.string,
};
