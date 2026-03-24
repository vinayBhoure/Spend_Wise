import React from 'react';
import { BarChart3 } from 'lucide-react';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-sm aspect-square mb-12 flex items-center justify-center">
      {/* Abstract Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-30"></div>
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Central Geometric Prism */}
        <div className="absolute w-52 h-52 border border-primary/20 rounded-2xl rotate-12"></div>
        <div className="absolute w-48 h-48 bg-gradient-to-br from-primary/40 via-primary/10 to-transparent rounded-2xl rotate-45 backdrop-blur-md shadow-2xl shadow-primary/20 border border-primary/30"></div>
        {/* Emerald Zenith Core Icon */}
        <div className="relative z-10 text-primary">
          <BarChart3 size={64} strokeWidth={1.5} />
        </div>
        {/* High Performance Accents */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(0,230,203,1)]"></div>
        <div className="absolute bottom-6 left-2 w-16 h-1 bg-primary/40 rounded-full blur-[1px]"></div>
      </div>
    </div>
  );
};
