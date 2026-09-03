import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { ShieldCheck, Lock, ArrowRight, Zap, Key } from 'lucide-react';
import { PRMonogramLogo } from '../../components/common/PRMonogramLogo.tsx';

export const AdminLoginPage: React.FC = () => {
  const [passcode, setPasscode] = useState('admin123');
  const [error, setError] = useState('');

  const { loginAsAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the studio passcode.');
      return;
    }

    if (loginAsAdmin(passcode)) {
      toast.success('Curator access verified. Welcome to P&R Seller Studio!', 'Access Granted');
      navigate(from, { replace: true });
    } else {
      setError('Invalid Admin Security Passcode. Default key is admin123.');
    }
  };

  const handleQuickLogin = () => {
    setPasscode('admin123');
    if (loginAsAdmin('admin123')) {
      toast.success('Curator access verified. Welcome to P&R Seller Studio!', 'Access Granted');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-zinc-100/70 font-mono text-zinc-950 select-none">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Non-Scrollable Login Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        
        {/* Monogram & Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <PRMonogramLogo size="md" showSubtitle={false} />
          </div>
          <div>
            <h1 className="font-heading text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
              Seller Studio Portal
            </h1>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              P&amp;R Archival Studio · Pandi Hub Curator Access
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center animate-in fade-in">
            {error}
          </div>
        )}

        {/* Primary Passcode Form */}
        <form onSubmit={handlePasscodeSubmit} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                Admin Passcode (Default: <code className="text-orange-700 font-bold">admin123</code>)
              </label>
              <button
                type="button"
                onClick={() => setPasscode('admin123')}
                className="text-[10px] text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
              >
                Insert Key
              </button>
            </div>

            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                autoFocus
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter admin123..."
                className="w-full pl-8 pr-3 h-10 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 font-mono shadow-2xs font-bold"
              />
            </div>
          </div>

          {/* Unlock Button */}
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-orange-400" />
            <span>Unlock Seller Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* 1-Click Fast Passcode Demo Button */}
          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full h-8.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-950 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer shadow-2xs"
          >
            <Zap className="w-3 h-3 text-orange-600" />
            <span>⚡ 1-Click Instant Curator Login</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative py-0.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-wider">
            <span className="bg-white px-2 text-zinc-400 font-bold">Social OAuth</span>
          </div>
        </div>

        {/* Locked Social Sign-In Buttons */}
        <div className="space-y-1.5">
          <button
            type="button"
            disabled
            title="OAuth integration is currently locked during development"
            className="w-full h-9 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-400 flex items-center justify-between transition-all opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 grayscale opacity-60" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-200/60 px-1.5 py-0.2 rounded flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Locked</span>
            </span>
          </button>

          <button
            type="button"
            disabled
            title="OAuth integration is currently locked during development"
            className="w-full h-9 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-400 flex items-center justify-between transition-all opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 fill-zinc-400" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-200/60 px-1.5 py-0.2 rounded flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Locked</span>
            </span>
          </button>
        </div>

        {/* Security Notice & Return to Storefront */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-zinc-950 transition-colors font-bold cursor-pointer"
          >
            ← Return to Storefront
          </button>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            256-Bit Encrypted
          </span>
        </div>

      </div>

    </div>
  );
};

export default AdminLoginPage;
