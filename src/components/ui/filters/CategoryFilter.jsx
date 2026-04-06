import { Search, Check } from 'lucide-react';

export const CategoryFilter = ({ filters, setFilters, categories, categorySearch, setCategorySearch }) => {
  const toggleArrayFilter = (id) => {
    const currentArray = filters.categories || [];
    if (currentArray.includes(id)) {
      setFilters({ ...filters, categories: currentArray.filter(i => i !== id) });
    } else {
      setFilters({ ...filters, categories: [...currentArray, id] });
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
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
        <p className="text-center text-slate-500 text-sm py-3">No categories found</p>
      ) : (
        <div className="space-y-1 pb-4">
          {filteredCategories.map(cat => {
            const isSelected = filters.categories?.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleArrayFilter(cat.id)}
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
  );
};
