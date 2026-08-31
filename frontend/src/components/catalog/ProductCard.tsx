import React from 'react';
import { Heart, ShoppingBag, Ruler } from 'lucide-react';
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

  const handleAddToCart = (e: React.MouseEvent) => {
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
      className={`group relative bg-white rounded-xl overflow-hidden border border-zinc-200 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 flex flex-col cursor-pointer ${
        item.isSoldOut ? 'opacity-75' : ''
      }`}
    >
      {/* Standardized Media Image Container (4:5 Aspect Ratio) */}
      <div className="relative w-full aspect-[4/5] bg-orange-50/30 overflow-hidden shrink-0">
        <ImageWithFallback
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          <Badge variant="gold">
            {item.stockQuantity && item.stockQuantity > 1 ? `${item.stockQuantity} Pcs Available` : '1-of-1 Curated'}
          </Badge>
          {item.isReserved && !item.isSoldOut && (
            <Badge variant="hold">In Cart Hold</Badge>
          )}
        </div>

        {/* Silhouette / GSM Tag (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
          {item.condition.fabricGsm && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-950/85 backdrop-blur-md text-white shadow-sm border border-zinc-800">
              {item.condition.fabricGsm} GSM
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2.5 right-2.5 z-10 p-2 rounded-lg bg-white/95 backdrop-blur-md text-zinc-600 hover:text-orange-600 border border-zinc-200 transition-all active:scale-95 shadow-sm"
          title={wishlisted ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              wishlisted ? 'fill-orange-500 text-orange-500' : 'text-zinc-600'
            }`}
          />
        </button>

        {/* Claimed / Sold Out Scrim & Stamp */}
        {item.isSoldOut && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="border-2 border-red-600 text-red-600 px-3 py-1 rounded-sm -rotate-12 font-mono font-bold tracking-widest text-xs uppercase bg-white shadow-md">
              CLAIMED / SOLD
            </div>
          </div>
        )}
      </div>

      {/* Card Details Container with responsive padding */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Brand & Tag Size */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold tracking-wider uppercase text-orange-700 text-[10px]">
              {item.brand}
            </span>
            <span className="text-zinc-500 text-[10px]">
              Tag: <strong className="text-zinc-800">{item.tagSize}</strong>
            </span>
          </div>

          {/* Garment Title - Single Line Clamp with no clipping */}
          <h3 className="font-heading font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug">
            {item.title}
          </h3>

          {/* Garment Description - 2 Lines Clamp */}
          <p className="text-[11px] sm:text-xs text-zinc-500 font-mono line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Silhouette & Pit-to-Pit Quick Specs */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-zinc-100 text-[10px] sm:text-[11px] text-zinc-600 font-mono">
            <span className="truncate text-zinc-700 font-medium">
              {item.silhouette}
            </span>
            {item.measurements.pitToPitInches > 0 && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-orange-800 shrink-0 flex items-center gap-0.5 font-bold">
                  <Ruler className="w-3 h-3 text-zinc-400" />
                  {item.measurements.pitToPitInches}" P2P
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price & Mine Action */}
        <div className="pt-2 sm:pt-3 border-t border-zinc-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <span className="font-mono font-bold text-sm sm:text-base text-zinc-950 block leading-tight">
              {item.hasCustomSizePricing && item.minPricePhp && item.maxPricePhp && item.minPricePhp !== item.maxPricePhp
                ? `${formatPhp(item.minPricePhp)} – ${formatPhp(item.maxPricePhp)}`
                : formatPhp(item.pricePhp)}
            </span>
            {item.originalEstimatedPricePhp && (
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 line-through block">
                Val. {formatPhp(item.originalEstimatedPricePhp)}
              </span>
            )}
          </div>

          {!item.isSoldOut ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] sm:text-xs font-mono font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-300" />
              <span>+ Cart</span>
            </button>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 uppercase">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
