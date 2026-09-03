import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Zap,
  MessageSquare,
  Ruler,
  CheckCircle2,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Item } from '../../types/index.ts';
import { productService } from '../../services/productService.ts';
import { MultiAngleGallery } from '../../components/pdp/MultiAngleGallery.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useChat } from '../../context/ChatContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { formatPhp } from '../../utils/index.ts';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
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

    productService.getById(id).then((fetchedItem) => {
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
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center font-mono">
        <div className="animate-pulse space-y-4 max-w-sm mx-auto">
          <div className="w-full aspect-[4/5] bg-zinc-200 rounded-2xl" />
          <div className="h-6 bg-zinc-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-zinc-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center font-mono space-y-4">
        <h2 className="font-heading text-2xl font-bold text-zinc-950">Piece Not Found</h2>
        <p className="text-zinc-500 text-xs max-w-xs mx-auto">
          This piece might have been claimed or the URL is invalid.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors shadow-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(item.id);
  const isPants = item.category === 'parachute-cargos';

  const currentActivePrice = item.hasCustomSizePricing && item.sizePricing && selectedSize && item.sizePricing[selectedSize]
    ? item.sizePricing[selectedSize]
    : item.pricePhp;

  return (
    <div className="font-mono bg-white min-h-screen pb-24 sm:pb-12 text-zinc-950">
      
      {/* 1. Clean Top Breadcrumb Strip */}
      <div className="border-b border-zinc-100 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </button>

          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {item.dropNumber} · {item.id}
          </span>
        </div>
      </div>

      {/* 2. Main Product Layout */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* LEFT: Multi-Angle Gallery */}
          <div className="lg:col-span-6 w-full">
            <MultiAngleGallery
              images={item.images}
              fitpicUrls={item.fitpicUrls}
              videoUrl={item.videoUrl}
              title={item.title}
            />
          </div>

          {/* RIGHT: Consolidated Clean Product Details & CTAs */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Header: Brand, Title, Price */}
            <div className="space-y-1.5 pb-3 border-b border-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
                {item.brand || 'P&R Archival Studio'}
              </span>

              <h1 className="font-heading font-extrabold text-lg sm:text-2xl text-zinc-950 leading-tight">
                {item.title}
              </h1>

              {/* Price & Stock Badge */}
              <div className="flex items-baseline justify-between pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-zinc-950">
                    {formatPhp(currentActivePrice)}
                  </span>
                  {item.originalEstimatedPricePhp && (
                    <span className="text-xs text-zinc-400 line-through">
                      Est. {formatPhp(item.originalEstimatedPricePhp)}
                    </span>
                  )}
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.isSoldOut
                    ? 'bg-zinc-100 text-zinc-400'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {item.isSoldOut
                    ? 'Sold Out'
                    : item.stockQuantity && item.stockQuantity > 1
                    ? `${item.stockQuantity} Pieces In Stock`
                    : '1-of-1 Vault Item'}
                </span>
              </div>
            </div>

            {/* Size Selector (If multiple sizes exist) */}
            {item.sizeInventory && Object.keys(item.sizeInventory).length > 1 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Select Size:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(item.sizeInventory)
                    .filter(([_, q]) => q > 0)
                    .map(([sz, _]) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-950 text-white shadow-sm'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          Size {sz}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Measurements Grid */}
            <div className="bg-zinc-50/80 rounded-2xl p-3 border border-zinc-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-orange-600" />
                  <span>Tailoring Measurements</span>
                </span>
                <span className="text-[10px] text-zinc-500">
                  Tag: <strong className="text-zinc-950">{selectedSize || item.tagSize}</strong> · {item.recommendedFit || 'Boxy Fit'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {!isPants ? (
                  <>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Pit-to-Pit</span>
                      <span className="font-bold text-zinc-950 block mt-0.5">{item.measurements.pitToPitInches}"</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Length</span>
                      <span className="font-bold text-zinc-950 block mt-0.5">{item.measurements.lengthInches}"</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Shoulder</span>
                      <span className="font-bold text-zinc-950 block mt-0.5">{item.measurements.shoulderDropInches || '—'}"</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Density</span>
                      <span className="font-bold text-orange-700 block mt-0.5">{item.condition.fabricGsm ? `${item.condition.fabricGsm} GSM` : '—'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Outseam</span>
                      <span className="font-bold text-zinc-950 block mt-0.5">{item.measurements.lengthInches}"</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Hem Opening</span>
                      <span className="font-bold text-zinc-950 block mt-0.5">{item.measurements.bottomHemInches}"</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Waist</span>
                      <span className="font-bold text-zinc-950 block mt-0.5">{item.tagSize}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Silhoutte</span>
                      <span className="font-bold text-zinc-950 block mt-0.5 truncate">{item.silhouette}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Condition & Description */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Condition: {item.condition.grade}
                </span>
                <span className="text-zinc-600 font-bold text-xs">
                  {item.condition.ratingValue}/10
                </span>
                {item.condition.isSanitized && (
                  <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1 ml-auto">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Pre-Washed &amp; Sanitized</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Desktop Direct Primary Action Toolbar */}
            <div className="hidden sm:block space-y-2 pt-2">
              {!item.isSoldOut ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-11 px-4 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag — {formatPhp(currentActivePrice)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="h-11 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(item.id)}
                    className="h-11 w-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-orange-500 text-orange-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openChatWithProduct(item)}
                    className="h-11 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    title="Ask stylist about fit"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                    <span>Stylist</span>
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full h-11 rounded-xl bg-zinc-200 text-zinc-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                >
                  Sold Out / Claimed
                </button>
              )}

              {/* Courier Delivery Tag */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                <span>Express Courier Dispatch from Pandi Studio · 100% Authentic</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 4. Mobile Sticky Bottom Action Bar (`sm:hidden`) */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-40 flex items-center justify-between gap-2.5 shadow-lg font-mono">
        <div className="min-w-0">
          <span className="text-[10px] text-zinc-400 block truncate">
            {selectedSize || item.tagSize} · {item.stockQuantity && item.stockQuantity > 1 ? `${item.stockQuantity} left` : '1-of-1'}
          </span>
          <span className="font-bold text-base text-zinc-950 block leading-none truncate">
            {formatPhp(currentActivePrice)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => openChatWithProduct(item)}
            className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800"
            title="Chat Stylist"
          >
            <MessageSquare className="w-4 h-4 text-orange-600" />
          </button>

          {!item.isSoldOut ? (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-10 px-3 rounded-xl bg-white border border-zinc-300 text-zinc-950 font-bold text-xs flex items-center gap-1 shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="h-10 px-4 rounded-xl bg-zinc-950 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                <span>Buy Now</span>
              </button>
            </>
          ) : (
            <button
              disabled
              className="h-10 px-4 rounded-xl bg-zinc-200 text-zinc-400 text-xs font-bold cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;
