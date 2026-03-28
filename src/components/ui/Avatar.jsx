import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @param {{
 *   src?: string | null,
 *   alt?: string,
 *   size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
 *   fallbackInitials?: string,
 *   loading?: boolean
 * }} props
 */
export const Avatar = ({ src, alt = 'Avatar', size = 'md', fallbackInitials = '?', loading = false }) => {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-16',
    '2xl': 'size-24',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
    '2xl': 'text-3xl',
  };

  const dim = sizeClasses[size] || sizeClasses.md;
  const fontSize = textClasses[size] || textClasses.md;

  return (
    <div className={`${dim} rounded-full border-2 border-primary/20 p-0.5 shrink-0 bg-card-dark flex items-center justify-center overflow-hidden transition-all shadow-sm`}>
      {loading ? (
        <Loader2 className="size-1/2 text-primary/40 animate-spin" />
      ) : src ? (
        <div
          className="w-full h-full rounded-full bg-cover bg-center border border-white/5"
          role="img"
          aria-label={alt}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
          <span className={`text-primary font-bold ${fontSize} uppercase tracking-tight`}>
            {fallbackInitials}
          </span>
        </div>
      )}
    </div>
  );
};

