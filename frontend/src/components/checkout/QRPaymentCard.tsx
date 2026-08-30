import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../types/index.ts';

interface QRPaymentCardProps {
  method: PaymentMethod;
  referenceNumber: string;
  onReferenceChange: (ref: string) => void;
  totalAmount: number;
}

export const QRPaymentCard: React.FC<QRPaymentCardProps> = ({
  method,
  referenceNumber,
  onReferenceChange,
  totalAmount,
}) => {
  const [copied, setCopied] = useState(false);

  const accountNumber = '0917-884-9124';
  const accountName = 'P&R STREETWEAR CO. (NATHANIEL F.)';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (method === 'cod') {
    return (
      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs font-mono text-zinc-700 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-zinc-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cash on Delivery Terms</span>
        </div>
        <p className="leading-relaxed text-zinc-600">
          Please prepare exact cash of the total amount when the rider arrives. Unfulfilled COD orders will automatically revoke 15-minute lock privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4 font-mono shadow-sm">
      
      {/* Header & QR Instructions */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* QR Code Container */}
        <div className="w-28 h-28 bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center shrink-0">
          <QrCode className="w-20 h-20 text-black" />
          <span className="text-[9px] font-bold tracking-wider text-black uppercase mt-0.5">
            {method.toUpperCase()} QR
          </span>
        </div>

        {/* Store Account Details */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
              Official Store Account
            </span>
            <h4 className="font-heading font-bold text-sm text-zinc-950">
              {accountName}
            </h4>
          </div>

          {/* Copyable Mobile Number Button */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-mono font-bold text-base text-zinc-950 bg-white px-3 py-1 rounded-xl border border-zinc-200 shadow-sm">
              {accountNumber}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-500">
            Upload transaction screenshot below. Our vault verifies receipts in real-time.
          </p>
        </div>
      </div>

      {/* Reference Number Field */}
      <div className="pt-3 border-t border-zinc-200">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
          {method === 'gcash' ? 'GCash' : 'Maya'} 13-Digit Reference Number *
        </label>
        <input
          type="text"
          required
          value={referenceNumber}
          onChange={(e) => onReferenceChange(e.target.value)}
          placeholder="e.g. 100982348123"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm font-mono text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black shadow-sm"
        />
      </div>

    </div>
  );
};
