import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const icons = {
  system: Info,
  transaction: Bell,
  budget: AlertTriangle,
  success: CheckCircle,
};

const colors = {
  system: 'text-blue-400 bg-blue-400/10',
  transaction: 'text-primary bg-primary/10',
  budget: 'text-amber-400 bg-amber-400/10',
  success: 'text-emerald-400 bg-emerald-400/10',
};

/**
 * Individual notification item component
 */
export const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const Icon = icons[notification.type] || icons.system;
  const colorClass = colors[notification.type] || colors.system;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div 
      className={`relative p-5 rounded-3xl border transition-all duration-300 ${
        notification.is_read 
          ? 'bg-card-dark/20 border-white/5' 
          : 'bg-card-dark/60 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
      }`}
    >
      <div className="flex gap-4">
        <div className={`size-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${colorClass}`}>
          <Icon className="size-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <h4 className={`text-sm font-bold truncate pr-3 ${notification.is_read ? 'text-slate-500' : 'text-slate-100'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap tabular-nums">
              {formatDate(notification.created_at)}
            </span>
          </div>
          <p className={`text-[13px] leading-relaxed mb-4 ${notification.is_read ? 'text-slate-500' : 'text-slate-400'}`}>
            {notification.message}
          </p>
          
          <div className="flex items-center gap-4">
            {!notification.is_read && (
              <button 
                onClick={() => onMarkRead(notification.id)}
                className="text-[11px] font-black uppercase tracking-widest text-primary active:scale-95 transition-transform"
              >
                Mark as read
              </button>
            )}
            <button 
              onClick={() => onDelete(notification.id)}
              className="text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-destructive active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {!notification.is_read && (
        <span className="absolute top-5 right-5 size-2.5 bg-primary rounded-full ring-4 ring-card-dark/60 shadow-[0_0_15px_rgba(0,230,203,0.6)] animate-pulse" />
      )}
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    is_read: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onMarkRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
