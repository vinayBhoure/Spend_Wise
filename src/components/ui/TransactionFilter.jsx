import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  CalendarDays, 
  ArrowRightLeft,
  Banknote,
  Repeat2
} from 'lucide-react';

export const TransactionFilter = ({ isOpen, onClose, currentFilters, onApply }) => {
  // Local state to track filters before applying
  const [filters, setFilters] = useState(currentFilters);

  // Sync local state when opened with current global filters
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  // Handle slide out animation class
  const translateClass = isOpen ? 'translate-x-[0]' : '-translate-x-full';

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      period: 'all',
      type: 'all',
      includeTransfers: true
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Filter Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-surface flex flex-col z-[70] transition-transform duration-300 ease-in-out border-r border-white/5 ${translateClass}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-1 -ml-1 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold tracking-tight text-emerald-400">Filters</h2>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Reset
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-10">
          
          {/* Quick Period */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={18} className="text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Quick Period</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: '6m', label: 'Last 6 Months' },
                { id: 'year', label: 'This Year' }
              ].map((periodOption) => (
                <button
                  key={periodOption.id}
                  onClick={() => setFilters({ ...filters, period: periodOption.id })}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    filters.period === periodOption.id
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30'
                      : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  {periodOption.label}
                </button>
              ))}
            </div>
          </section>

          {/* Transaction Type */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft size={18} className="text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Type</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All', icon: <Banknote size={16} /> },
                { id: 'income', label: 'Income', icon: <ArrowRightLeft size={16} className="rotate-45" /> },
                { id: 'expense', label: 'Expense', icon: <ArrowRightLeft size={16} className="-rotate-135" /> },
                { id: 'transfer', label: 'Transfer', icon: <Repeat2 size={16} /> }
              ].map((typeOption) => (
                <button
                  key={typeOption.id}
                  onClick={() => setFilters({ ...filters, type: typeOption.id })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all border ${
                    filters.type === typeOption.id
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30 font-bold'
                      : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/10 font-medium'
                  }`}
                >
                  {typeOption.icon}
                  <span className="text-sm">{typeOption.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Transfers Toggle */}
          <section className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-200">Include Transfers</h3>
                <p className="text-xs text-slate-500 mt-1">Show money moved between your accounts</p>
              </div>
              
              <button 
                onClick={() => setFilters({ ...filters, includeTransfers: !filters.includeTransfers })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  filters.includeTransfers ? 'bg-emerald-400' : 'bg-slate-700'
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    filters.includeTransfers ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="p-4 border-t border-white/5 bg-surface-container shrink-0">
          <button 
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 bg-emerald-400 text-slate-950 font-bold tracking-tight rounded-xl py-4 active:scale-95 transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:brightness-110"
          >
            <CheckCircle size={18} />
            Apply Filters
          </button>
        </footer>
      </div>
    </>
  );
};
