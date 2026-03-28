import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PageHeader } from '../layout/PageHeader';

export const TransactionsHeader = ({ onOpenFilter, activeFilterCount = 0 }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const rightElement = (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setIsSearching(!isSearching)}
        aria-label={isSearching ? "Close search" : "Open search"}
        className={`size-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
          isSearching 
            ? 'bg-primary text-background-dark' 
            : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
        }`}
      >
        {isSearching ? <X size={20} /> : <Search size={20} />}
      </button>
      
      <button 
        onClick={onOpenFilter}
        aria-label="Filter transactions"
        className="size-10 rounded-xl flex items-center justify-center bg-primary text-background-dark shadow-lg shadow-primary/20 relative transition-transform active:scale-95"
      >
        <Filter size={20} />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-background-light dark:border-background-dark">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <PageHeader 
      title={isSearching ? "" : "Transactions"}
      rightElement={rightElement}
    >
      {isSearching && (
        <input
          autoFocus
          type="text"
          className="w-full h-10 bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl px-4 outline-none placeholder:text-slate-500 font-medium border-0 focus:ring-1 focus:ring-primary/30 transition-all"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}
    </PageHeader>
  );
};
