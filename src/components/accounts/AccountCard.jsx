import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Landmark, PiggyBank, Wallet, CreditCard, Smartphone } from 'lucide-react';
import { getCurrencySymbol, formatCurrency } from '../../utils/currency';

/**
 * @typedef {Object} AccountCardProps
 * @property {{ id: string, name: string, type: string, current_balance: number, currency: string }} account
 * @property {number} netWorth
 */

const ICON_MAP = {
  bank: { icon: Landmark, bgClass: 'bg-blue-600/20', textClass: 'text-blue-400', borderClass: 'border-blue-600/30' },
  cash: { icon: Wallet, bgClass: 'bg-slate-700/20', textClass: 'text-slate-400', borderClass: 'border-slate-700/30' },
  upi: { icon: Smartphone, bgClass: 'bg-violet-500/20', textClass: 'text-violet-400', borderClass: 'border-violet-500/30' },
  credit_card: { icon: CreditCard, bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', borderClass: 'border-amber-500/30' },
};

const TYPE_LABELS = {
  bank: 'Bank Account',
  cash: 'Cash on hand',
  upi: 'UPI Wallet',
  credit_card: 'Credit Card',
};

export const AccountCard = ({ account, netWorth }) => {
  const navigate = useNavigate();
  const { id, name, type, current_balance, currency } = account;
  const balance = Number(current_balance) || 0;
  const isDebt = type === 'credit_card';

  const iconConfig = ICON_MAP[type] || ICON_MAP.bank;
  const Icon = iconConfig.icon;

  const formattedBalance = formatCurrency(balance, currency || 'INR');

  // Progress bar ratio — only for non-debt accounts
  const absNetWorth = Math.abs(netWorth) || 1;
  const progressPercent = Math.min(100, Math.round((Math.abs(balance) / absNetWorth) * 100));

  return (
    <button
      onClick={() => navigate(`/edit-account/${id}`)}
      className={`w-full bg-card-dark border border-border-dark p-4 rounded-xl flex items-center justify-between active:scale-[0.98] transition-all text-left ${
        isDebt ? 'border-l-2 border-l-rose-500' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg ${iconConfig.bgClass} flex items-center justify-center ${iconConfig.textClass} border ${iconConfig.borderClass}`}
        >
          <Icon className="size-6" />
        </div>
        <div>
          <h4 className="font-bold text-base text-slate-100">{name}</h4>
          <p className="text-slate-500 text-xs">{TYPE_LABELS[type] || type}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold text-base ${
            isDebt ? 'text-rose-500' : 'text-slate-100'
          }`}
        >
          {isDebt ? '-' : ''}{formattedBalance}
        </p>
        {!isDebt && (
          <div className="w-12 h-2 ml-auto mt-2 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/60 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </button>
  );
};

AccountCard.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    current_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
  }).isRequired,
  netWorth: PropTypes.number,
};

AccountCard.defaultProps = {
  netWorth: 0,
};
