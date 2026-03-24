import React from 'react';

export const SocialButton = ({ icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white/5 backdrop-blur-md border border-white/10 py-3.5 rounded-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
    >
      {icon}
      <span className="text-sm font-semibold text-slate-200">{label}</span>
    </button>
  );
};
