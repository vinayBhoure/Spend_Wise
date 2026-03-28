import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ReceiptText, PieChart, Settings, Plus } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/transactions', label: 'Transactions', icon: ReceiptText },
  { path: '/statistics', label: 'Statistics', icon: PieChart },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom)] h-[calc(5rem+env(safe-area-inset-bottom))] bg-slate-950/90 backdrop-blur-xl border-t border-white/5 z-50 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
      {/* Bottom background filler to prevent gaps during scroll jitters */}
      <div className="absolute inset-x-0 top-full h-20 bg-slate-950/90" aria-hidden="true" />
      {navItems.map((item, index) => {
        const Icon = item.icon;

        // Insert FAB in the middle
        if (index === 2) {
          return (
            <React.Fragment key="fab">
              <div className="relative -top-6">
                <button
                  onClick={() => navigate('/add-transaction')}
                  className="size-16 rounded-2xl bg-primary text-background-dark shadow-[0_8px_30px_rgb(0,230,203,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  <Plus className="size-8" strokeWidth={3} />
                </button>
              </div>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center transition-transform duration-150 ${isActive
                    ? 'text-primary scale-110'
                    : 'text-slate-500 opacity-60 hover:text-primary/80 active:scale-90'
                  }`
                }
              >
                <Icon className="size-6" strokeWidth={2} />
                <span className="font-manrope antialiased text-[10px] uppercase tracking-widest font-semibold mt-1">
                  {item.label}
                </span>
              </NavLink>
            </React.Fragment>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-transform duration-150 ${isActive
                ? 'text-primary scale-110'
                : 'text-slate-500 opacity-60 hover:text-primary/80 active:scale-90'
              }`
            }
          >
            <Icon className="size-6" strokeWidth={2} />
            <span className="font-manrope antialiased text-[10px] uppercase tracking-widest font-semibold mt-1">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
