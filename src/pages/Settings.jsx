import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import {
  ChevronLeft,
  CircleDollarSign,
  Tags,
  Landmark,
  Zap,
  Moon,
  Vibrate,
  ScanFace,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUserThunk } from '../store/slices/authSlice';
import { BottomNav } from '../components/layout/BottomNav';
import { Toggle } from '../components/ui/Toggle';
import { SettingRow } from '../components/settings/SettingRow';
import { SettingGroup } from '../components/settings/SettingGroup';
import { PageHeader } from '../components/layout/PageHeader';
import { ProfileHeader } from '../components/settings/ProfileHeader';
import { CurrencyDropdown } from '../components/settings/CurrencyDropdown';

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Auto-fetch profile data implicitly
  const { data: profileTemplate, loading: profileLoading, error: profileError, updateCurrency, currencyUpdating } = useProfile(true);

  // Local state for the UI toggles
  const [toggles, setToggles] = useState({
    quickLogging: true,
    darkMode: true,
    hapticFeedback: true,
    biometricUnlock: false
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    navigate('/auth');
  };

  const handleCurrencyChange = async (currency) => {
    try {
      await updateCurrency(currency);
    } catch {
      // Error is handled in the slice
    }
  };

  // Explicit Loading State
  if (profileLoading && !profileTemplate && !user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-5">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wider uppercase">Loading Settings</p>
      </div>
    );
  }

  // Explicit Error State
  if (profileError && !user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-5">
        <AlertCircle className="size-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6">{profileError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-background-dark font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Derive display values preferring profile over auth user metadata if available
  const displayName = profileTemplate?.full_name || profileTemplate?.username || user?.user_metadata?.username || 'SpendWise User';
  const displayEmail = user?.email || 'N/A';
  const avatarUrl = profileTemplate?.avatar_url || null;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-light dark:bg-background-dark font-manrope antialiased pb-32">
      <PageHeader
        title="Settings"
        showBack={true}
        onBack={() => navigate('/dashboard')}
      />

      {/* Main scrollable content */}
      <main className="flex-1 px-6">

        <ProfileHeader
          name={displayName}
          email={displayEmail}
          avatarUrl={avatarUrl}
          isPro={true}
          onClick={() => navigate('/profile')}
        />

        <SettingGroup title="Financial Configuration">
          <SettingRow
            icon={CircleDollarSign}
            title="Currency"
            rightElement={
              <CurrencyDropdown
                value={profileTemplate?.currency || 'INR'}
                onChange={handleCurrencyChange}
                updating={currencyUpdating}
              />
            }
            showChevron={false}
          />
          <SettingRow
            icon={Tags}
            title="Manage Categories"
            showChevron={true}
            onClick={() => navigate('/manage-categories')}
          />
          <SettingRow
            icon={Landmark}
            title="Linked Accounts"
            rightElement={
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                3 Active
              </span>
            }
            showChevron={true}
            onClick={() => navigate('/accounts')}
          />
        </SettingGroup>

        <SettingGroup title="App Experience">
          {/* <SettingRow
            icon={Zap}
            title="Quick Logging"
            subtitle={toggles.quickLogging ? 'Frictionless entry enabled' : 'Require full details'}
            rightElement={<Toggle checked={toggles.quickLogging} onChange={() => handleToggle('quickLogging')} />}
            showChevron={false}
          /> */}
          <SettingRow
            icon={Moon}
            title="Dark Mode"
            subtitle={toggles.darkMode ? 'Enhanced contrast active' : 'Light theme active'}
            rightElement={<Toggle checked={toggles.darkMode} onChange={() => handleToggle('darkMode')} />}
            showChevron={false}
          />
          {/* <SettingRow
            icon={Vibrate}
            title="Haptic Feedback"
            rightElement={<Toggle checked={toggles.hapticFeedback} onChange={() => handleToggle('hapticFeedback')} />}
            showChevron={false}
          /> */}
          {/* <SettingRow
            icon={ScanFace}
            title="Biometric Unlock"
            rightElement={<Toggle checked={toggles.biometricUnlock} onChange={() => handleToggle('biometricUnlock')} />}
            showChevron={false}
          /> */}
        </SettingGroup>

        <div className="mt-16 px-2 mb-6">
          <button
            onClick={handleLogout}
            className="w-full h-14 text-rose-500 font-extrabold text-sm bg-rose-500/10 rounded-2xl border border-rose-500/20 active:scale-[0.97] transition-all uppercase tracking-[0.15em] shadow-[0_4px_15px_rgba(255,90,126,0.1)]"
          >
            Log Out of SpendWise
          </button>

          <p className="text-center text-slate-600 text-[9px] font-bold uppercase tracking-[.3em] mt-12 opacity-50">
            SpendWise Version 2.4.0 (Build 4482)
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
