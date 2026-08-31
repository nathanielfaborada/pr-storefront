import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Search, Edit2, Trash2 } from 'lucide-react';

interface AdminInventorySectionProps {
  products: Item[];
  onDeletePiece: (id: string) => void;
}

export const AdminInventorySection: React.FC<AdminInventorySectionProps> = ({
  products,
  onDeletePiece,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tagSize.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* 1. Slim Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search piece, code, size..."
            className="w-full h-8 pl-8 pr-2.5 rounded-lg sm:rounded-xl bg-white border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {['all', 'boxy-tees', 'cropped-hoodies', 'parachute-cargos', 'techwear-outerwear', 'accessories'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-zinc-950 text-white shadow-xs font-bold'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              {cat === 'all' ? 'All Pieces' : cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Product Cards (Mobile Horizontal Row / Desktop Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {filteredProducts.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-xl sm:rounded-2xl border transition-all overflow-hidden flex flex-row md:flex-col items-center md:items-stretch gap-2.5 md:gap-0 p-2 md:p-0 shadow-xs hover:border-zinc-300 ${
              item.isSoldOut ? 'border-zinc-200 bg-zinc-50/60 opacity-80' : 'border-zinc-200'
            }`}
          >
            {/* Left Thumbnail Media */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-full md:h-auto md:aspect-4/5 rounded-lg md:rounded-none overflow-hidden shrink-0 bg-zinc-100">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Stock / Sold Micro Badge */}
              <div className="absolute top-1.5 left-1.5 md:top-2.5 md:left-2.5">
                {item.isSoldOut ? (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950/90 backdrop-blur-xs text-white text-[9px] md:text-[10px] font-mono font-bold shadow-xs">
                    Sold Out
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] md:text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    <span>{item.stockQuantity && item.stockQuantity > 1 ? `${item.stockQuantity} pcs` : 'Available'}</span>
                  </span>
                )}
              </div>

              {/* Fabric GSM Tag */}
              {item.condition.fabricGsm && (
                <div className="absolute bottom-1.5 left-1.5 md:bottom-auto md:top-2.5 md:right-2.5 md:left-auto">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] md:text-[10px] font-mono font-bold shadow-xs">
                    {item.condition.fabricGsm} GSM
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Specs & Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full md:p-3.5 space-y-1 md:space-y-2">
              <div>
                {/* Top Line: SKU & Hand-Measured Dimensions */}
                <div className="flex items-center justify-between text-[10px] md:text-[11px] text-zinc-500 font-mono">
                  <span className="truncate font-semibold text-zinc-800">
                    {item.id} · <strong className="text-zinc-950">{item.tagSize}</strong>
                  </span>
                  {item.measurements.pitToPitInches > 0 && (
                    <span className="text-orange-700 font-bold shrink-0 ml-1">
                      {item.measurements.pitToPitInches}" W × {item.measurements.lengthInches}" L
                    </span>
                  )}
                </div>

                {/* Middle Line: Product Title */}
                <h3 className="font-heading font-bold text-xs md:text-sm text-zinc-900 line-clamp-1 mt-0.5">
                  {item.title}
                </h3>

                {/* Price Line */}
                <div className="flex items-baseline justify-between mt-0.5 md:mt-1 md:pt-1 md:border-t md:border-zinc-100">
                  <span className="font-mono font-bold text-xs md:text-sm text-zinc-950">
                    {formatPhp(item.pricePhp)}
                  </span>
                  <span className="hidden md:inline text-[10px] font-mono text-zinc-400">
                    Drop Price
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-1.5 md:pt-2.5 border-t border-zinc-100 flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => navigate(`/admin/drops/edit/${item.id}`)}
                  className="flex-1 h-7 md:h-8 px-2.5 rounded-lg md:rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white transition-all shadow-2xs"
                >
                  <Edit2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>Edit Piece</span>
                </button>

                <button
                  onClick={() => onDeletePiece(item.id)}
                  className="h-7 w-7 md:h-8 md:w-8 p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-xl border border-zinc-200 hover:border-red-200 transition-colors flex items-center justify-center shrink-0 shadow-2xs"
                  title="Delete Piece"
                >
                  <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
