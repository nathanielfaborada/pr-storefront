import React from 'react';
import { ShippingAddress } from '../../types/index.ts';
import { MapPin, Phone, User, Building, ShieldCheck } from 'lucide-react';

interface ShippingFormProps {
  address: ShippingAddress;
  onChange: (updated: Partial<ShippingAddress>) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ address, onChange }) => {
  return (
    <div className="space-y-3.5 font-mono text-zinc-950">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
          <h3 className="font-heading font-bold text-xs sm:text-sm text-zinc-950">
            1. Philippine Courier Delivery Address
          </h3>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold hidden sm:inline">
          J&amp;T Express / LBC
        </span>
      </div>

      {/* Recipient & Phone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Recipient Full Name *
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              required
              value={address.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Nathaniel Faborada"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-all font-mono"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Mobile Number (GCash/SMS Updates) *
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="tel"
              required
              value={address.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              placeholder="0917-123-4567"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Region, City & Barangay */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Region */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Region *
          </label>
          <select
            value={address.region}
            onChange={(e) => onChange({ region: e.target.value as any })}
            className="w-full px-2.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 transition-all font-mono cursor-pointer"
          >
            <option value="Metro Manila">Metro Manila (Free / ₱0)</option>
            <option value="Luzon">Luzon Provincial (Free / ₱0)</option>
            <option value="Visayas">Visayas (Free / ₱0)</option>
            <option value="Mindanao">Mindanao (Free / ₱0)</option>
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
            className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-all font-mono"
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
            placeholder="e.g. Brgy. Central"
            className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-all font-mono"
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
          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-all font-mono"
        />
      </div>

      {/* Landmark Notes */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
          Delivery Landmark / Special Courier Notes (Optional)
        </label>
        <div className="relative">
          <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={address.landmarkNotes || ''}
            onChange={(e) => onChange({ landmarkNotes: e.target.value })}
            placeholder="Near 7-Eleven, beside Gate 2 guardhouse"
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
