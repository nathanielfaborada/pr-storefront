import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  CheckCircle2,
  Building2,
  Truck,
  Clock,
  QrCode,
  Save,
  Check
} from 'lucide-react';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Nathaniel Faborada',
    email: user?.email || 'nathaniel.faborada@gmail.com',
    role: 'Lead Curator & Archival Director',
    phone: '0917-884-9124',
    studioHub: 'Pandi, Bulacan Archival Studio & QC Fulfillment',
    storeName: 'P&R Thrift & Style Studio',
    gcashNumber: '0917-884-9124',
    gcashName: 'NATHANIEL F.',
    defaultCourier: 'J&T Express Philippines (Bulacan Hub)',
    holdDurationMinutes: 15,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-zinc-950">
              Admin Profile &amp; Studio Settings
            </h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Curator credentials &amp; merchant configuration
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-4 font-mono text-xs text-zinc-950 max-h-[75vh] overflow-y-auto pr-1">
        
        {/* 1. Profile Identity Header Card */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-1.5 bg-zinc-950 text-white rounded-lg hover:bg-orange-500 transition-colors shadow-xs"
              title="Change Profile Avatar"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-heading font-bold text-sm text-zinc-950">
                {formData.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified Admin</span>
              </span>
            </div>

            <p className="text-zinc-500 text-[11px] mt-0.5">{formData.role}</p>
            <p className="text-zinc-400 text-[10px] mt-0.5 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate">{formData.studioHub}</span>
            </p>
          </div>
        </div>

        {/* 2. Personal & Contact Information */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100 text-zinc-950 font-heading font-bold text-xs">
            <User className="w-4 h-4 text-orange-600" />
            <span>Personal &amp; Contact Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
                />
                <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Mobile Number (PH)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
                />
                <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Merchant & Storefront Configurations */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100 text-zinc-950 font-heading font-bold text-xs">
            <Building2 className="w-4 h-4 text-orange-600" />
            <span>Store &amp; Payment Settlement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Default Courier Partner
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.defaultCourier}
                  onChange={e => setFormData({ ...formData, defaultCourier: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
                />
                <Truck className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                GCash Merchant Account
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.gcashNumber}
                  onChange={e => setFormData({ ...formData, gcashNumber: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
                />
                <QrCode className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Cart Hold Duration (Minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={formData.holdDurationMinutes}
                  onChange={e => setFormData({ ...formData, holdDurationMinutes: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
                />
                <Clock className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Security & Permissions Badge */}
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-[11px] text-zinc-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Master Admin Level: Full Curation &amp; Dispatch Access</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-500">2FA Active</span>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="px-5 py-2 text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
