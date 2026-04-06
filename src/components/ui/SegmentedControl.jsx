import React from 'react';

export const SegmentedControl = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-[rgba(17,24,39,0.6)] border border-white/10 p-1 rounded-xl flex mb-6 w-full">
      <button
        type="button"
        onClick={() => onTabChange('login')}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
          activeTab === 'login'
            ? 'bg-primary text-background-dark shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => onTabChange('signup')}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
          activeTab === 'signup'
            ? 'bg-primary text-background-dark shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};
