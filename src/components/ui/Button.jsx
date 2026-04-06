import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {"button" | "submit" | "reset"} [type]
 * @property {boolean} [isLoading]
 * @property {boolean} [disabled]
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onClick]
 */

/**
 * Premium CTA Button based on design system
 * @param {ButtonProps} props
 */
export const Button = ({
  children,
  className = '',
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
}) => {
  const baseClasses = 'h-12 bg-primary text-background-dark font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(0,230,203,0.25)] active:scale-[0.97] transition-all tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : null}
      {children}
    </button>
  );
};
