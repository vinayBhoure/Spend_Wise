import React from 'react';
import PropTypes from 'prop-types';
import { X, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpgradeModal = ({ isOpen, onClose, featureName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-card-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in">
        {/* Header (close button only) */}
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 text-center flex flex-col items-center">
          <div className="size-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 text-amber-400">
            <Crown className="size-8" strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            Plus Plan Required
          </h3>
          
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            {featureName ? `Unlock ${featureName} and other advanced features by upgrading to Plus.` : 'Upgrade to Plus to unlock advanced features and take full control of your finances.'}
          </p>

          <button
            onClick={() => {
              onClose();
              navigate('/plans');
            }}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            Upgrade to Plus
          </button>
        </div>
      </div>
    </div>
  );
};

UpgradeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  featureName: PropTypes.string,
};
