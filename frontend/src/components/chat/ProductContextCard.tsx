import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { AttachedProductSummary } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';

interface ProductContextCardProps {
  product: AttachedProductSummary;
  onRemove: () => void;
}

export const ProductContextCard: React.FC<ProductContextCardProps> = ({ product, onRemove }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src={product.thumbnailUrl}
          alt={product.title}
          className="w-11 h-13 object-cover rounded-lg bg-zinc-100 shrink-0 border border-zinc-200"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Referencing Piece</span>
          </div>
          <h4 className="text-xs font-heading font-semibold text-zinc-950 truncate">
            {product.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-600">
            <span className="font-bold text-zinc-950">
              {formatPhp(product.pricePhp)}
            </span>
            <span className="text-zinc-300">·</span>
            <span>Tag: <strong className="text-zinc-900">{product.tagSize}</strong></span>
          </div>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-1 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-md transition-colors shrink-0"
        title="Detach product context"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
