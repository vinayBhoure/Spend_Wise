import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  KeyRound,
  Star,
  Bell,
  Trash2,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { BottomNav } from '../components/layout/BottomNav';
import { PageHeader } from '../components/layout/PageHeader';
import { Toggle } from '../components/ui/Toggle';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, loading, error } = useProfile(true);

  const [pushNotifications, setPushNotifications] = React.useState(true);

  // Loading
  if (loading && !profile && !user) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase">Loading Profile</p>
      </div>
    );
  }

  // Error
  if (error && !user) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6">
        <AlertCircle className="size-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-100">Something went wrong</h2>
        <p className="text-slate-400 text-center text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-background-dark font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.username || user?.user_metadata?.full_name || 'SpendWise User';
  const displayEmail = user?.email || 'N/A';
  const avatarUrl = profile?.avatar_url || null;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-dark font-manrope antialiased">
      <PageHeader 
        title="Profile"
        showBack={true}
        onBack={() => navigate('/settings')}
        rightElement={
          <div className="text-primary font-bold text-xl tracking-tight pr-2">SpendWise</div>
        }
      />

      {/* Main Content */}
      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-2 border-primary/20 p-1 bg-card-dark overflow-hidden">
              {avatarUrl ? (
                <div
                  className="w-full h-full rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                  role="img"
                  aria-label={displayName}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="absolute bottom-0 right-0 bg-primary text-background-dark p-2 rounded-full shadow-lg shadow-primary/20 active:scale-90 transition-transform"
              aria-label="Edit profile photo"
            >
              <User className="size-4" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-[28px] font-bold tracking-tight text-slate-100 mb-1">{displayName}</h2>
            <p className="text-slate-400 font-medium text-sm">{displayEmail}</p>
          </div>
          {/* Current Plan Badge */}
          <div className="mt-6">
            <div className="bg-card-dark px-4 py-2 rounded-lg border border-primary/20 flex items-center gap-2">
              <Star className="size-4 text-primary" fill="currentColor" />
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary">
                SpendWise Free
              </span>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-2 mb-2">
            Account Settings
          </h3>
          <div className="bg-card-dark rounded-xl overflow-hidden border border-white/5">
            {/* Edit Profile */}
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <User className="size-5" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-100">Edit Profile</p>
                  <p className="text-xs text-slate-500">Update your personal details</p>
                </div>
              </div>
              <ChevronLeft className="size-5 text-slate-500 rotate-180 group-hover:text-primary transition-colors" />
            </button>
            <div className="h-px bg-white/5 ml-16" />
            {/* Change Password */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <KeyRound className="size-5" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-100">Change Password</p>
                  <p className="text-xs text-slate-500">Keep your account secure</p>
                </div>
              </div>
              <ChevronLeft className="size-5 text-slate-500 rotate-180 group-hover:text-primary transition-colors" />
            </button>
            <div className="h-px bg-white/5 ml-16" />
            {/* Current Plan */}
            <button
              onClick={() => navigate('/plans')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Star className="size-5" strokeWidth={2} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-100">Current Plan</p>
                  <p className="text-xs text-primary font-bold">Free Member</p>
                </div>
              </div>
              <ChevronLeft className="size-5 text-slate-500 rotate-180 group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Notifications & Privacy */}
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-2 mt-8 mb-2">
            Notifications &amp; Privacy
          </h3>
          <div className="bg-card-dark rounded-xl overflow-hidden border border-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                  <Bell className="size-5" strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-slate-100">Push Notifications</p>
              </div>
              <Toggle checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
            </div>
          </div>

          {/* Danger Zone */}
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-destructive/60 ml-2 mt-8 mb-2">
            Danger Zone
          </h3>
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl overflow-hidden p-1">
            <button
              onClick={() => navigate('/delete-confirmation?type=user')}
              className="w-full flex items-center justify-between p-3 hover:bg-destructive/10 transition-colors rounded-lg group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                  <Trash2 className="size-5" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-destructive">Delete Account</p>
              </div>
              <AlertTriangle className="size-5 text-destructive/40 group-hover:text-destructive" />
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
