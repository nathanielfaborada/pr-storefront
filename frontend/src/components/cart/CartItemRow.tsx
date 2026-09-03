import React from 'react';
import { Trash2, Plus, Minus, Tag } from 'lucide-react';
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
  const maxStock = item.stockQuantity || 1;

  return (
    <div className="p-3.5 bg-white rounded-2xl border border-zinc-200 flex gap-3.5 group relative hover:border-zinc-300 transition-all shadow-2xs font-mono">
      {/* 1. Left Image Thumbnail */}
      <div className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.stockQuantity === 1 && (
          <span className="absolute bottom-1 left-1 right-1 text-center bg-zinc-950/85 backdrop-blur-xs text-white text-[8px] font-bold py-0.5 rounded uppercase">
            1-of-1 Piece
          </span>
        )}
      </div>

      {/* 2. Right Details & Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Top: SKU / Drop Tag & Remove Button */}
          <div className="flex items-start justify-between gap-1">
            <span className="text-[10px] font-bold uppercase text-orange-700 tracking-wider truncate">
              {item.id || 'Drop 08 Piece'}
            </span>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-zinc-400 hover:text-red-600 p-1 -mr-1 -mt-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove from bag"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product Title */}
          <h4 className="font-heading font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2 mt-0.5 leading-snug">
            {item.title}
          </h4>

          {/* Specs Chips: Tag Size, Width, Fabric GSM */}
          <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px] text-zinc-600">
            <span className="bg-zinc-100 px-1.5 py-0.5 rounded font-bold text-zinc-950">
              Size {item.tagSize}
            </span>
            {item.measurements?.pitToPitInches && item.measurements.pitToPitInches > 0 ? (
              <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">
                {item.measurements.pitToPitInches}" P2P
              </span>
            ) : null}
            {item.condition?.fabricGsm ? (
              <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">
                {item.condition.fabricGsm} GSM
              </span>
            ) : null}
          </div>
        </div>

        {/* 3. Bottom Row: Total Price & Quantity Stepper */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
          <div>
            <span className="font-bold text-sm sm:text-base text-zinc-950 block leading-tight">
              {formatPhp(item.pricePhp * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-[9px] text-zinc-400 font-mono block">
                {formatPhp(item.pricePhp)} each
              </span>
            )}
          </div>

          {/* Stepper (+ / -) */}
          <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
              className="p-1.5 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="px-2.5 text-xs font-bold font-mono text-zinc-950 min-w-[24px] text-center select-none">
              {quantity}
            </span>

            <button
              type="button"
              disabled={quantity >= maxStock}
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              className="p-1.5 hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
              title={quantity >= maxStock ? 'Max available pieces reached' : 'Increase quantity'}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
