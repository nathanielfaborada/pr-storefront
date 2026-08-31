import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';
import { PRMonogramLogo } from '../../components/common/PRMonogramLogo.tsx';

export const AdminLoginPage: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isPasscodeMode, setIsPasscodeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdminWithGoogle, loginAdminWithFacebook, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleGoogleAdmin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginAdminWithGoogle();
      navigate(from, { replace: true });
    } catch {
      setError('Google Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookAdmin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginAdminWithFacebook();
      navigate(from, { replace: true });
    } catch {
      setError('Facebook Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(passcode)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid Admin Security Passcode. Access restricted to authorized P&R staff.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-mono">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Amber Glow Pill */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Monogram & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <PRMonogramLogo size="lg" showSubtitle={true} />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold text-zinc-950">Seller Studio Portal</h1>
            <p className="text-xs text-zinc-500">
              P&amp;R Thrift &amp; Style Official Curator Access (Pandi, Bulacan)
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 1-Click Social Sign-In (Recommended) */}
        {!isPasscodeMode ? (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAdmin}
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
              <span>Continue with Google (Curator Login)</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleFacebookAdmin}
              className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-xs font-bold text-white flex items-center justify-center gap-3 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook (P&amp;R Page Admin)</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-zinc-400 font-bold">Or fallback</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPasscodeMode(true)}
              className="w-full py-2 text-center text-xs text-zinc-500 hover:text-black font-semibold"
            >
              Use Manual Passcode / Demo Key
            </button>
          </div>
        ) : (
          /* Manual Passcode Fallback */
          <form onSubmit={handlePasscodeSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Admin Passcode (Default: <code className="text-amber-700">admin123</code>)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Enter studio master key..."
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
              onClick={() => setIsPasscodeMode(false)}
              className="w-full text-center text-[11px] text-zinc-500 hover:text-black font-medium mt-2"
            >
              ← Back to Google / Facebook Sign-In
            </button>
          </form>
        )}

        {/* Security Notice & Store Link */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-zinc-900 transition-colors font-bold"
          >
            ← Return to Storefront
          </button>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit Encrypted
          </span>
        </div>

      </div>
    </div>
  );
};
