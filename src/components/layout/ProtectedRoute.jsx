import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthLoading } from '../../store/slices/authSlice';

export const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Checking your session...</p>
      </div>
    );
  }

  // 1. If user is NOT authenticated, redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. If user IS authenticated but email is NOT verified, redirect to /otp
  // Supabase stores this in user.email_confirmed_at
  if (!user.email_confirmed_at) {
    return <Navigate to="/otp" replace />;
  }

  // 3. User is authenticated and verified, show children
  return <Outlet />;
};
