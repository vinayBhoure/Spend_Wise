import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthLoading } from '../../store/slices/authSlice';
import { useProfile } from '../../hooks/useProfile';

export const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const authLoading = useSelector(selectAuthLoading);
  const { data: profile, loading: profileLoading, isOnboarded } = useProfile(true);

  // 1. Show spinner while checking auth session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Checking your session...</p>
      </div>
    );
  }

  // 2. If user is NOT authenticated, redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. If user IS authenticated but email is NOT verified, redirect to /otp
  if (!user.email_confirmed_at) {
    return <Navigate to="/otp" replace />;
  }

  // 4. Show spinner while loading profile data
  if (profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  // 5. If profile loaded and user has NOT completed onboarding, redirect to setup
  if (profile && isOnboarded === false) {
    return <Navigate to="/setup-currency" replace />;
  }

  // 6. User is authenticated, verified, and onboarded — show children
  return <Outlet />;
};
