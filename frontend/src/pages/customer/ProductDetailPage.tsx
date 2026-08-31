import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Zap,
  ShoppingBag,
  MessageSquareText,
  Ruler,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Item } from '../../types/index.ts';
import { productService } from '../../services/productService.ts';
import { MultiAngleGallery } from '../../components/pdp/MultiAngleGallery.tsx';
import { Button } from '../../components/common/Button.tsx';
import { ProductCard } from '../../components/catalog/ProductCard.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useChat } from '../../context/ChatContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { formatPhp } from '../../utils/index.ts';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const { addToCart } = useCart();
  const { openChatWithProduct } = useChat();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleAddToCart = () => {
    if (item && !item.isSoldOut) {
      const activePrice = item.hasCustomSizePricing && item.sizePricing && selectedSize && item.sizePricing[selectedSize]
        ? item.sizePricing[selectedSize]
        : item.pricePhp;

      addToCart({
        ...item,
        tagSize: selectedSize || item.tagSize,
        pricePhp: activePrice,
      });
    }
  };

  const handleBuyNow = () => {
    if (item && !item.isSoldOut) {
      const activePrice = item.hasCustomSizePricing && item.sizePricing && selectedSize && item.sizePricing[selectedSize]
        ? item.sizePricing[selectedSize]
        : item.pricePhp;

      addToCart({
        ...item,
        tagSize: selectedSize || item.tagSize,
        pricePhp: activePrice,
      });
      navigate('/checkout');
    }
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([
      productService.getById(id),
      productService.getAll(),
    ]).then(([fetchedItem, allItems]) => {
      setItem(fetchedItem);
      if (fetchedItem) {
        const availableSizes = fetchedItem.sizeInventory
          ? Object.entries(fetchedItem.sizeInventory).filter(([_, q]) => q > 0).map(([s]) => s)
          : [fetchedItem.tagSize];
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        } else {
          setSelectedSize(fetchedItem.tagSize || 'XL');
        }
      }
      setAllProducts(allItems);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center font-mono">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="w-full aspect-4/5 max-h-[50vh] bg-zinc-200 rounded-xl" />
          <div className="h-6 bg-zinc-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-zinc-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center font-mono">
        <h2 className="font-heading text-2xl font-bold text-zinc-950 mb-2">Piece Not Found</h2>
        <p className="text-zinc-500 text-xs mb-6">
          This piece might have been claimed, removed, or the link is invalid.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors shadow-xs"
        >
          Return to Digital Racks
        </button>
      </div>
    );
  }

  // Related pieces in same category (excluding current item) - rendered for mobile/tablet
  const relatedItems = allProducts
    .filter(p => p.id !== item.id && p.category === item.category)
    .slice(0, 4);

  const isCurrentWishlisted = isWishlisted(item.id);
  const isPants = item.category === 'parachute-cargos';

  // Dynamic Price based on Selected Size
  const currentActivePrice = item.hasCustomSizePricing && item.sizePricing && selectedSize && item.sizePricing[selectedSize]
    ? item.sizePricing[selectedSize]
    : item.pricePhp;

  const priceDisplay = item.hasCustomSizePricing && item.minPricePhp && item.maxPricePhp && item.minPricePhp !== item.maxPricePhp && !selectedSize
    ? `${formatPhp(item.minPricePhp)} – ${formatPhp(item.maxPricePhp)}`
    : formatPhp(currentActivePrice);

  return (
    <div className="font-mono bg-zinc-50/30 min-h-0 flex flex-col justify-start pb-20 lg:pb-6">
      
      {/* 1. Breadcrumbs Row (Sitting directly beneath the navbar bottom border with zero top deadspace) */}
      <div className="w-full bg-white border-b border-zinc-200/80 shrink-0">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          
          {/* Left: Back Link + Category Path */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 hover:text-zinc-950 transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Racks</span>
            </button>

            <span className="text-zinc-300 hidden sm:inline">|</span>

            {/* Category Path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-500 truncate">
              <span className="capitalize">{item.category.replace(/-/g, ' ')}</span>
              <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="font-bold text-zinc-800 truncate">{item.id}</span>
            </div>
          </div>

          {/* Right: Wishlist / Heart Button */}
          <button
            onClick={() => toggleWishlist(item.id)}
            className={`p-1.5 rounded-lg border transition-all shrink-0 ${
              isCurrentWishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400 bg-white shadow-2xs'
            }`}
            title={isCurrentWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isCurrentWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Content Grid (Sitting immediately below breadcrumbs) */}
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 flex flex-col justify-start">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Image Gallery (5-6 cols, max-h 54vh) */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <MultiAngleGallery
              images={item.images}
              fitpicUrls={item.fitpicUrls}
              videoUrl={item.videoUrl}
              title={item.title}
            />
          </div>

          {/* RIGHT COLUMN: Ultra-Dense Consolidated Specs & Direct Actions (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-2 sm:space-y-2.5 w-full">
            
            {/* Header & Pricing Container */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700">
                  {item.brand || 'P&R Archival Studio'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 text-[9px] font-mono font-bold border border-zinc-200">
                    {item.dropNumber}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">SKU: {item.id}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading font-extrabold text-base sm:text-lg lg:text-xl text-zinc-950 leading-snug tracking-tight line-clamp-2">
                {item.title}
              </h1>

              {/* Price Line + Retail Val + Stock */}
              <div className="flex items-baseline justify-between pt-0.5 pb-1 border-b border-zinc-200">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-xl sm:text-2xl text-zinc-950">
                    {priceDisplay}
                  </span>
                  {item.originalEstimatedPricePhp && (
                    <span className="font-mono text-xs text-zinc-400 line-through">
                      Est. Val. {formatPhp(item.originalEstimatedPricePhp)}
                    </span>
                  )}
                </div>
                
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {item.stockQuantity && item.stockQuantity > 1 ? `${item.stockQuantity} Pcs Stock` : '1-of-1 Piece'}
                </span>
              </div>
            </div>

            {/* Desktop Direct Primary Action Toolbar */}
            <div className="hidden sm:block space-y-1 pt-0.5">
              <div className="flex items-center gap-1.5">
                {!item.isSoldOut ? (
                  <>
                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-9 sm:h-10 px-3 rounded-lg sm:rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Add to Cart</span>
                    </button>

                    {/* Buy Now */}
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 h-9 sm:h-10 px-3 rounded-lg sm:rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Buy Now</span>
                    </button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled
                    className="flex-1 h-9 sm:h-10 text-xs uppercase tracking-wider font-mono font-bold text-zinc-400 bg-zinc-100"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                    Claimed / Sold Out
                  </Button>
                )}

                {/* Chat Stylist */}
                <button
                  onClick={() => openChatWithProduct(item)}
                  className="h-9 sm:h-10 px-3 rounded-lg sm:rounded-xl bg-white hover:bg-orange-50 border border-zinc-200 hover:border-orange-300 text-zinc-800 hover:text-orange-950 font-mono font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
                  title="Inquire with Stylist"
                >
                  <MessageSquareText className="w-3.5 h-3.5 text-orange-600" />
                  <span>Chat</span>
                </button>
              </div>

              {/* Compressed 1-Line Trust Bar */}
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>100% Curated</span>
                </span>
                <span className="text-zinc-300">·</span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-orange-500" />
                  <span>Secure Checkout</span>
                </span>
                <span className="text-zinc-300">·</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-zinc-700" />
                  <span>Courier Dispatch</span>
                </span>
              </div>
            </div>

            {/* Tailoring Blueprint Specs Card */}
            <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-zinc-200 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100">
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-heading font-bold text-[11px] text-zinc-950">Tailoring Specs</span>
                  {item.recommendedFit && (
                    <span className="text-[10px] text-zinc-500">· Fit: <strong className="text-zinc-800">{item.recommendedFit}</strong></span>
                  )}
                </div>

                <span className="px-1.5 py-0.2 rounded bg-zinc-950 text-white text-[9px] font-bold">
                  Tag: {selectedSize || item.tagSize}
                </span>
              </div>

              {/* Dynamic Size Selection Pills */}
              {item.sizeInventory && Object.keys(item.sizeInventory).length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap py-0.5">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold">Size:</span>
                  {Object.entries(item.sizeInventory)
                    .filter(([_, q]) => q > 0)
                    .map(([sz, qty]) => {
                      const isSelected = selectedSize === sz;
                      const szPrice = item.hasCustomSizePricing && item.sizePricing && item.sizePricing[sz]
                        ? item.sizePricing[sz]
                        : null;

                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all flex items-center gap-1 shadow-2xs ${
                            isSelected
                              ? 'bg-zinc-950 text-white ring-1 ring-zinc-950'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                          }`}
                        >
                          <span>{sz}</span>
                          {szPrice && (
                            <span className={`text-[9px] font-mono ${isSelected ? 'text-amber-300' : 'text-orange-700'}`}>
                              ({formatPhp(szPrice)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}

              {/* 4-Column Inline Measurements Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {!isPants ? (
                  <>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">P2P Width</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-950 block">
                        {item.measurements.pitToPitInches > 0 ? `${item.measurements.pitToPitInches}"` : '—'}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Length</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-950 block">
                        {item.measurements.lengthInches > 0 ? `${item.measurements.lengthInches}"` : '—'}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Shoulder</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-950 block">
                        {item.measurements.shoulderDropInches ? `${item.measurements.shoulderDropInches}"` : '—'}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Density / GSM</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-amber-700 block">
                        {item.condition.fabricGsm ? `${item.condition.fabricGsm} GSM` : (item.measurements.sleeveInches ? `${item.measurements.sleeveInches}"` : '—')}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Outseam</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-950 block">
                        {item.measurements.lengthInches > 0 ? `${item.measurements.lengthInches}"` : '—'}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Leg Opening</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-950 block">
                        {item.measurements.bottomHemInches ? `${item.measurements.bottomHemInches}"` : '—'}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Waist</span>
                      <span className="font-mono font-bold text-xs sm:text-zinc-950 block">
                        {item.tagSize}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Cut</span>
                      <span className="font-mono font-bold text-[11px] text-zinc-950 block truncate">
                        {item.silhouette || 'Cargo'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Merged Condition, Transparency & Editorial Micro-Box */}
            <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-zinc-200 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-[10px]">
                    {item.condition.grade}
                  </span>
                  <span className="font-mono font-bold text-[11px] text-orange-700">
                    {item.condition.ratingValue} / 10
                  </span>
                </div>

                {item.condition.isSanitized && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Eco-Steamed</span>
                  </span>
                )}
              </div>

              {/* Curator Notes & Description */}
              <div className="text-[11px] text-zinc-600 bg-zinc-50/70 p-2 rounded-lg border border-zinc-100 leading-snug">
                <p className="line-clamp-2">
                  <strong className="text-zinc-900">Curator: </strong>
                  {item.condition.defectsSummary || item.description}
                </p>
              </div>

              {/* Hashtag Pills */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.2 rounded bg-zinc-50 border border-zinc-200 text-[9px] font-mono text-zinc-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 3. Related Pieces for Mobile Scrolling (`lg:hidden`) */}
      {relatedItems.length > 0 && (
        <div className="lg:hidden px-3 sm:px-6 py-6 border-t border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-700">
              Archival Silhouettes
            </span>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-mono font-bold text-zinc-600 hover:text-black transition-colors"
            >
              View Full Rack →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {relatedItems.map(rel => (
              <ProductCard key={rel.id} item={rel} onClick={() => navigate(`/drops/${rel.id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Mobile Sticky Bottom Action Bar (`sm:hidden`) */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 p-2.5 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-40 flex items-center justify-between gap-2 shadow-lg font-mono">
        <div className="min-w-0">
          <span className="text-[9px] text-zinc-400 block truncate">
            {item.stockQuantity && item.stockQuantity > 1 ? `${item.stockQuantity} pcs` : '1-of-1'} · {selectedSize || item.tagSize}
          </span>
          <span className="font-bold text-base text-zinc-950 block truncate">
            {formatPhp(currentActivePrice)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => openChatWithProduct(item)}
            className="p-2 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800 shrink-0"
            title="Chat Stylist"
          >
            <MessageSquareText className="w-4 h-4 text-orange-600" />
          </button>

          {!item.isSoldOut ? (
            <>
              <button
                onClick={handleAddToCart}
                className="h-9 px-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 font-mono font-bold text-xs flex items-center gap-1 shadow-2xs shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-700" />
                <span>+ Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="h-9 px-3.5 rounded-lg bg-zinc-950 text-white font-mono font-bold text-xs flex items-center gap-1 shadow-xs shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                <span>Buy Now</span>
              </button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="h-9 px-3 text-[11px] font-bold text-zinc-400"
            >
              Claimed
            </Button>
          )}
        </div>
      </div>

    </div>
  );
};
