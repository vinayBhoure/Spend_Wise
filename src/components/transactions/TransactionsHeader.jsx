import { useState } from 'react';
import { Search } from 'lucide-react';
import { FilterPill } from '../ui/FilterPill';

export const TransactionsHeader = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md px-6 pt-10 pb-4">
      <div className="flex items-center justify-between mb-6 h-[40px]">
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
        
        <button 
          onClick={() => setIsSearching(true)}
          className="size-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-primary shrink-0"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
        <FilterPill label="This Month" isActive={true} />
        <FilterPill label="Categories" />
        <FilterPill label="Payment" />
      </div>
    </header>
  );
};
