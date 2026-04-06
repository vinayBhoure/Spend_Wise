import React from 'react';

/**
 * @param {{
 *   children: React.ReactNode,
 *   className?: string,
 *   variant?: 'default' | 'emerald'
 * }} props
 */
export const Card = ({ children, className = '', variant = 'default' }) => {
  const baseStyle = 'rounded-xl p-5 shadow-2xl relative overflow-hidden';
  const variants = {
    default: 'bg-card-dark border border-white/5',
    emerald: 'bg-gradient-to-br from-[#111817] to-[#0a0a0a] border border-white/5 shadow-[0_4px_20px_rgba(0,230,203,0.05)]',
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`${baseStyle} ${currentVariant} ${className}`}>
      {children}
    </div>
  );
};
