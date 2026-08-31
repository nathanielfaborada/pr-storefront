import React from 'react';
import { Trash2, Plus, Minus, Ruler } from 'lucide-react';
import { CartItem } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';

interface CartItemRowProps {
  cartItem: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  cartItem,
  onUpdateQuantity,
  onRemove,
}) => {
  const { item, quantity = 1 } = cartItem;

  return (
    <div className="p-3 sm:p-3.5 bg-white rounded-2xl border border-zinc-200 flex gap-3 sm:gap-3.5 group relative hover:border-zinc-300 transition-all shadow-xs font-mono">
      {/* 1. Left Image Thumbnail */}
      <img
        src={item.images[0]}
        alt={item.title}
        className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-zinc-100 shrink-0 border border-zinc-200"
      />

      {/* 2. Right Details & Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Top Brand & Trash Remove */}
          <div className="flex items-start justify-between gap-1">
            <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider truncate">
              {item.brand || 'P&R Studio'}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="text-zinc-400 hover:text-red-600 p-1 -mr-1 rounded-md hover:bg-red-50 transition-colors"
              title="Remove item from bag"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Product Title */}
          <h4 className="font-heading font-bold text-xs sm:text-sm text-zinc-950 truncate mt-0.5">
            {item.title}
          </h4>

          {/* Specs: Tag Size & P2P / GSM */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-600">
            <span>Size: <strong className="text-zinc-950">{item.tagSize}</strong></span>
            {item.measurements.pitToPitInches > 0 && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-orange-800 font-medium">{item.measurements.pitToPitInches}" Width</span>
              </>
            )}
            {item.condition.fabricGsm && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-500">{item.condition.fabricGsm} GSM</span>
              </>
            )}
          </div>
        </div>

        {/* 3. Bottom Row: Price & Quantity Stepper (+ / -) */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
          <div>
            <span className="font-mono font-bold text-sm sm:text-base text-zinc-950 block">
              {formatPhp(item.pricePhp * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-[10px] text-zinc-400 font-mono block">
                {formatPhp(item.pricePhp)} each
              </span>
            )}
          </div>

          {/* Stepper (+ and - buttons) */}
          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50 shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
              className="p-1.5 sm:px-2 sm:py-1 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center justify-center"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="px-2 text-xs font-bold font-mono text-zinc-950 min-w-[24px] text-center select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              className="p-1.5 sm:px-2 sm:py-1 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center justify-center"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
