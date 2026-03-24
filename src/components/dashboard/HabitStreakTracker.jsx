import React from 'react';
import { Check } from 'lucide-react';

/**
 * @param {{
 *   streakDays: number,
 *   logs: Array<{date: string, dayName: string, logged: boolean}>
 * }} props
 */
export const HabitStreakTracker = ({ streakDays, logs }) => {
  return (
    <section className="bg-card-dark/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="size-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,230,203,0.6)]"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Daily Streak</h3>
        </div>
        <span className="text-primary text-[10px] font-black tracking-tight bg-primary/10 px-2.5 py-1 rounded-full">{streakDays} DAYS 🔥</span>
      </div>
      
      <div className="flex justify-between items-end gap-1 px-1">
        {logs.map((log, index) => {
          const isToday = index === logs.length - 1;
          
          return (
            <div key={log.date} className="flex flex-col items-center gap-2.5 flex-1">
              <div className={`
                size-8 rounded-full flex items-center justify-center transition-all duration-500
                ${log.logged 
                  ? 'bg-primary text-background-dark shadow-[0_0_12px_rgba(0,230,203,0.25)] scale-110 z-10' 
                  : isToday 
                    ? 'border-2 border-primary/40 border-dashed text-primary/60 animate-pulse' 
                    : 'bg-white/5 border border-white/5 opacity-30'}
              `}>
                {log.logged ? (
                  <Check className="size-3.5" strokeWidth={4} />
                ) : isToday ? (
                  <span className="text-[7px] font-black uppercase tracking-tighter">Day</span>
                ) : null}
              </div>
              
              <span className={`text-[8px] font-bold uppercase tracking-[0.05em] ${isToday ? 'text-primary' : 'text-slate-600'}`}>
                {log.dayName.substring(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
