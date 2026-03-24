import React from 'react';
import { X, Loader2 } from 'lucide-react';

/**
 * Interface definition for EditTransactionHeader props
 * @typedef {Object} EditTransactionHeaderProps
 * @property {() => void} onClose - Handle closing the edit screen
 * @property {() => void} onSave - Handle saving the changes
 * @property {boolean} [saving] - Whether the form is currently saving
 * @property {boolean} [loading] - Whether component is loading initial state
 * @property {boolean} [error] - Whether component has an error
 */

/**
 * Sticky header with back button, page title, and submit action
 * @param {EditTransactionHeaderProps} props
 */
export const EditTransactionHeader = ({ onClose, onSave, saving = false, loading = false, error = false }) => {
  if (loading) {
    return (
      <header className="flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-800 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-800"></div>
        <div className="h-4 w-32 bg-slate-800 rounded"></div>
        <div className="h-4 w-12 bg-slate-800 rounded"></div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-800/50">
      <button
        onClick={onClose}
        disabled={saving}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-800 transition-colors text-slate-100 disabled:opacity-50"
      >
        <X size={24} />
      </button>

      <h1 className="text-lg font-bold tracking-tight text-slate-100 text-center flex-1">
        {error ? 'Error loading transaction' : 'Edit'}
      </h1>

      <button
        onClick={onSave}
        disabled={saving || error}
        className="text-primary font-bold text-base hover:opacity-80 transition-opacity px-2 disabled:opacity-50 disabled:grayscale flex items-center gap-2"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? 'Saving...' : 'Save'}
      </button>
    </header>
  );
};
