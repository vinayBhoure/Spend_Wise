import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, Check } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const ProfileHeader = ({ name, email, avatarUrl, isPro = true, onClick }) => {
  return (
    <section 
      onClick={onClick}
      className={`mt-4 mb-6 bg-white dark:bg-card-dark rounded-xl p-5 flex items-center justify-between border border-slate-200 dark:border-white/5 shadow-sm ${onClick ? 'cursor-pointer active:scale-[0.98] transition-all' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar 
            src={avatarUrl} 
            alt={name || 'User profile'}
            className="size-16 border-2 border-primary"
            fallbackText={name ? name.charAt(0).toUpperCase() : '?'}
          />
          {isPro && (
            <div className="absolute bottom-0 right-0 size-5 bg-primary rounded-full border-2 border-card-dark flex items-center justify-center">
              <Check className="size-2.5 text-background-dark font-bold" strokeWidth={4} />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold leading-none text-slate-900 dark:text-slate-100">{name || 'User'}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-1.5">{email}</p>
          {isPro && (
             <span className="inline-block mt-2.5 px-2 py-0.5 bg-primary text-background-dark text-[9px] font-bold uppercase tracking-wider rounded-md">
               PRO
             </span>
          )}
        </div>
      </div>
      {onClick && (
        <ChevronRight className="size-6 text-slate-400" />
      )}
    </section>
  );
};

ProfileHeader.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  avatarUrl: PropTypes.string,
  isPro: PropTypes.bool,
  onClick: PropTypes.func,
};
