import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getCurrencySymbol, formatCurrency } from '../../utils/currency';

/**
 * @typedef {Object} NetWorthCardProps
 * @property {number} netWorth
 * @property {string} currency
 * @property {'loading' | 'empty' | 'ready'} status
 */

export const NetWorthCard = ({ netWorth, currency, status }) => {
  if (status === 'loading') {
    return (
      <section className="mt-6 mb-8">
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl animate-pulse">
          <div className="h-3 w-24 bg-white/10 rounded mb-3" />
          <div className="h-9 w-40 bg-white/10 rounded" />
        </div>
      </section>
    );
  }

  if (status === 'empty') {
    return (
      <section className="mt-6 mb-8">
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Total Net Worth
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-400">
            {formatCurrency(0, currency || 'INR')}
          </h2>
        </div>
      </section>
    );
  }

  const isPositive = netWorth >= 0;
  const formatted = formatCurrency(Math.abs(netWorth), currency || 'INR');

  return (
    <section className="mt-6 mb-8">
      <div className="bg-card-dark border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-xl">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
          Total Net Worth
        </p>
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-extrabold tracking-tight">
            {isPositive ? '' : '-'}{formatted}
          </h2>
          <div
            className={`flex items-center text-sm font-bold ${
              isPositive ? 'text-primary' : 'text-destructive'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="size-4 mr-0.5" />
            ) : (
              <TrendingDown className="size-4 mr-0.5" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

NetWorthCard.propTypes = {
  netWorth: PropTypes.number,
  currency: PropTypes.string,
  status: PropTypes.oneOf(['loading', 'empty', 'ready']),
};

NetWorthCard.defaultProps = {
  netWorth: 0,
  currency: 'INR',
  status: 'ready',
};
