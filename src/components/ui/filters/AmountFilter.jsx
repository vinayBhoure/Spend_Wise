export const AmountFilter = ({ filters, setFilters }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Minimum Amount</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
        <input 
          type="number"
          placeholder="0.00"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white outline-none focus:border-emerald-400/50"
        />
      </div>
    </div>
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Maximum Amount</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
        <input 
          type="number"
          placeholder="99999.00"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white outline-none focus:border-emerald-400/50"
        />
      </div>
    </div>
  </div>
);
