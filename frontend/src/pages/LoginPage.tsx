import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithFacebook, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleGoogle = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      setError('Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebook = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithFacebook();
      navigate(from, { replace: true });
    } catch {
      setError('Facebook Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = loginAsAdmin(adminPasscode);
    if (ok) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid curator passcode. (Hint: admin123 or pr2026)');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-mono">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto text-sm font-heading font-extrabold shadow-sm">
            P&amp;R
          </div>
          <h1 className="font-heading text-2xl font-bold text-zinc-950 tracking-tight">
            {isAdminMode ? 'Vault Curator Console' : activeTab === 'signin' ? 'Sign In to P&R' : 'Create P&R Account'}
          </h1>
          <p className="text-xs text-zinc-500">
            {isAdminMode
              ? 'Enter curator staff security passcode'
              : 'Sign in with Google or Facebook for 1-click drop checkout'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
            {error}
          </div>
        )}

        {!isAdminMode ? (
          <>
            {/* Tabs */}
            <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'signin'
                    ? 'bg-white text-zinc-950 shadow-sm font-bold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white text-zinc-950 shadow-sm font-bold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Social OAuth Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-sans font-semibold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </button>

              <button
                type="button"
                onClick={handleFacebook}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-sans font-semibold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="pt-2 text-center text-[10px] text-zinc-500 space-y-1">
              <div className="flex items-center justify-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Anti-Fraud Social Authentication</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-center">
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className="text-[11px] text-zinc-500 hover:text-zinc-900 font-mono transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Curator Staff Login</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleAdmin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Vault Passcode *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black font-mono shadow-sm"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth className="shadow-sm font-bold">
              <span>Unlock Console</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="text-xs text-zinc-500 hover:text-black font-semibold transition-colors"
              >
                ← Back to Social Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
