import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { PRMonogramLogo } from '../common/PRMonogramLogo.tsx';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithFacebook, loginAsAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch {
      setError('Google OAuth verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithFacebook();
    } catch {
      setError('Facebook OAuth verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAsAdmin(adminPasscode);
    if (!success) {
      setError('Invalid curator passcode. (Hint: admin123 or pr2026)');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => {
        setIsAuthModalOpen(false);
        setIsAdminMode(false);
        setError('');
      }}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2.5">
          <PRMonogramLogo size="sm" showSubtitle={false} />
          <span className="font-heading font-bold text-base text-zinc-950">
            {isAdminMode ? 'Curator Vault Access' : activeTab === 'signin' ? 'Welcome Back to P&R' : 'Create P&R Account'}
          </span>
        </div>
      }
    >
      <div className="space-y-5 font-mono">
        
        {/* Anti-Joy Miner Trust Banner */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-zinc-600">
            <strong className="text-zinc-950 font-bold block">Verified Streetwear Member Pass:</strong>
            Connect via Google or Facebook for instant 1-click checkout, 15-minute drop holds, and fraud-free COD privileges.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
            {error}
          </div>
        )}

        {!isAdminMode ? (
          <>
            {/* Sign In vs Sign Up Tabs */}
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
            <div className="space-y-2.5 pt-1">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-sans font-semibold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {/* Official Google Icon SVG */}
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

              {/* Facebook OAuth Button */}
              <button
                type="button"
                onClick={handleFacebookAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-sans font-semibold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {/* Official Facebook Icon SVG */}
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Privacy & Fast Handshake Guarantee */}
            <div className="pt-2 text-center text-[10px] text-zinc-500 space-y-1">
              <p>By continuing, you agree to P&amp;R Curated 1-of-1 Drop Policies.</p>
              <div className="flex items-center justify-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero spam · Verified social identity protection</span>
              </div>
            </div>

            {/* Admin Switcher */}
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
          /* Staff / Admin Login Passcode View */
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Vault Curator Passcode *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter vault passcode..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black font-mono shadow-sm"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth className="shadow-sm font-bold">
              <span>Unlock Curator Console</span>
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
    </Modal>
  );
};
