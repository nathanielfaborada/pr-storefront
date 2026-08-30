import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';

export const AdminLoginPage: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAsAdmin(passcode);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid curator vault passcode. (Hint: admin123 or pr2026)');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-mono">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-heading text-xl font-bold text-zinc-950 tracking-tight">
            Vault Curator Portal
          </h2>
          <p className="text-xs text-zinc-500">
            Enter administrative passcode to access 1-of-1 drop locks &amp; waybill manifests.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Curator Passcode *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter security passcode..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black font-mono shadow-sm"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth className="shadow-sm font-bold">
            <span>Unlock Vault Console</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-zinc-500 hover:text-zinc-950 font-semibold transition-colors"
          >
            ← Return to Public Storefront
          </button>
        </div>

      </div>
    </div>
  );
};
