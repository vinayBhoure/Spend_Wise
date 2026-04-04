import { Banknote, ArrowRightLeft, Repeat2, Check } from 'lucide-react';

export const TypeFilter = ({ filters, setFilters }) => {
  const typeOptions = [
    { id: 'all', label: 'All', icon: <Banknote size={16} /> },
    { id: 'income', label: 'Income', icon: <ArrowRightLeft size={16} className="rotate-45" /> },
    { id: 'expense', label: 'Expense', icon: <ArrowRightLeft size={16} className="-rotate-135" /> },
    { id: 'transfer', label: 'Transfer', icon: <Repeat2 size={16} /> }
  ];

  return (
    <div className="space-y-2">
      {typeOptions.map((typeOption) => (
        <button
          key={typeOption.id}
          onClick={() => setFilters({ ...filters, type: typeOption.id })}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
            filters.type === typeOption.id
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30 font-bold'
              : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
          }`}
        >
          {typeOption.icon}
          <span className="text-sm">{typeOption.label}</span>
          {filters.type === typeOption.id && <Check size={16} className="ml-auto text-emerald-400" />}
        </button>
      ))}
    </div>
  );
};
