import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';

/**
 * @param {{
 *   user: { full_name?: string, avatar_url?: string, user_metadata?: { full_name?: string } } | null,
 *   notificationsCount?: number
 * }} props
 */
export const DashboardHeader = ({ user, notificationsCount = 1 }) => {
  const navigate = useNavigate();
  const fullName = user?.user_metadata?.full_name || user?.full_name || 'User';
  const firstName = fullName.split(' ')[0];

  return (
    <header className="flex items-center justify-between px-6 pt-8 pb-4">
      <div 
        className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
        onClick={() => navigate('/profile')}
      >
        <Avatar src={user?.avatar_url} alt={firstName} fallbackInitials={firstName.charAt(0)} />
        <div>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.15em]">Welcome back</p>
          <h1 className="text-lg font-bold tracking-tight">{fullName}</h1>
        </div>
      </div>
      
      <button 
        aria-label="Notifications"
        className="relative p-2 rounded-lg bg-card-dark border border-white/5 text-slate-400 hover:text-white transition-colors"
      >
        <Bell className="size-5" />
        {notificationsCount > 0 && (
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-card-dark" />
        )}
      </button>
    </header>
  );
};
