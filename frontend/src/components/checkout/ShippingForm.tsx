import React, { useEffect } from 'react';
import { ShippingAddress } from '../../types/index.ts';
import { MapPin, Phone, User, Building, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface ShippingFormProps {
  address: ShippingAddress;
  onChange: (updated: Partial<ShippingAddress>) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ address, onChange }) => {
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();

  // Auto-fill recipient name if user signs in
  useEffect(() => {
    if (user && !address.fullName) {
      onChange({ fullName: user.name });
    }
  }, [user, address.fullName, onChange]);

  return (
    <div className="space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <h3 className="font-heading font-bold text-sm text-zinc-950">
            1. Philippine Courier Delivery Address
          </h3>
        </div>
      </div>

      {/* Social Identity Verification Banner */}
      {isAuthenticated && user ? (
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-emerald-900">
              Verified Shopper: <strong className="font-bold">{user.name}</strong> ({user.provider})
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
            Anti-Fraud Pass
          </span>
        </div>
      ) : (
        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-zinc-600">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sign in with Google/Facebook for 1-click address auto-fill</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-semibold shrink-0 transition-colors shadow-sm text-center"
          >
            Sign In with Google / FB
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Recipient Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              required
              value={address.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Nathaniel Faborada"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Mobile Number (GCash/SMS Updates) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="tel"
              required
              value={address.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              placeholder="0917-123-4567"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Region Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Region *
          </label>
          <select
            value={address.region}
            onChange={(e) => onChange({ region: e.target.value as any })}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-black transition-all font-mono cursor-pointer"
          >
            <option value="Metro Manila">Metro Manila (Same-Day / ₱99)</option>
            <option value="Luzon">Luzon Provincial (₱160)</option>
            <option value="Visayas">Visayas (₱160)</option>
            <option value="Mindanao">Mindanao (₱160)</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            City / Municipality *
          </label>
          <input
            type="text"
            required
            value={address.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g. Quezon City"
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
          />
        </div>

        {/* Barangay */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Barangay *
          </label>
          <input
            type="text"
            required
            value={address.barangay}
            onChange={(e) => onChange({ barangay: e.target.value })}
            placeholder="e.g. Brgy. Sacred Heart"
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
          />
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
          Detailed House/Unit #, Street Address *
        </label>
        <input
          type="text"
          required
          value={address.streetAddress}
          onChange={(e) => onChange({ streetAddress: e.target.value })}
          placeholder="Unit 402, Building A, Scout Chuatoco St."
          className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
        />
      </div>

      {/* Landmark Notes */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
          Delivery Landmark / Special Courier Notes (Optional)
        </label>
        <div className="relative">
          <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={address.landmarkNotes || ''}
            onChange={(e) => onChange({ landmarkNotes: e.target.value })}
            placeholder="Near 7-Eleven, beside Gate 2 guardhouse"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
};
