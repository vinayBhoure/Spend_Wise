import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPasswordThunk } from '../store/slices/authSlice';
import { Input } from '../components/ui/Input';
import { toast } from 'react-toastify';
import { PageHeader } from '../components/layout/PageHeader';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const emailValue = watch('email');
  const isDisabled = !emailValue || loading;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(resetPasswordThunk(data.email)).unwrap();
      toast.success('Reset link sent to your mail');
    } catch (error) {
      toast.error(error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col items-center justify-start font-body antialiased relative">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col px-5 py-12 relative overflow-hidden z-10">
        
        <PageHeader 
          title=""
          showBack={true}
          onBack={() => navigate('/auth')}
        />

        {/* Title */}
        <div className="flex flex-col mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <KeyRound className="text-primary w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Forgot Password</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <Input
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="johndoe@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-primary hover:bg-[#00d1b8] text-background-dark font-bold py-3 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] mt-6 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Confirm Mail'
            )}
          </button>
        </form>

        {/* Decorative elements */}
        <div className="fixed top-[-10%] right-[-20%] w-[70%] h-[70%] bg-primary/10 blur-[130px] rounded-full pointer-events-none opacity-40 z-[-1]"></div>
      </div>
    </div>
  );
}
