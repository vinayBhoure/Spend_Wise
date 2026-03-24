import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Using forwardRef so react-hook-form can inject its refs.
export const Input = forwardRef(({
  label,
  icon: Icon, // Changed from icon to Icon to allow component usage
  type = 'text',
  placeholder,
  error,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center ml-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
          {isPassword && (
            <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          )}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon size={20} strokeWidth={1.5} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={`
            w-full bg-surface border border-border-subtle rounded-lg py-4 text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${error ? 'border-destructive' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-destructive text-xs ml-1 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
