import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Search, Edit2, Trash2, Ruler, Plus } from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal.tsx';

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
  const [deletingPiece, setDeletingPiece] = useState<Item | null>(null);

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tagSize.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="space-y-3 font-mono text-zinc-950">
      
      {/* 1. Slim Search Bar, Category Filter & + Add Drop Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 sm:p-3 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search piece, SKU, size..."
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
            />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto no-scrollbar">
          {/* Category Filters */}
          <div className="flex items-center gap-1 shrink-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'boxy-tees', label: 'Tees' },
              { id: 'cropped-hoodies', label: 'Hoodies' },
              { id: 'parachute-cargos', label: 'Cargos' },
              { id: 'techwear-outerwear', label: 'Jackets' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-zinc-950 text-white font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* + Add Drop Button */}
          <button
            onClick={() => navigate('/admin/drops/new')}
            className="h-8 px-3.5 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span> Add Drop</span>
          </button>
        </div>
      </div>

      {/* 2. Responsive Product Cards: Mobile Horizontal (Left: Image, Right: Details + Buttons) / Desktop Vertical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-row sm:flex-col p-2.5 sm:p-0 gap-3 sm:gap-0 shadow-xs hover:border-zinc-400 ${
              item.isSoldOut ? 'border-zinc-200 opacity-80' : 'border-zinc-200'
            }`}
          >
            {/* LEFT SIDE ON MOBILE / TOP ON DESKTOP: Image with Badges */}
            <div className="relative w-28 sm:w-full aspect-[3/4] sm:aspect-[4/5] bg-zinc-100 rounded-xl sm:rounded-none overflow-hidden shrink-0">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Status & Live Stock Piece Counter Badge */}
              <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex items-center gap-1 z-10">
                {item.isSoldOut ? (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-zinc-950/90 text-white shadow-sm">
                    Sold Out
                  </span>
                ) : item.stockQuantity && item.stockQuantity > 1 ? (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{item.stockQuantity} pcs left</span>
                  </span>
                ) : (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-amber-500 text-black shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    <span>1 of 1</span>
                  </span>
                )}

                {item.condition.fabricGsm && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-950/80 text-white backdrop-blur-xs">
                    {item.condition.fabricGsm} GSM
                  </span>
                )}
              </div>

              {/* Size Badge */}
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-black/80 backdrop-blur-xs text-white">
                  {item.tagSize}
                </span>
              </div>
            </div>

            {/* RIGHT SIDE ON MOBILE / BOTTOM ON DESKTOP: Details & Action Buttons */}
            <div className="flex-1 min-w-0 flex flex-col justify-between sm:p-3.5 space-y-2 py-0.5">
              <div className="space-y-1 sm:space-y-1.5">
                
                {/* SKU Code & GSM Tag */}
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 font-mono">
                  <span className="font-bold text-zinc-700 truncate">{item.id}</span>
                  {item.condition.fabricGsm && (
                    <span className="sm:hidden text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded font-bold text-[9px]">
                      {item.condition.fabricGsm} GSM
                    </span>
                  )}
                </div>

                {/* Garment Title */}
                <h3 className="font-heading font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2 leading-snug" title={item.title}>
                  {item.title}
                </h3>

                {/* Dimensions & Price */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="font-mono font-bold text-sm sm:text-base text-zinc-950">
                    {formatPhp(item.pricePhp)}
                  </span>
                  
                  {item.measurements.pitToPitInches > 0 && (
                    <span className="text-zinc-600 text-[10px] sm:text-[11px] font-semibold flex items-center gap-0.5">
                      <Ruler className="w-2.5 h-2.5 text-zinc-400" />
                      <span>{item.measurements.pitToPitInches}" × {item.measurements.lengthInches}"</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons (Right side on mobile / Bottom on desktop) */}
              <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/drops/edit/${item.id}`)}
                  className="flex-1 h-9 sm:h-10 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Piece</span>
                </button>

                <button
                  onClick={() => setDeletingPiece(item)}
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-zinc-200 bg-white hover:border-red-300 hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-all flex items-center justify-center shrink-0 shadow-xs active:scale-98 cursor-pointer"
                  title="Delete Piece"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Delete Piece Confirmation Modal */}
      {deletingPiece && (
        <ConfirmModal
          isOpen={Boolean(deletingPiece)}
          onClose={() => setDeletingPiece(null)}
          onConfirm={() => {
            if (deletingPiece) {
              onDeletePiece(deletingPiece.id);
            }
          }}
          title="Delete Curated Piece?"
          description="Are you sure you want to permanently delete this piece from the Drop 08 vault? It will also be removed from the customer storefront."
          itemName={`${deletingPiece.title} (${deletingPiece.id})`}
          confirmText="Yes, Delete Piece"
          cancelText="Keep Piece"
          variant="danger"
        />
      )}

    </div>
  );
};

export default AdminInventorySection;
