import { Wallet } from 'lucide-react';

export const PaymentMethodSelector = ({ accounts, selectedAccountId, onSelect }) => {
  return (
    <div className="px-6 mb-10">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        Payment Method
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-dark border border-slate-800 text-slate-400">
          <Wallet size={20} />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onSelect(acc.id)}
                className={`whitespace-nowrap flex-shrink-0 rounded-lg px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? 'bg-primary/10 border-2 border-primary/50 text-primary'
                    : 'bg-surface-dark border border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {acc.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
