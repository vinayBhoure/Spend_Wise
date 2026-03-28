import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';

/**
 * @param {{
 *   user: object | null,
 *   profile: object | null,
 *   profileLoading?: boolean,
 *   notificationsCount?: number
 * }} props
 */
export const DashboardHeader = ({ user, profile, profileLoading = false, notificationsCount = 1 }) => {
  const navigate = useNavigate();
  
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.full_name || 'User';
  const avatarUrl = profile?.avatar_url || null;
  const firstName = fullName.split(' ')[0];

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-white/5">
      <div className="flex items-center justify-between min-h-[40px]">
        <div 
          className="flex items-center gap-4 cursor-pointer active:scale-95 transition-transform"
          onClick={() => navigate('/profile')}
        >
          <Avatar 
            src={avatarUrl} 
            alt={fullName} 
            fallbackInitials={firstName.charAt(0).toUpperCase()} 
            loading={profileLoading}
            size="lg"
          />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.18em] mb-0.5">Welcome back</p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{fullName}</h1>
          </div>
        </div>

        <div className="relative">
          <button 
            aria-label="Notifications"
            className="size-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 border border-white/5 active:scale-90 transition-transform hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
          >
            <Bell className="size-5" />
          </button>
          {notificationsCount > 0 && (
            <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-2 ring-background-light dark:ring-background-dark" />
          )}
        </div>
      </div>
    </header>
  );
};
