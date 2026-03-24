import PropTypes from 'prop-types';

export const SummaryCard = ({ title, amount, variant = 'default', trend, progress }) => {
  const isPrimary = variant === 'primary';
  
  const cardClasses = isPrimary 
    ? "bg-primary/5 border border-primary/20" 
    : "bg-white/5 border border-white/10";
    
  const titleClasses = isPrimary ? "text-primary/60" : "text-slate-500";
  const amountClasses = isPrimary ? "text-primary" : "text-white";

  return (
    <div className={`flex min-w-[160px] flex-1 flex-col gap-2 rounded-2xl p-5 ${cardClasses}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${titleClasses}`}>
        {title}
      </p>
      
      <p className={`tracking-tight text-2xl font-extrabold truncate ${amountClasses}`}>
        {amount}
      </p>
      
      {/* Trend indicator (e.g. Total Spent) */}
      {trend && (
        <div className="flex items-center gap-1">
          {trend.icon && <trend.icon size={14} className={trend.isPositive ? 'text-emerald-500' : 'text-rose-500'} />}
          <p className={`text-xs font-bold ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend.label}
          </p>
        </div>
      )}
      
      {/* Progress bar (e.g. Remaining budget) */}
      {progress !== undefined && (
        <div className="w-full bg-primary/10 h-1.5 rounded-full mt-1 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'primary']),
  trend: PropTypes.shape({
    label: PropTypes.string,
    isPositive: PropTypes.bool,
    icon: PropTypes.elementType
  }),
  progress: PropTypes.number
};

SummaryCard.defaultProps = {
  variant: 'default'
};
