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
      className={`group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col h-full justify-between cursor-pointer ${
        item.isSoldOut ? 'opacity-80' : ''
      }`}
    >
      {/* 1. Standardized Media Image Container (Fixed Aspect Ratio 4:5) */}
      <div className="relative w-full aspect-[4/5] bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center">
        <ImageWithFallback
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top-Left: Stock / Curated Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={item.isSoldOut ? 'sold' : 'gold'}>
            {item.isSoldOut
              ? 'Sold Out'
              : item.stockQuantity && item.stockQuantity > 1
              ? `${item.stockQuantity} pcs left`
              : '1 of 1 Left'}
          </Badge>
        </div>

        {/* Top-Right: Fabric GSM Badge */}
        {item.condition.fabricGsm && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-zinc-950/85 backdrop-blur-md text-white shadow-sm border border-zinc-800">
              {item.condition.fabricGsm} GSM
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-3 right-3 z-10 p-2 rounded-xl bg-white/95 backdrop-blur-md text-zinc-600 hover:text-orange-600 border border-zinc-200 transition-all active:scale-95 shadow-sm"
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

      {/* 2. Standardized Card Details Container */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Tag Size */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold tracking-wider uppercase text-orange-700 text-[10px]">
              {item.brand}
            </span>
            <span className="text-zinc-500 text-[10px]">
              Tag: <strong className="text-zinc-800">{item.tagSize}</strong>
            </span>
          </div>

          {/* Garment Title - Fixed 2-Line Height for Perfect Grid Alignment */}
          <h3 className="font-heading font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-2 h-9 leading-snug">
            {item.title}
          </h3>

          {/* Garment Description - 2 Lines Clamp */}
          <p className="text-[11px] sm:text-xs text-zinc-500 font-mono line-clamp-2 h-8 leading-relaxed">
            {item.description}
          </p>

          {/* Silhouette & Pit-to-Pit Quick Specs */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-zinc-100 text-[10px] sm:text-[11px] text-zinc-600 font-mono">
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

        {/* Price & Action Toolbar at Uniform Baseline */}
        <div className="pt-2 sm:pt-3 border-t border-zinc-100 flex items-center justify-between gap-1.5 sm:gap-2 mt-auto">
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

          <button
            onClick={handleAddToCart}
            disabled={item.isSoldOut}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              item.isSoldOut
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-orange-600 text-white shadow-sm active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{item.isSoldOut ? 'Claimed' : 'Mine'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
