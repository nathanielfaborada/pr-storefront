import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';
import { PRMonogramLogo } from '../../components/common/PRMonogramLogo.tsx';

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
      setError('Google Sign-In failed. Please try again.');
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
      setError('Facebook Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(adminPasscode)) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid Admin Security Passcode.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-mono">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Monogram Emblem */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <PRMonogramLogo size="lg" showSubtitle={true} />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold text-zinc-950">
              {isAdminMode ? 'Seller Studio Login' : 'Customer Vault Access'}
            </h1>
            <p className="text-xs text-zinc-500">
              {isAdminMode
                ? 'Authorized curator access for inventory & drops'
                : '1-Click sign-in to reserve 1-of-1 pieces & track J&T parcels'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {!isAdminMode ? (
          <>
            {/* Social Logins */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogle}
                className="w-full py-3 px-4 rounded-xl border border-zinc-300 hover:border-zinc-950 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-900 flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                disabled={isLoading}
                onClick={handleFacebook}
                className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-xs font-bold text-white flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Shopper Benefits */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Vault Member Privileges:
              </span>
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>15-minute uninterrupted drop bag hold</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct J&amp;T waybill parcel tracking</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className="text-[11px] text-zinc-400 hover:text-zinc-900 font-semibold transition-colors"
              >
                P&amp;R Studio Curator Login →
              </button>
            </div>
          </>
        ) : (
          /* Admin Passcode Form */
          <form onSubmit={handleAdminPasscode} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Curator Passcode (Default: <code className="text-amber-700">admin123</code>)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={e => setAdminPasscode(e.target.value)}
                  placeholder="Enter studio key..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black font-mono shadow-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full py-2.5 font-bold shadow-md flex items-center justify-center gap-2"
            >
              <span>Unlock Seller Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="w-full text-center text-[11px] text-zinc-500 hover:text-black font-medium mt-2"
            >
              ← Back to Customer Login
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span>P&amp;R Studio v2.4</span>
        </div>

      </div>
    </div>
  );
};
