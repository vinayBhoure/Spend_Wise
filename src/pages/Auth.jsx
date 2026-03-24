import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Wallet, User as UserIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUserThunk, signupUserThunk, googleLoginThunk, selectAuthActionLoading, selectAuthError, clearAuthError } from '../store/slices/authSlice';
import { Input } from '../components/ui/Input';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { SocialButton } from '../components/ui/SocialButton';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const signupSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authActionLoading = useSelector(selectAuthActionLoading);
  const authError = useSelector(selectAuthError);

  // Clear errors and reset forms when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetLogin();
    resetSignup();
    if (authError) dispatch(clearAuthError());
  };

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    watch: watchLogin,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    reset: resetSignup,
    watch: watchSignup,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' }
  });

  const loginValues = watchLogin();
  const signupValues = watchSignup();

  const isLoginDisabled = !loginValues.email || !loginValues.password;
  const isSignupDisabled = !signupValues.username || !signupValues.email || !signupValues.password;

  const onLogin = async (data) => {
    if (authError) dispatch(clearAuthError());
    try {
      await dispatch(loginUserThunk({ email: data.email, password: data.password })).unwrap();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Login failed. Please check your credentials.');
    }
  };

  const onSignup = async (data) => {
    if (authError) dispatch(clearAuthError());
    try {
      await dispatch(signupUserThunk({ username: data.username, email: data.email, password: data.password })).unwrap();
      toast.success('Account created successfully!');
      navigate('/verify-email');
    } catch (err) {
      toast.error(err || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(googleLoginThunk()).unwrap();
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    }
  };

  const handleAppleLogin = () => {
    toast('Coming soon...', { icon: '🍎' });
  };

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col items-center justify-start font-body antialiased">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col px-8 py-16 relative overflow-hidden">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Wallet className="text-primary" size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">SpendWise</h1>
          <p className="text-slate-400 text-sm font-medium">Master your finances with ease</p>
        </div>

        {/* Segmented Control */}
        <SegmentedControl activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="h-6"></div> {/* Spacer instead of error block */}

        {/* Form Section */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-6">
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="name@example.com"
              error={loginErrors.email?.message}
              {...registerLogin('email')}
            />
            <Input
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              showForgotPassword={true}
              error={loginErrors.password?.message}
              {...registerLogin('password')}
            />
            <button
              type="submit"
              disabled={isLoginDisabled || authActionLoading}
              className="w-full bg-primary hover:bg-[#00d1b8] text-background-dark font-bold py-4 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {authActionLoading ? (
                <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-6">
            <Input
              label="Username"
              icon={UserIcon}
              type="text"
              placeholder="johndoe"
              error={signupErrors.username?.message}
              {...registerSignup('username')}
            />
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="name@example.com"
              error={signupErrors.email?.message}
              {...registerSignup('email')}
            />
            <Input
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              error={signupErrors.password?.message}
              {...registerSignup('password')}
            />
            <button
              type="submit"
              disabled={isSignupDisabled || authActionLoading}
              className="w-full bg-primary hover:bg-[#00d1b8] text-background-dark font-bold py-4 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {authActionLoading ? (
                <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="h-px bg-border-subtle flex-1"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Or continue with</span>
          <div className="h-px bg-border-subtle flex-1"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <SocialButton
            icon={<svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.87 14.13c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.97l3.69-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.84c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335"></path></svg>}
            label="Google"
            onClick={handleGoogleLogin}
          />
          <SocialButton
            icon={<svg fill="white" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.96.4-2.16.84-3.52.84-3.23 0-5.59-2.31-5.59-5.74 0-3.32 2.31-5.69 5.54-5.69 1.25 0 2.37.36 3.14.77l.21.11.83-1.63-.2-.11a5.61 5.61 0 0 0-4.04-1.14c-4.47 0-7.79 3.23-7.79 7.69 0 4.63 3.43 7.74 7.9 7.74 1.71 0 3.3-.59 4.31-1l.2-.1-.85-1.57-.14.07z"></path><path d="M12.11 6.84a3.15 3.15 0 0 1 2.27-2.67l.11-.03-.23-.84-.11.03a4.05 4.05 0 0 0-2.94 3.42l-.01.12.89.09.02-.12z"></path></svg>}
            label="Apple"
            onClick={handleAppleLogin}
          />
        </div>

        {/* Decorative background elements */}
        <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-[-1]"></div>
        <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30 z-[-1]"></div>

      </div>
    </div>
  );
}

