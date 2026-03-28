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
    <header className="flex items-center justify-between px-6 pt-8 pb-4">
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
          <h1 className="text-lg font-bold tracking-tight text-slate-100">{fullName}</h1>
        </div>
      </div>

      <div className="relative">
        <button className="size-12 rounded-2xl bg-card-dark flex items-center justify-center text-slate-400 border border-white/5 active:scale-90 transition-transform">
          <Bell className="size-6" />
        </button>
        {notificationsCount > 0 && (
          <span className="absolute top-3 right-3 size-2.5 bg-primary rounded-full ring-2 ring-card-dark" />
        )}
      </div>
    </header>
  );
};
