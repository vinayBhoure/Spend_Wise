import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { NotificationsList } from '../components/notifications/NotificationsList';
import { useNotifications } from '../hooks/useNotifications';
import { CheckCheck, RefreshCw } from 'lucide-react';
import { BottomNav } from '../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';

/**
 * Notifications page component
 */
export const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    refreshNotifications,
    markNotificationAsRead,
    markAllRead,
    removeNotification
  } = useNotifications();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 pb-28 font-manrope antialiased">
      <PageHeader 
        title="Notifications" 
        showBack={true}
        onBack={() => navigate('/dashboard')}
        rightElement={
          notifications.length > 0 && unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary active:scale-95 transition-transform"
            >
              <CheckCheck className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Read All</span>
            </button>
          )
        }
      />

      <main className="px-6 mt-6 max-w-[430px] mx-auto">
        <header className="flex items-center justify-between mb-6 px-1">
          <div className="flex flex-col">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Recent Updates</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-primary font-bold">You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          
          <button 
            onClick={refreshNotifications}
            disabled={loading}
            className={`p-2 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="size-4" />
          </button>
        </header>

        <NotificationsList 
          notifications={notifications}
          loading={loading}
          error={error}
          onMarkRead={markNotificationAsRead}
          onDelete={removeNotification}
          onRefresh={refreshNotifications}
        />
      </main>

      <BottomNav />
    </div>
  );
};
