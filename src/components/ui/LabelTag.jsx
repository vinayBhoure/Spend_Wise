import React from 'react';
import { X } from 'lucide-react';

/**
 * Interface definition for LabelTag props
 * @typedef {Object} LabelTagProps
 * @property {string} text - The tag text
 * @property {() => void} [onRemove] - Callback when remove button is clicked
 * @property {boolean} [loading] - Whether component is loading
 * @property {boolean} [error] - Whether component has error state
 */

/**
 * Pill-shaped tag with name and optional remove button
 * @param {LabelTagProps} props
 */
export const LabelTag = ({ text, onRemove, loading = false, error = false }) => {
  if (loading) {
    return (
      <div className="h-8 w-20 bg-slate-800/10 rounded-full animate-pulse"></div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-full px-3 py-1.5 flex items-center gap-2 text-danger">
         <span className="text-[10px] font-bold uppercase tracking-wider">Error tag!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-card-dark border border-white/5 rounded-full px-3.5 py-1.5 gap-2 transition-colors hover:border-white/10 shadow-sm">
      <span className="text-[11px] font-bold text-slate-300 tracking-tight lowercase">
        #{text}
      </span>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="text-slate-500 hover:text-danger hover:scale-110 active:scale-90 transition-all"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};
