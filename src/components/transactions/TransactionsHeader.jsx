import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterPill } from '../ui/FilterPill';

export const TransactionsHeader = ({ onOpenFilter, activeFilterCount = 0 }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md px-6 pt-10 pb-4 border-b border-white/5">
      <div className="flex items-center justify-between mb-2 h-[40px]">
        {isSearching ? (
          <input
            autoFocus
            type="text"
            className="flex-1 mr-3 h-full bg-white/5 text-white rounded-xl px-4 outline-none placeholder:text-slate-500 font-medium border-0 focus:ring-0"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => {
              if (!searchQuery) setIsSearching(false);
            }}
          />
        ) : (
          <h1 className="text-3xl font-extrabold tracking-tight">Transactions</h1>
        )}
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSearching(true)}
            className="size-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-primary shrink-0 transition-colors hover:bg-white/10"
          >
            <Search size={20} />
          </button>
          
          <button 
            onClick={onOpenFilter}
            className="size-10 rounded-full flex items-center justify-center bg-primary text-background-dark shrink-0 shadow-lg shadow-primary/20 relative transition-transform active:scale-95"
          >
            <Filter size={20} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-background-dark">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
