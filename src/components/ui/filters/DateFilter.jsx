import { Lock, Crown } from 'lucide-react';
import { usePlan } from '../../../hooks/usePlan';

export const DateFilter = ({ filters, setFilters }) => {
  const { isPlusUser } = usePlan();

  const handleQuickPeriod = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
        const monday = new Date(today.setDate(diff));
        startDate = monday;
        endDate = new Date();
        break;
      }
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'last_6_months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        endDate = new Date();
        break;
      default:
        return;
    }

    setFilters({
      ...filters,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Periods */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Quick Select</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_6_months', label: 'Last 6 Months' }
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => handleQuickPeriod(period.id)}
              className="px-1 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 hover:bg-emerald-400 hover:text-background-dark transition-all active:scale-95 text-center"
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Custom Range */}
      <div className="space-y-4 relative">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Custom Date Range</label>
          {!isPlusUser && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Lock size={10} className="text-amber-400" />
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">PLUS ONLY</span>
            </div>
          )}
          {isPlusUser && <Crown size={12} className="text-amber-400" />}
        </div>
        
        <div className="relative group">
          {!isPlusUser && (
            <div className="absolute -inset-2 z-10 bg-surface/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                <span className="bg-background-dark/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl">
                  Upgrade to Plus for Custom Range
                </span>
            </div>
          )}
          
          <div className={`space-y-3 transition-opacity ${!isPlusUser ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 font-medium">Start Date</label>
              <input 
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 font-medium">End Date</label>
              <input 
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
