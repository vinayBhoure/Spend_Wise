import React from 'react';
import PropTypes from 'prop-types';
import { Check, Crown } from 'lucide-react';

/**
 * @typedef {Object} PlanCardProps
 * @property {string} name
 * @property {string} price
 * @property {string[]} features
 * @property {boolean} isSelected
 * @property {boolean} isCurrent
 * @property {boolean} showUpgradeBadge
 * @property {function} onSelect
 */

export const PlanCard = ({ name, price, features, isSelected, isCurrent, showUpgradeBadge, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-5 transition-all active:scale-[0.98] relative ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
          : 'border-white/10 bg-card-dark hover:border-white/20'
      }`}
    >
      {/* Upgrade Badge */}
      {showUpgradeBadge && (
        <div className="absolute -top-3 right-4 flex items-center gap-1 bg-primary px-3 py-1 rounded-full">
          <Crown className="size-3 text-background-dark" strokeWidth={2.5} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-background-dark">
            Upgrade
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100">{name}</h3>
          <p className="text-sm text-slate-400 font-medium">{price}</p>
        </div>
        {/* Selection indicator */}
        <div
          className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-primary bg-primary'
              : 'border-white/20 bg-transparent'
          }`}
        >
          {isSelected && <Check className="size-3.5 text-background-dark" strokeWidth={3} />}
        </div>
      </div>

      {isCurrent && (
        <span className="inline-block mb-3 text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/15 px-2.5 py-1 rounded-md">
          Current Plan
        </span>
      )}

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="size-3.5 text-primary shrink-0" strokeWidth={2.5} />
            <span className="text-xs text-slate-300 font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  );
};

PlanCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  showUpgradeBadge: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};
