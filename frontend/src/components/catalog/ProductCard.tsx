import React from 'react';
import { Heart, Zap, Ruler } from 'lucide-react';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Badge } from '../common/Badge.tsx';
import { ImageWithFallback } from '../common/ImageWithFallback.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useCart } from '../../context/CartContext.tsx';

interface ProductCardProps {
  item: Item;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onClick }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isWishlisted(item.id);

  const handleMine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isSoldOut) {
      addToCart(item);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(item.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-900 transition-all duration-150 flex flex-col cursor-pointer shadow-sm hover:shadow-md ${
        item.isSoldOut ? 'opacity-70' : ''
      }`}
    >
      {/* Media Image Container (4:5 Aspect Ratio) */}
      <div className="relative w-full aspect-[4/5] bg-zinc-100 overflow-hidden">
        <ImageWithFallback
          src={item.images[0]}
          alt={item.title}
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          <Badge variant="gold">1-of-1 Curated</Badge>
          {item.isReserved && !item.isSoldOut && (
            <Badge variant="hold">In Cart Hold</Badge>
          )}
        </div>

        {/* Silhouette / GSM Tag (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
          {item.condition.fabricGsm && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/85 backdrop-blur-md text-white shadow-sm">
              {item.condition.fabricGsm} GSM
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2.5 right-2.5 z-10 p-2 rounded-xl bg-white/85 backdrop-blur-md text-zinc-600 hover:text-amber-600 border border-zinc-200 transition-all active:scale-95 shadow-sm"
          title={wishlisted ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-amber-500 text-amber-500' : 'text-zinc-600'
            }`}
          />
        </button>

        {/* Claimed / Sold Out Scrim & Diagonal Stamp */}
        {item.isSoldOut && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="border-2 border-red-600 text-red-600 px-3.5 py-1 rounded-lg -rotate-12 font-mono font-bold tracking-widest text-sm uppercase bg-white shadow-lg">
              CLAIMED / SOLD
            </div>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Tag */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono font-bold tracking-wider uppercase text-amber-700 text-[10px]">
              {item.brand}
            </span>
            <span className="font-mono text-zinc-500 text-[10px]">
              Tag: <strong className="text-zinc-800">{item.tagSize}</strong>
            </span>
          </div>

          {/* Garment Title */}
          <h3 className="font-heading font-semibold text-sm text-zinc-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Silhouette & Pit-to-Pit Quick Specs */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600 font-mono">
            <span className="truncate text-zinc-700">
              {item.silhouette}
            </span>
            {item.measurements.pitToPitInches > 0 && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-amber-800 shrink-0 flex items-center gap-0.5 font-bold">
                  <Ruler className="w-3 h-3 text-zinc-400" />
                  {item.measurements.pitToPitInches}" P2P
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price & Mine Action */}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div>
            <div className="font-mono font-bold text-base sm:text-lg text-zinc-950 leading-none">
              {formatPhp(item.pricePhp)}
            </div>
            {item.originalEstimatedPricePhp && (
              <span className="text-[10px] font-mono text-zinc-400 line-through">
                Val. {formatPhp(item.originalEstimatedPricePhp)}
              </span>
            )}
          </div>

          {!item.isSoldOut ? (
            <button
              onClick={handleMine}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-gradient text-black text-xs font-heading font-bold shadow-sm hover:brightness-105 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Mine</span>
            </button>
          ) : (
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Claimed</span>
          )}
        </div>
      </div>
    </div>
  );
};
