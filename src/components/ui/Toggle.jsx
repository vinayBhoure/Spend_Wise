import React from 'react';
import PropTypes from 'prop-types';

export const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_10px_rgba(0,230,203,0.3)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
    </label>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
