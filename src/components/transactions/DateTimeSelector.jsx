import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export const DateTimeSelector = ({ datetime, onChange }) => {
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    const updated = new Date(datetime);
    updated.setFullYear(newDate.getFullYear());
    updated.setMonth(newDate.getMonth());
    updated.setDate(newDate.getDate());
    onChange(updated);
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const updated = new Date(datetime);
    updated.setHours(parseInt(hours));
    updated.setMinutes(parseInt(minutes));
    onChange(updated);
  };

  const dateStr = datetime.toISOString().split('T')[0];
  const timeStr = `${String(datetime.getHours()).padStart(2, '0')}:${String(datetime.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="px-6 mb-10">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">
        Date & Time
      </h3>
      
      <div className="flex gap-4">
        {/* Date Input */}
        <div className="flex-1 group">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block ml-1">
            Date
          </label>
          <div className="relative h-14 bg-surface-dark border border-slate-800 rounded-xl overflow-hidden active:scale-[0.98] transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              <Calendar size={18} />
            </div>
            <input 
              type="date"
              value={dateStr}
              onChange={handleDateChange}
              className="w-full h-full pl-12 pr-4 bg-transparent text-slate-100 font-bold text-sm focus:outline-none appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Time Input */}
        <div className="flex-1 group">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block ml-1">
            Time
          </label>
          <div className="relative h-14 bg-surface-dark border border-slate-800 rounded-xl overflow-hidden active:scale-[0.98] transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              <Clock size={18} />
            </div>
            <input 
              type="time"
              value={timeStr}
              onChange={handleTimeChange}
              className="w-full h-full pl-12 pr-4 bg-transparent text-slate-100 font-bold text-sm focus:outline-none appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Hide native date/time picker icons as we use Lucide */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      `}} />
    </div>
  );
};
