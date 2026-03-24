export const QuickAmountSelect = ({ amounts, onSelect }) => {
  return (
    <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-2">
      {amounts.map((amount) => (
        <button
          key={amount.label}
          type="button"
          onClick={() => onSelect(amount.value)}
          className="whitespace-nowrap px-5 py-2.5 rounded-lg bg-slate-850 border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
        >
          {amount.label}
        </button>
      ))}
    </div>
  );
};
