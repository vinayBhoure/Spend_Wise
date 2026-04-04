import React from 'react';
import PropTypes from 'prop-types';
import { Crown } from 'lucide-react';

/**
 * @typedef {Object} UpgradePromptProps
 * @property {() => void} onUpgrade - Callback when upgrade button is clicked
 */

/**
 * A compact upgrade banner shown to Free-plan users on the ManageCategories page.
 * Nudges them to upgrade for custom category CRUD.
 */
export const UpgradePrompt = ({ onUpgrade }) => {
  return (
    <div className="mx-6 mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/20">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
          <Crown className="size-5 text-amber-400" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-100 mb-0.5">
            Unlock Custom Categories
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create, edit, and organize your own categories with emoji icons. Upgrade to Plus for full control.
          </p>
        </div>
      </div>
      <button
        onClick={onUpgrade}
        className="w-full mt-3 h-10 rounded-xl bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20 active:scale-[0.97] transition-all hover:bg-amber-500/25"
      >
        Upgrade to Plus
      </button>
    </div>
  );
};

UpgradePrompt.propTypes = {
  onUpgrade: PropTypes.func.isRequired,
};
