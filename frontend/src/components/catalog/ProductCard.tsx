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
      className={`group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between p-3 sm:p-0 cursor-pointer font-mono ${
        item.isSoldOut ? 'opacity-85' : ''
      }`}
    >
      {/* 1. TOP SECTION (HORIZONTAL on Mobile `<sm`, VERTICAL Full-Width on Desktop `sm:`) */}
      <div className="flex flex-row sm:flex-col items-center sm:items-stretch gap-3 sm:gap-0 w-full">
        
        {/* Left on Mobile / Full Top on Desktop: Media Image */}
        <div className="w-24 h-24 sm:w-full sm:h-auto sm:aspect-[4/5] rounded-xl sm:rounded-none overflow-hidden flex-shrink-0 relative bg-zinc-100 border border-zinc-100 sm:border-none flex items-center justify-center">
          <ImageWithFallback
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Unified Non-overlapping Image Badges */}
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1 z-10 max-w-[calc(100%-12px)] flex-wrap">
            {/* Stock Badge */}
            <Badge variant={item.isSoldOut ? 'sold' : 'gold'} className="!px-1.5 !py-0.5 !text-[9px] sm:!text-[10px]">
              {item.isSoldOut
                ? 'Sold'
                : item.stockQuantity && item.stockQuantity > 1
                ? `${item.stockQuantity} pcs`
                : '1 of 1'}
            </Badge>

            {/* GSM Badge */}
            {item.condition?.fabricGsm ? (
              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-zinc-950/85 backdrop-blur-md text-white shadow-xs border border-zinc-800 shrink-0">
                {item.condition.fabricGsm} GSM
              </span>
            ) : null}
          </div>

          {/* Claimed / Sold Out Scrim */}
          {item.isSoldOut && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20">
              <div className="border border-red-600 text-red-600 px-2 py-0.5 rounded -rotate-12 font-mono font-bold tracking-widest text-[9px] sm:text-xs uppercase bg-white shadow-sm">
                SOLD
              </div>
            </div>
          )}
        </div>

        {/* Right on Mobile / Bottom Middle on Desktop: Details Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-center sm:justify-start sm:p-4 py-0 sm:pt-3.5 space-y-1 sm:space-y-1.5">
          {/* Row 1: Brand name on left, Size pill on right */}
          <div className="flex items-center justify-between gap-1.5">
            <span className="truncate text-[10px] font-bold tracking-wider uppercase text-orange-700 max-w-[130px]">
              {item.brand || 'P&R Studio'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 font-mono font-medium text-neutral-800 shrink-0">
              Size: {item.tagSize}
            </span>
          </div>

          {/* Row 2: Product Title (2 lines clamp) */}
          <h3 className="font-heading font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Description - Shown on Desktop */}
          <p className="hidden sm:block text-[11px] sm:text-xs text-neutral-500 font-mono line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Row 3: Fit specs */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-500 font-mono pt-0 sm:pt-1">
            <span className="truncate max-w-[105px] sm:max-w-none text-neutral-700 font-medium">
              {item.silhouette}
            </span>
            {item.measurements?.pitToPitInches > 0 && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="text-orange-800 font-medium shrink-0 flex items-center gap-0.5">
                  <Ruler className="w-3 h-3 text-neutral-400" />
                  <span>{item.measurements.pitToPitInches}" Width</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. DEDICATED BOTTOM FOOTER (Full Width Spanning Price & Actions) */}
      <div className="w-full pt-2.5 mt-2.5 sm:mt-0 sm:p-4 sm:pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
        {/* Left Side (Price) */}
        <div className="flex-shrink-0 flex flex-col">
          <span className="text-base sm:text-lg font-bold font-mono text-neutral-900 leading-none whitespace-nowrap">
            {item.hasCustomSizePricing && item.minPricePhp && item.maxPricePhp && item.minPricePhp !== item.maxPricePhp
              ? `${formatPhp(item.minPricePhp)} – ${formatPhp(item.maxPricePhp)}`
              : formatPhp(item.pricePhp)}
          </span>
          {item.originalEstimatedPricePhp && (
            <span className="text-[10px] text-neutral-400 line-through leading-tight mt-0.5 whitespace-nowrap">
              Val. {formatPhp(item.originalEstimatedPricePhp)}
            </span>
          )}
        </div>

        {/* Right Side (Actions) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-orange-600 transition-all active:scale-95 shadow-2xs cursor-pointer shrink-0"
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                wishlisted ? 'fill-orange-500 text-orange-500' : 'text-neutral-600'
              }`}
            />
          </button>

          {/* Mine Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={item.isSoldOut}
            className={`px-4 py-2 text-xs font-semibold rounded-lg font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 ${
              item.isSoldOut
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-orange-600 text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{item.isSoldOut ? 'Sold' : 'Mine'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
