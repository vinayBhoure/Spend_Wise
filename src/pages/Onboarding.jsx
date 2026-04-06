import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroVisual } from '../components/ui/HeroVisual';
import { Button } from '../components/ui/Button';

export default function Onboarding() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden p-5 safe-area-inset bg-background-dark font-body text-slate-100 antialiased">

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center justify-center">
        <HeroVisual />

        {/* Typography Stack: Standardized for Design System */}
        <div className="text-center space-y-4 px-4">
          <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            See where your money <span className="text-primary">really</span> goes.
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xs mx-auto">
            Track spending in seconds. No complexity.
          </p>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="mt-auto pb-10 flex flex-col items-center gap-10 w-full">
        {/* Primary CTA: Premium Button Style */}
        <Button onClick={handleStart} className="w-full max-w-sm">
          Get Started
          <ArrowRight size={20} strokeWidth={2} />
        </Button>
      </footer>
    </div>
  );
}
