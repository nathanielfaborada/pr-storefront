import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { PRMonogramLogo } from '../../components/common/PRMonogramLogo.tsx';

export const AdminUnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex items-center justify-center p-4 bg-zinc-100/80 font-mono text-zinc-950 select-none z-50">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Alert Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
        
        {/* Monogram */}
        <div className="flex justify-center">
          <PRMonogramLogo size="md" showSubtitle={false} />
        </div>

        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3" />
            <span>403 Forbidden · Restricted Area</span>
          </span>

          <h1 className="font-heading text-2xl font-extrabold text-zinc-950 tracking-tight pt-1">
            You Are Not Allowed
          </h1>

          <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mx-auto pt-1">
            The Seller Studio &amp; Dispatch Vault is strictly restricted to authorized P&amp;R studio curators and logistics staff.
          </p>
        </div>

        {/* Route Info Badge */}
        <div className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-200 text-left text-[11px] space-y-0.5 font-mono">
          <span className="text-[9px] text-zinc-400 uppercase font-bold block">Attempted Route:</span>
          <p className="text-zinc-800 font-bold truncate">
            {location.pathname || '/admin'}
          </p>
        </div>

        {/* Action Button: Return to Public Storefront Only */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full h-11 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold transition-all shadow-md text-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Storefront</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdminUnauthorizedPage;
