import React from 'react';

/**
 * @param {{
 *   categories: Array<{name: string, emoji: string, percentage: number, color: any}>
 * }} props
 */
export const CategoryBreakdown = ({ categories }) => {
  return (
    <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar w-full pb-2">
      {categories.map((cat, index) => (
        <div 
          key={index}
          className={`flex items-center gap-2 px-4 py-2 shrink-0 rounded-xl ${cat.color.bgOpacity} border ${cat.color.border}`}
        >
          {cat.emoji && <span className="text-sm">{cat.emoji}</span>}
          <span className={`text-xs font-bold ${cat.color.text}`}>
            {cat.name} {cat.percentage.toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
};
