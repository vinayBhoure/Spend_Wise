import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  X, 
  CalendarDays,
  ArrowRightLeft,
  CircleDollarSign,
  Briefcase,
  Layers,
} from 'lucide-react';
import { selectCategories } from '../../store/slices/categoriesSlice';
import { selectAccounts } from '../../store/slices/accountsSlice';

import { DateFilter } from './filters/DateFilter';
import { TypeFilter } from './filters/TypeFilter';
import { AmountFilter } from './filters/AmountFilter';
import { CategoryFilter } from './filters/CategoryFilter';
import { AccountFilter } from './filters/AccountFilter';

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
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background-dark/50">
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
          <main className="flex-1 bg-surface overflow-y-auto px-4 py-3">
            {activeTab === 'date' && <DateFilter filters={filters} setFilters={setFilters} />}
            {activeTab === 'type' && <TypeFilter filters={filters} setFilters={setFilters} />}
            {activeTab === 'amount' && <AmountFilter filters={filters} setFilters={setFilters} />}
            {activeTab === 'category' && (
              <CategoryFilter 
                filters={filters} 
                setFilters={setFilters} 
                categories={categories}
                categorySearch={categorySearch}
                setCategorySearch={setCategorySearch}
              />
            )}
            {activeTab === 'account' && (
              <AccountFilter 
                filters={filters} 
                setFilters={setFilters} 
                accounts={accounts} 
              />
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
