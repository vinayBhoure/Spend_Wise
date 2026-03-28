import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { PlanCard } from '../components/profile/PlanCard';
import { PageHeader } from '../components/layout/PageHeader';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free forever',
    features: [
      'Track unlimited transactions',
      'Up to 3 accounts',
      'Monthly spending insights',
      'Basic category management',
    ],
    showUpgradeBadge: false,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '₹99 / month',
    features: [
      'Everything in Free',
      'Unlimited accounts',
      'Advanced statistics & charts',
      'Export data to CSV',
      'Custom categories with icons',
    ],
    showUpgradeBadge: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199 / month',
    features: [
      'Everything in Plus',
      'Multi-currency support',
      'Budget goals & alerts',
      'Priority support',
      'Cloud sync across devices',
      'Ad-free experience',
    ],
    showUpgradeBadge: false,
  },
];

const CURRENT_PLAN = 'free';

export default function Plans() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(CURRENT_PLAN);

  const showUpgradeButton = selected !== CURRENT_PLAN;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-dark font-manrope antialiased">
      <PageHeader 
        title="Plans"
        showBack={true}
        onBack={() => navigate('/profile')}
      />

      {/* Main Content */}
      <main className="flex-1 px-6 pt-6 pb-32 overflow-y-auto space-y-4">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Choose your plan</h2>
          <p className="text-slate-400 text-sm mt-1">Unlock premium features to supercharge your finances.</p>
        </div>

        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            isSelected={selected === plan.id}
            isCurrent={plan.id === CURRENT_PLAN}
            showUpgradeBadge={plan.showUpgradeBadge}
            onSelect={() => setSelected(plan.id)}
          />
        ))}
      </main>

      {/* Sticky Upgrade Button */}
      {showUpgradeButton && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent">
          <button className="w-full h-14 rounded-2xl bg-primary text-background-dark font-bold text-base tracking-wide active:scale-[0.97] transition-all shadow-lg shadow-primary/20">
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}
