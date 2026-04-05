import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Loader2, BellOff, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Notifications list container component
 */
export const NotificationsList = ({ 
  notifications, 
  loading, 
  error, 
  onMarkRead, 
  onDelete,
  onRefresh 
}) => {
  
  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
        <Loader2 className="size-12 text-primary animate-spin mb-6" />
        <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">Updating Notifications</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-destructive/5 border border-destructive/10 flex flex-col items-center text-center animate-in zoom-in duration-300">
        <AlertCircle className="size-14 text-destructive mb-4" />
        <h3 className="text-lg font-bold text-slate-100 mb-2">Something went wrong</h3>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-xs">{error}</p>
        <button 
          onClick={onRefresh}
          className="bg-primary text-background-dark font-black px-8 py-3 rounded-2xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in slide-in-from-bottom duration-500">
        <div className="size-24 rounded-full bg-slate-900/50 flex items-center justify-center mb-8 border border-white/5">
          <BellOff className="size-10 text-slate-700" />
        </div>
        <h3 className="text-2xl font-black text-slate-100 mb-2">All caught up!</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          You don't have any notifications right now. Sit back and relax!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

NotificationsList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onMarkRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
