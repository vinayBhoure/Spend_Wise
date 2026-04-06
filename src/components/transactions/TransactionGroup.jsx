import PropTypes from 'prop-types';
import { TransactionRow } from './TransactionRow';
import { formatCurrency } from '../../utils/currency';

export const TransactionGroup = ({ title, date, transactions, summaryTotal, currencyCode = 'INR', onTransactionClick }) => {
  // Use generic formatting for the date, or use the provided title string directly (e.g. "Today")
  const displayTitle = title || date;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.2em]">{displayTitle}</h3>
        {summaryTotal !== undefined && (
          <span className="text-slate-500 text-[11px] font-bold tracking-tight">
            {summaryTotal < 0 ? '-' : '+'}{formatCurrency(Math.abs(summaryTotal), currencyCode)}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <TransactionRow
            key={tx.id}
            transaction={tx}
            currencyCode={currencyCode}
            onClick={() => onTransactionClick ? onTransactionClick(tx) : null}
          />
        ))}
      </div>
    </section>
  );
};

TransactionGroup.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  transactions: PropTypes.array.isRequired,
  summaryTotal: PropTypes.number,
  currencyCode: PropTypes.string,
  onTransactionClick: PropTypes.func
};
