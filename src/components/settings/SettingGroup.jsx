import React from 'react';
import PropTypes from 'prop-types';

export const SettingGroup = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h3 className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-4">
          {title}
        </h3>
      )}
      <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 [&>.setting-row:last-child_.row-separator]:hidden shadow-xl">
        {children}
      </div>
    </div>
  );
};

SettingGroup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
