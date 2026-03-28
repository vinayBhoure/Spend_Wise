import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

/**
 * @typedef {Object} StyledSelectOption
 * @property {string} value
 * @property {string} label
 * @property {string} [icon] - Optional emoji or icon string
 */

/**
 * @typedef {Object} StyledSelectProps
 * @property {StyledSelectOption[]} options
 * @property {string} value
 * @property {function} onChange
 * @property {string} [placeholder]
 * @property {boolean} [loading]
 * @property {string} [triggerClassName]
 * @property {string} [dropdownClassName]
 * @property {string} [label]
 * @property {React.ElementType} [leftIcon]
 * @property {string} [leftIconColor]
 */

export const StyledSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  loading = false,
  triggerClassName = '',
  dropdownClassName = '',
  label,
  leftIcon: LeftIcon,
  leftIconColor = 'text-slate-400',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = (val) => {
    if (val !== value) onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] ml-1 mb-2 block">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 bg-card-dark border border-white/5 rounded-xl px-4 py-3.5 text-sm font-bold transition-all focus:outline-none ${triggerClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {LeftIcon && <LeftIcon className={`size-[18px] shrink-0 ${leftIconColor}`} />}
          {loading ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            <span className={`truncate ${selected ? 'text-slate-100' : 'text-slate-500'}`}>
              {selected?.icon ? `${selected.icon}  ${selected.label}` : selected?.label || placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 bg-card-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 ${dropdownClassName}`}
        >
          <div className="py-1 max-h-64 overflow-y-auto no-scrollbar">
            {options.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No options</div>
            )}
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${opt.value === value
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-300 hover:bg-white/5'
                  }`}
              >
                <span className="font-medium truncate">
                  {opt.icon ? `${opt.icon}  ${opt.label}` : opt.label}
                </span>
                {opt.value === value && (
                  <Check className="size-4 text-primary shrink-0 ml-2" strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

StyledSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  triggerClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  label: PropTypes.string,
  leftIcon: PropTypes.elementType,
  leftIconColor: PropTypes.string,
};
