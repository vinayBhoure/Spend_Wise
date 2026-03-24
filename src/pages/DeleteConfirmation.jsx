import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';

export default function DeleteConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { deleteAccountPermanently } = useAccounts();
  const { deleteAccount } = useProfile();

  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'account';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEmailMatch = email.toLowerCase() === user?.email?.toLowerCase();

  const isUserDeletion = type === 'user';

  const handleDelete = async () => {
    if (!isEmailMatch) {
      setError('Email address does not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isUserDeletion) {
        // Delete all user data and sign out
        await deleteAccount();
        await supabase.auth.signOut();
        navigate('/auth');
      } else if (type === 'account') {
        await deleteAccountPermanently(id);
        navigate('/accounts');
      } else {
        setError('Unsupported deletion type');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center p-4 font-manrope antialiased">
      {/* Bottom sheet card */}
      <div className="w-full max-w-[400px] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 pt-8 pb-10">
          {/* Icon Accent */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="size-10 text-rose-500" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-slate-100 text-2xl font-extrabold tracking-tight">
              {isUserDeletion ? 'Delete Your Account?' : 'Delete Account?'}
            </h3>
            <p className="text-slate-400 text-base font-medium leading-relaxed max-w-[300px] mx-auto">
              {isUserDeletion
                ? 'This action is permanent. All your data, transactions, accounts, and categories will be permanently deleted.'
                : 'This action is permanent. All transactions associated with this account will be lost forever.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="space-y-2 mb-2 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Confirm your email address
              </label>
              <input
                className="w-full h-14 px-4 bg-white/5 rounded-xl border border-white/10 text-slate-100 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-slate-600 transition-all text-base"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-rose-500 text-xs font-semibold ml-1">{error}</p>}
            </div>

            <button
              onClick={handleDelete}
              disabled={loading || !isEmailMatch}
              className="flex items-center justify-center rounded-xl h-14 px-5 bg-rose-500 hover:bg-rose-600 text-white text-lg font-bold tracking-wide w-full transition-all shadow-lg shadow-rose-500/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <span>{isUserDeletion ? 'Delete My Account' : 'Delete Permanently'}</span>
              )}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-transparent hover:bg-white/5 transition-colors text-slate-400 text-base font-semibold tracking-wide w-full active:scale-[0.98]"
            >
              <span>{isUserDeletion ? 'Keep My Account' : 'Keep Account'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
