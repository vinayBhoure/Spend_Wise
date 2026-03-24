import React from 'react';

/**
 * @param {{
 *   src?: string,
 *   alt?: string,
 *   size?: 'sm' | 'md' | 'lg' | 'xl',
 *   fallbackInitials?: string
 * }} props
 */
export const Avatar = ({ src, alt = 'Avatar', size = 'md', fallbackInitials = '?' }) => {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-16',
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`${dim} rounded-full border-2 border-primary/30 p-0.5 shrink-0 bg-background-dark flex items-center justify-center overflow-hidden`}>
      {src ? (
        <div 
          className="w-full h-full rounded-full bg-cover bg-center" 
          role="img" 
          aria-label={alt}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : (
        <span className="text-primary font-semibold text-sm">{fallbackInitials}</span>
      )}
    </div>
  );
};
