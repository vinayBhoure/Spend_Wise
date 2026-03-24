import { useState } from 'react';
import { X } from 'lucide-react';

export const CategoryGrid = ({ categories, selectedCategoryId, onSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayCategories = categories.slice(0, 8);

  const handleSelect = (id) => {
    onSelect(id);
    setIsModalOpen(false);
  };

  return (
    <div className="px-6 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Category
        </h3>
        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-primary text-xs font-bold uppercase tracking-wider"
        >
          See all
        </button>
      </div>

      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-2 border-primary/40 shadow-[0_0_20px_rgba(0,230,203,0.15)] opacity-100'
                    : 'bg-surface-dark border border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                {cat.emoji}
              </div>
              <span
                className={`text-[10px] font-bold uppercase text-center ${
                  isSelected ? 'text-primary' : 'text-slate-500'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="bg-surface-dark w-full sm:w-96 max-h-[60vh] rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 uppercase tracking-wider text-sm">All Categories</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-4 gap-x-4 gap-y-8 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                      isSelected ? 'bg-primary/10 border-2 border-primary/40 shadow-[0_0_20px_rgba(0,230,203,0.15)] opacity-100' : 'bg-background-dark border border-slate-800 opacity-60 hover:opacity-100'
                    }`}>
                      {cat.emoji}
                    </div>
                    <span className={`text-[10px] font-bold uppercase text-center ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

