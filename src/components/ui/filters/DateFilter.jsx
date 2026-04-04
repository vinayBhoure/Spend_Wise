export const DateFilter = ({ filters, setFilters }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
      <input 
        type="date"
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400/50"
      />
    </div>
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
      <input 
        type="date"
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400/50"
      />
    </div>
  </div>
);
