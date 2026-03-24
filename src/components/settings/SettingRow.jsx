import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

export const SettingRow = ({
  icon: Icon,
  title,
  subtitle,
  rightElement,
  onClick,
  showChevron = true,
}) => {
  const isClickable = !!onClick;
  
  const content = (
    <>
      <div className="flex items-center gap-4 p-4">
        {Icon && (
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Icon className="size-[22px]" strokeWidth={2} />
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col truncate pr-4">
            <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{title}</span>
            {subtitle && (
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight truncate">{subtitle}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {rightElement}
            {showChevron && !rightElement && (
                <ChevronRight className="size-4 text-slate-400" />
            )}
          </div>
        </div>
      </div>
      {/* 1px separator, will be hidden by parent specifically for the last child */}
      <div className="h-px bg-slate-100 dark:bg-white/5 ml-16 row-separator"></div>
    </>
  );

  if (isClickable) {
    return (
      <button 
        onClick={onClick}
        className="w-full text-left active:bg-slate-100 dark:active:bg-white/5 transition-colors group setting-row"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="w-full setting-row">
      {content}
    </div>
  );
};

SettingRow.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  rightElement: PropTypes.node,
  onClick: PropTypes.func,
  showChevron: PropTypes.bool,
};
