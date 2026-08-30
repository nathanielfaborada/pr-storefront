import React from 'react';
import { Truck, ShieldCheck, ArrowRight } from 'lucide-react';
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
  const remainingForFreeShipping = Math.max(0, 2500 - subtotal);

  return (
    <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
      {/* Free shipping threshold meter */}
      <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-700 flex items-center gap-2 shadow-sm">
        <Truck className="w-4 h-4 text-amber-600 shrink-0" />
        {isFreeShipping ? (
          <span className="font-semibold text-emerald-700">
            🔥 Free Philippine Courier Shipping Unlocked!
          </span>
        ) : (
          <span>
            Add <strong className="text-amber-700">{formatPhp(remainingForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>.
          </span>
        )}
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-1.5 text-xs font-mono text-zinc-600">
        <div className="flex items-center justify-between">
          <span>Subtotal ({subtotal > 0 ? '1-of-1 pieces' : '0 items'})</span>
          <span className="text-zinc-950 font-semibold">{formatPhp(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Courier Shipping (Metro Manila)</span>
          <span className="text-zinc-950 font-semibold">
            {shipping === 0 ? 'FREE' : formatPhp(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-950">
          <span className="font-heading">Total Amount</span>
          <span className="font-mono text-base text-zinc-950">{formatPhp(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onProceedToCheckout}
        disabled={subtotal === 0}
        className="shadow-sm"
      >
        <span>Proceed to Fast Checkout</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>15-Minute Exclusive Bag Lock Guaranteed</span>
      </div>
    </div>
  );
};
