import React from 'react';
import { Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPhp } from '../../utils/index.ts';
import { Button } from '../common/Button.tsx';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  onProceedToCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  total,
  onProceedToCheckout,
}) => {
  const isFreeShipping = shipping === 0 && subtotal > 0;
  const freeShippingThreshold = 2500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white space-y-3.5 font-mono">
      {/* 1. Free Shipping Progress Bar */}
      <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Truck className="w-4 h-4 text-orange-600 shrink-0" />
            {isFreeShipping ? (
              <span className="font-bold text-emerald-700 truncate">
                Free Philippine Courier Shipping Unlocked!
              </span>
            ) : (
              <span className="text-zinc-600 truncate">
                Add <strong className="text-zinc-950">{formatPhp(remainingForFreeShipping)}</strong> for <strong className="text-orange-700">FREE Shipping</strong>
              </span>
            )}
          </div>

          <span className="text-[10px] font-bold text-zinc-500 shrink-0">
            {isFreeShipping ? '100%' : `${progressPercent}%`}
          </span>
        </div>

        {/* Progress Fill Bar */}
        <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFreeShipping
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Pricing Breakdown */}
      <div className="space-y-2 text-xs text-zinc-600 pt-1">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-zinc-950 font-bold font-mono">{formatPhp(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span>Courier Shipping</span>
            <span className="text-[10px] text-zinc-400 font-mono">(J&amp;T Express)</span>
          </span>
          <span className="font-bold font-mono">
            {shipping === 0 ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                FREE
              </span>
            ) : (
              formatPhp(shipping)
            )}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-200 text-sm font-bold text-zinc-950">
          <span className="font-heading text-sm">Estimated Total</span>
          <span className="font-mono text-base sm:text-lg text-zinc-950">{formatPhp(total)}</span>
        </div>
      </div>

      {/* 3. Active Checkout CTA Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onProceedToCheckout}
        disabled={subtotal === 0}
        className="shadow-md font-bold text-xs sm:text-sm py-3 h-12 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      {/* 4. Trust Seal */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Authentic 1-of-1 Streetwear · Pandi Studio Inspected</span>
      </div>
    </div>
  );
};

export default CartSummary;
