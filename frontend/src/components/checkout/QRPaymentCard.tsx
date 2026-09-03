import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck, Zap, CreditCard, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';

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
  const [paymongoSimulated, setPaymongoSimulated] = useState(false);

  const accountNumber = '0917-884-9124';
  const accountName = 'P&R ARCHIVAL STUDIO (NATHANIEL F.)';

  const downpaymentAmount = Math.ceil(totalAmount * 0.5);
  const remainingCodAmount = totalAmount - downpaymentAmount;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayMongoClick = () => {
    setPaymongoSimulated(true);
    onReferenceChange(`PM-AUTOPAY-${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  };

  // 1. FULL CASH ON DELIVERY
  if (method === 'cod') {
    return (
      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs font-mono text-zinc-700 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-zinc-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Full Cash on Delivery (100% Doorstep Cash)</span>
        </div>
        <p className="leading-relaxed text-zinc-600">
          Please prepare the exact cash amount of <strong className="text-zinc-950 font-bold">{formatPhp(totalAmount)}</strong> when the J&amp;T Express courier rider arrives at your doorstep.
        </p>
      </div>
    );
  }

  // 2. OPTION 2: AUTOMATED PAYMONGO GATEWAY
  if (method === 'paymongo') {
    return (
      <div className="p-4 sm:p-5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3.5 font-mono shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <h4 className="font-heading font-bold text-sm text-zinc-950">
              PayMongo Instant Payment Gateway
            </h4>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full border border-blue-300">
            Webhooks Active
          </span>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          Pay seamlessly with your GCash, Maya, GrabPay, or Credit/Debit Card through PayMongo's secure payment portal.
        </p>

        {paymongoSimulated ? (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">PayMongo Authorization Simulated!</span>
              <span className="text-[11px] text-emerald-700 font-mono">Ref: {referenceNumber}</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePayMongoClick}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay {formatPhp(totalAmount)} with PayMongo (Instant 1-Click)</span>
          </button>
        )}
      </div>
    );
  }

  // 3. OPTION 1: 50% PARTIAL COD / FULL UPFRONT STUDIO QR
  const isPartial = method === 'partial_cod';
  const activeAmount = isPartial ? downpaymentAmount : totalAmount;

  return (
    <div className="p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4 font-mono shadow-2xs">
      
      {/* 50% Downpayment Banner if Partial COD */}
      {isPartial && (
        <div className="p-3 bg-orange-100/60 rounded-xl border border-orange-300 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-orange-950 block">
              50% Downpayment: {formatPhp(downpaymentAmount)}
            </span>
            <span className="text-[10px] text-orange-800">
              Remaining {formatPhp(remainingCodAmount)} will be collected via COD by J&amp;T Rider.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white text-orange-900 px-2 py-0.5 rounded-full border border-orange-300">
            50% Policy
          </span>
        </div>
      )}

      {/* Studio QR & Details */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* QR Code Container */}
        <div className="w-28 h-28 bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center shrink-0">
          <QrCode className="w-20 h-20 text-black" />
          <span className="text-[9px] font-bold tracking-wider text-black uppercase mt-0.5">
            STUDIO QR
          </span>
        </div>

        {/* Store Account Details */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-700">
              Official Studio E-Wallet (GCash / Maya)
            </span>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-zinc-950">
              {accountName}
            </h4>
          </div>

          {/* Copyable Mobile Number Button */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-mono font-bold text-sm sm:text-base text-zinc-950 bg-white px-3 py-1 rounded-xl border border-zinc-200 shadow-2xs">
              {accountNumber}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-95 shadow-2xs cursor-pointer"
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
            Transfer exact amount of <strong className="text-zinc-950 font-bold">{formatPhp(activeAmount)}</strong> and enter your 13-digit reference number below.
          </p>
        </div>
      </div>

      {/* Reference Number Field */}
      <div className="pt-3 border-t border-zinc-200">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
          GCash / Maya 13-Digit Reference Number *
        </label>
        <input
          type="text"
          required
          maxLength={20}
          value={referenceNumber}
          onChange={(e) => onReferenceChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="e.g. 100982348123"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-xs sm:text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 font-mono tracking-wider font-bold transition-all"
        />
        <p className="text-[10px] text-zinc-400 mt-1">
          Found at the top-right of your GCash/Maya payment receipt.
        </p>
      </div>

    </div>
  );
};

export default QRPaymentCard;
