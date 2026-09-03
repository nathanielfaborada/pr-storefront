import React from 'react';
import { PaymentMethod } from '../../types/index.ts';
import { QrCode, Zap, ShieldCheck, CreditCard, Banknote, Sparkles } from 'lucide-react';
import { formatPhp } from '../../utils/index.ts';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  totalAmount?: number;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onChange,
  totalAmount = 0,
}) => {
  const downpaymentAmount = Math.ceil(totalAmount * 0.5);
  const remainingCodAmount = totalAmount - downpaymentAmount;

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-orange-600 shrink-0" />
          <h3 className="font-heading font-bold text-xs sm:text-sm text-zinc-950">
            2. Payment Gateway &amp; Strategy Options
          </h3>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold hidden sm:inline">
          P&amp;R Archival Studio Policy
        </span>
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        
        {/* OPTION 1: 50% Partial COD via Studio QR */}
        <button
          type="button"
          onClick={() => onChange('partial_cod')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs relative ${
            selectedMethod === 'partial_cod'
              ? 'border-zinc-950 bg-orange-50/40 ring-1.5 ring-zinc-950'
              : 'border-zinc-200 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500 text-white shrink-0">
                <QrCode className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs sm:text-sm text-zinc-950">
                    Option 1: 50% Partial COD via Studio QR
                  </span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                    ★ 0% Fee · Studio Choice
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  Manual GCash / Maya QR scan &amp; slip verification. Zero platform deductions.
                </span>
              </div>
            </div>

            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
              selectedMethod === 'partial_cod' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300'
            }`}>
              {selectedMethod === 'partial_cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>

          {/* Breakdown Preview */}
          <div className="mt-2.5 pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-600">
              Downpayment Due Now: <strong className="text-zinc-950 font-bold">{formatPhp(downpaymentAmount)}</strong>
            </span>
            <span className="text-orange-800 font-bold">
              Remaining COD: {formatPhp(remainingCodAmount)}
            </span>
          </div>
        </button>

        {/* OPTION 2: Automated PayMongo Gateway */}
        <button
          type="button"
          onClick={() => onChange('paymongo')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs relative ${
            selectedMethod === 'paymongo'
              ? 'border-zinc-950 bg-blue-50/30 ring-1.5 ring-zinc-950'
              : 'border-zinc-200 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs sm:text-sm text-zinc-950">
                    Option 2: Automated PayMongo Gateway
                  </span>
                  <span className="text-[9px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-full">
                    ⚡ Instant Auto-Clear
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  1-Click Auto Pay via GCash, Maya, GrabPay, QRPh, Cards. Instant Webhook confirmation.
                </span>
              </div>
            </div>

            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
              selectedMethod === 'paymongo' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300'
            }`}>
              {selectedMethod === 'paymongo' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-600">
              Total Amount: <strong className="text-zinc-950 font-bold">{formatPhp(totalAmount)}</strong>
            </span>
            <span className="text-blue-700 font-bold text-[10px]">
              Instant Waybill Release
            </span>
          </div>
        </button>

        {/* Secondary Choices: Full Upfront GCash/Maya OR Full COD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Full Upfront Paid via GCash / Maya */}
          <button
            type="button"
            onClick={() => onChange('gcash')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
              selectedMethod === 'gcash' || selectedMethod === 'maya'
                ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                : 'border-zinc-200 bg-white hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-zinc-700" />
                <span>100% Full Upfront Paid</span>
              </span>
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedMethod === 'gcash' || selectedMethod === 'maya' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300'
              }`}>
                {(selectedMethod === 'gcash' || selectedMethod === 'maya') && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Full {formatPhp(totalAmount)} transfer via Studio GCash/Maya. Zero COD balance.
            </p>
          </button>

          {/* Full 100% Cash on Delivery */}
          <button
            type="button"
            onClick={() => onChange('cod')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
              selectedMethod === 'cod'
                ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                : 'border-zinc-200 bg-white hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-zinc-700" />
                <span>100% Full Cash on Delivery</span>
              </span>
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedMethod === 'cod' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300'
              }`}>
                {selectedMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Pay {formatPhp(totalAmount)} in cash directly to J&amp;T Express rider.
            </p>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSelector;
