import React from 'react';
import { Trash2, Ruler } from 'lucide-react';
import { CartItem } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Badge } from '../common/Badge.tsx';

interface CartItemRowProps {
  cartItem: CartItem;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ cartItem, onRemove }) => {
  const { item } = cartItem;

  return (
    <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex gap-3.5 group relative hover:border-zinc-300 transition-colors shadow-sm">
      {/* Garment Image */}
      <img
        src={item.images[0]}
        alt={item.title}
        className="w-18 h-22 object-cover rounded-xl bg-zinc-100 shrink-0 border border-zinc-200"
      />

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1">
            <Badge variant="gold">1-of-1 Piece</Badge>
            <button
              onClick={() => onRemove(item.id)}
              className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
              title="Release hold & remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-heading font-semibold text-xs text-zinc-900 truncate mt-1">
            {item.title}
          </h4>

          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-600">
            <span>Tag: <strong className="text-zinc-900">{item.tagSize}</strong></span>
            <span className="text-zinc-300">·</span>
            <span className="truncate">Fit: <strong>{item.recommendedFit}</strong></span>
          </div>

          {item.measurements.pitToPitInches > 0 && (
            <div className="text-[10px] text-amber-700 font-mono mt-0.5 flex items-center gap-1">
              <Ruler className="w-3 h-3 text-zinc-400" />
              <span>{item.measurements.pitToPitInches}" Boxy Width</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            Locked Price
          </span>
          <span className="font-mono font-bold text-sm text-zinc-950">
            {formatPhp(item.pricePhp)}
          </span>
        </div>
      </div>
    </div>
  );
};
