import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * @interface PageHeaderProps
 * @property {string} [title] - The title of the page.
 * @property {boolean} [showBack] - Whether to show the back button.
 * @property {() => void} [onBack] - Custom back button handler.
 * @property {React.ReactNode} [rightElement] - Content to display on the right side.
 * @property {boolean} [loading] - Whether the header is in a loading state.
 * @property {React.ReactNode} [children] - Custom content to replace title (e.g. search bar).
 */

export const PageHeader = ({ 
  title, 
  showBack = false, 
  onBack, 
  rightElement,
  loading = false,
  children 
}) => {
  const navigate = useNavigate();

  // Handle loading state
  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-white/5 animate-pulse">
        <div className="flex items-center justify-between min-h-[40px]">
          <div className="flex items-center gap-4">
            {showBack && <div className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" />}
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          {rightElement && <div className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" />}
        </div>
      </header>
    );
  }

  // Handle empty state (though rare for a header)
  if (!title && !children && !showBack && !rightElement) {
    return null;
  }

  // Error state is typically handled by the parent, but we'll keep it standard
  // Headers don't usually "fail" on their own unless we add complex logic.

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-white/5">
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-4 flex-1">
          {showBack && (
            <button 
              onClick={onBack || (() => navigate(-1))}
              aria-label="Go back"
              className="size-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center active:scale-95 text-slate-900 dark:text-slate-100 shrink-0"
            >
              <ChevronLeft className="size-6" strokeWidth={2.5} />
            </button>
          )}
          
          <div className="flex-1">
            {children ? (
              children
            ) : (
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {title}
              </h1>
            )}
          </div>
        </div>
        
        {rightElement && (
          <div className="flex items-center gap-3 ml-4 shrink-0">
            {rightElement}
          </div>
        )}
      </div>
    </header>
  );
};
