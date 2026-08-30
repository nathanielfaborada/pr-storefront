import React from 'react';
import { PaymentMethod } from '../../types/index.ts';
import { QrCode } from 'lucide-react';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selectedMethod, onChange }) => {
  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
        <QrCode className="w-4 h-4 text-amber-600" />
        <h3 className="font-heading font-bold text-sm text-zinc-950">
          2. Payment Gateway
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* GCash */}
        <button
          type="button"
          onClick={() => onChange('gcash')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all shadow-sm ${
            selectedMethod === 'gcash'
              ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
              : 'border-zinc-200 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              GCASH QR
            </span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'gcash' ? 'border-black bg-black' : 'border-zinc-300'
            }`}>
              {selectedMethod === 'gcash' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Scan store QR &amp; upload receipt proof. Instant verification!
          </p>
        </button>

        {/* Maya */}
        <button
          type="button"
          onClick={() => onChange('maya')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all shadow-sm ${
            selectedMethod === 'maya'
              ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
              : 'border-zinc-200 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              MAYA QR
            </span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'maya' ? 'border-black bg-black' : 'border-zinc-300'
            }`}>
              {selectedMethod === 'maya' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            InstaPay / Maya QR transfer with fast audit clearance.
          </p>
        </button>

        {/* COD */}
        <button
          type="button"
          onClick={() => onChange('cod')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all shadow-sm ${
            selectedMethod === 'cod'
              ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
              : 'border-zinc-200 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              COD RIDER
            </span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'cod' ? 'border-black bg-black' : 'border-zinc-300'
            }`}>
              {selectedMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Pay exact cash upon parcel delivery to courier rider.
          </p>
        </button>
      </div>
    </div>
  );
};
