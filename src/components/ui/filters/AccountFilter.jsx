import { Check } from 'lucide-react';
import { usePlan } from '../../../hooks/usePlan';

export const AccountFilter = ({ filters, setFilters, accounts }) => {
  const { canMultiSelectFilters } = usePlan();

  const toggleArrayFilter = (id) => {
    const currentArray = filters.accounts || [];
    if (currentArray.includes(id)) {
      setFilters({ ...filters, accounts: currentArray.filter(i => i !== id) });
    } else {
      if (canMultiSelectFilters) {
        setFilters({ ...filters, accounts: [...currentArray, id] });
      } else {
        setFilters({ ...filters, accounts: [id] }); // Single select for free tier
      }
    }
  };

  return (
    <div className="space-y-1">
      {accounts.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-4">No accounts found</p>
      ) : (
        accounts.map(acc => {
          const isSelected = filters.accounts?.includes(acc.id);
          return (
            <button
              key={acc.id}
              onClick={() => toggleArrayFilter(acc.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors border ${
                isSelected 
                  ? 'bg-emerald-500/10 border-emerald-400/20' 
                  : 'bg-transparent border-transparent hover:bg-white/5'
              }`}
            >
              <span className={`text-sm ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                {acc.name}
              </span>
              <div className={`size-4 rounded border flex items-center justify-center ${
                isSelected ? 'border-emerald-400 bg-emerald-400 text-background-dark' : 'border-slate-600 bg-transparent text-transparent'
              }`}>
                <Check size={12} strokeWidth={3} />
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};
