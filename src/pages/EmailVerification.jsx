import React, { useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logoutUserThunk, checkSession } from '../store/slices/authSlice';

export default function EmailVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // If user is already verified or session updated, take them to dashboard
  useEffect(() => {
    if (user?.email_confirmed_at) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleResend = async () => {
    // Manually re-check session to see if they confirmed
    await dispatch(checkSession());
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    navigate('/auth');
  };

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col items-center justify-center font-body antialiased p-6 relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-[-1]"></div>
      <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30 z-[-1]"></div>

      <div className="w-full max-w-[430px] flex flex-col items-center text-center space-y-4">

        {/* Icon */}
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center ring-1 ring-primary/20 scale-110 mb-2">
          <Mail className="text-primary" size={40} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-white px-4 leading-tight">Check your email</h1>
          <p className="text-slate-400 font-medium px-2">
            We've sent a verification link to <br />
            <span className="text-white font-bold">{user?.email || 'your email'}</span>.
            <br />Please verify to continue.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4 pt-4">
          <button
            onClick={handleResend}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#00d1b8] text-background-dark font-bold py-3 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
          >
            <RefreshCw size={18} />
            I've confirmed my email
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl border border-white/10 transition-all"
          >
            <LogOut size={18} />
            Log out & try another email
          </button>
        </div>

        <button
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>

      </div>
    </div>
  );
}
