import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  X, 
  Search,
  Check,
  CalendarDays,
  ArrowRightLeft,
  CircleDollarSign,
  Briefcase,
  Layers,
  Banknote,
  Repeat2
} from 'lucide-react';
import { selectCategories } from '../../store/slices/categoriesSlice';
import { selectAccounts } from '../../store/slices/accountsSlice';

const TABS = [
  { id: 'date', label: 'Date', icon: <CalendarDays size={16} /> },
  { id: 'type', label: 'Type', icon: <ArrowRightLeft size={16} /> },
  { id: 'amount', label: 'Amount', icon: <CircleDollarSign size={16} /> },
  { id: 'category', label: 'Category', icon: <Layers size={16} /> },
  { id: 'account', label: 'Account', icon: <Briefcase size={16} /> },
];

export const TransactionFilter = ({ isOpen, onClose, currentFilters, onApply }) => {
  const [activeTab, setActiveTab] = useState('date');
  const [filters, setFilters] = useState(currentFilters);
  const [categorySearch, setCategorySearch] = useState('');
  
  const categories = useSelector(selectCategories);
  const accounts = useSelector(selectAccounts);

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
      setActiveTab('date');
      setCategorySearch('');
    }
  }, [isOpen, currentFilters]);

  const translateClass = isOpen ? 'translate-x-[0]' : '-translate-x-full';

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClearAll = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      type: 'all',
      minAmount: '',
      maxAmount: '',
      categories: [],
      accounts: []
    };
    setFilters(resetFilters);
  };

  const toggleArrayFilter = (key, id) => {
    const currentArray = filters[key] || [];
    if (currentArray.includes(id)) {
      setFilters({ ...filters, [key]: currentArray.filter(i => i !== id) });
    } else {
      setFilters({ ...filters, [key]: [...currentArray, id] });
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-in Container */}
      <div 
        className={`fixed top-0 left-0 h-[100dvh] w-[90%] max-w-md bg-surface flex flex-col z-[70] transition-transform duration-300 ease-in-out border-r border-white/5 ${translateClass}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-background-dark/50">
          <h2 className="text-xl font-bold tracking-tight text-emerald-400">FILTERS</h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Master-Detail Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar (Master) */}
          <aside className="w-[110px] bg-background-dark/80 border-r border-white/5 overflow-y-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              // Add a small indicator dot if filters are active in this tab
              let hasActiveFilters = false;
              if (tab.id === 'date' && (filters.startDate || filters.endDate)) hasActiveFilters = true;
              if (tab.id === 'type' && filters.type !== 'all') hasActiveFilters = true;
              if (tab.id === 'amount' && (filters.minAmount || filters.maxAmount)) hasActiveFilters = true;
              if (tab.id === 'category' && filters.categories?.length > 0) hasActiveFilters = true;
              if (tab.id === 'account' && filters.accounts?.length > 0) hasActiveFilters = true;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex flex-col items-center justify-center gap-1.5 p-4 relative border-l-4 transition-colors ${
                    isActive 
                      ? 'bg-surface border-emerald-400 text-emerald-400 font-bold' 
                      : 'border-transparent text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span className="text-xs">{tab.label}</span>
                  {hasActiveFilters && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </aside>

          {/* Right Panel (Detail) */}
          <main className="flex-1 bg-surface overflow-y-auto px-4 py-4">
            
            {/* DATE */}
            {activeTab === 'date' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                  <input 
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400/50"
                  />
                </div>
              </div>
            )}

            {/* TYPE */}
            {activeTab === 'type' && (
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All', icon: <Banknote size={16} /> },
                  { id: 'income', label: 'Income', icon: <ArrowRightLeft size={16} className="rotate-45" /> },
                  { id: 'expense', label: 'Expense', icon: <ArrowRightLeft size={16} className="-rotate-135" /> },
                  { id: 'transfer', label: 'Transfer', icon: <Repeat2 size={16} /> }
                ].map((typeOption) => (
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
            )}

            {/* AMOUNT */}
            {activeTab === 'amount' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Minimum Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input 
                      type="number"
                      placeholder="0.00"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white outline-none focus:border-emerald-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Maximum Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input 
                      type="number"
                      placeholder="99999.00"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white outline-none focus:border-emerald-400/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY */}
            {activeTab === 'category' && (
              <div className="flex flex-col h-full">
                <div className="relative mb-3 shrink-0">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search by Categories"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"
                  />
                </div>
                {filteredCategories.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4">No categories found</p>
                ) : (
                  <div className="space-y-1 pb-4">
                    {filteredCategories.map(cat => {
                      const isSelected = filters.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleArrayFilter('categories', cat.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors border ${
                            isSelected 
                              ? 'bg-emerald-500/10 border-emerald-400/20' 
                              : 'bg-transparent border-transparent hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.emoji}</span>
                            <span className={`text-sm ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                              {cat.name}
                            </span>
                          </div>
                          <div className={`size-4 rounded border flex items-center justify-center ${
                            isSelected ? 'border-emerald-400 bg-emerald-400 text-background-dark' : 'border-slate-600 bg-transparent text-transparent'
                          }`}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ACCOUNT */}
            {activeTab === 'account' && (
              <div className="space-y-1">
                {accounts.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4">No accounts found</p>
                ) : (
                  accounts.map(acc => {
                    const isSelected = filters.accounts.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggleArrayFilter('accounts', acc.id)}
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
            )}
            
          </main>
        </div>

        {/* Footer */}
        <footer className="p-3 border-t border-white/5 bg-background-dark/80 shrink-0 flex gap-2">
          <button 
            onClick={handleClearAll}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Clear All
          </button>
          <button 
            onClick={handleApply}
            className="flex-[1.5] px-4 py-3 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)]"
          >
            APPLY 
          </button>
        </footer>

      </div>
    </>
  );
};
