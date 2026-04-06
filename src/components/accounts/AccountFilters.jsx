import PropTypes from 'prop-types';
import { LayoutGrid, Landmark, Banknote, Smartphone, CreditCard } from 'lucide-react';

/**
 * @typedef {Object} AccountFiltersProps
 * @property {string} activeFilter
 * @property {(filter: string) => void} onFilterChange
 */

const FILTERS = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'bank', label: 'Bank', icon: Landmark },
  { key: 'cash', label: 'Cash', icon: Banknote },
  { key: 'upi', label: 'UPI', icon: Smartphone },
  { key: 'credit_card', label: 'Debt', icon: CreditCard },
];

export const AccountFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <section className="flex gap-3 overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
      {FILTERS.map(({ key, label, icon: Icon }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary text-background-dark font-bold'
                : 'bg-card-dark border border-border-dark text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </section>
  );
};

AccountFilters.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
