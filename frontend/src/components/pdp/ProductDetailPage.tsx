import React, { useEffect } from 'react';
import { ArrowLeft, Heart, Sparkles, ChevronRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Item } from '../../types/index.ts';
import { MultiAngleGallery } from './MultiAngleGallery.tsx';
import { FitGuideBadge } from './FitGuideBadge.tsx';
import { MeasurementBox } from './MeasurementBox.tsx';
import { ConditionGradeCard } from './ConditionGradeCard.tsx';
import { StickyActionDock } from './StickyActionDock.tsx';
import { Badge } from '../common/Badge.tsx';
import { ProductCard } from '../catalog/ProductCard.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useChat } from '../../context/ChatContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { formatPhp } from '../../utils/index.ts';

interface ProductDetailPageProps {
  item: Item;
  allProducts: Item[];
  onBack: () => void;
  onSelectProduct: (item: Item) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  allProducts,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { openChatWithProduct } = useChat();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(item.id);

  // Scroll to top when loading a new product page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [item.id]);

  const handleMine = () => {
    addToCart(item);
  };

  const handleChatSeller = () => {
    openChatWithProduct(item);
  };

  // Related products from the same or other categories (excluding current item)
  const relatedProducts = allProducts
    .filter(p => p.id !== item.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-zinc-950 pb-20 animate-in fade-in duration-200">
      
      {/* Navigation Top Bar / Breadcrumb */}
      <div className="border-b border-zinc-200 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 font-mono text-xs">
          
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 font-semibold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-600" />
            <span>Back to Drop 08</span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 truncate">
            <span className="hover:text-zinc-900 cursor-pointer" onClick={onBack}>Drops</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="uppercase font-semibold text-zinc-700">{item.category.replace('-', ' ')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate text-zinc-950 font-bold">{item.title}</span>
          </div>

          {/* Wishlist quick toggle */}
          <button
            onClick={() => toggleWishlist(item.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold transition-colors shadow-sm shrink-0"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-amber-500 text-amber-500' : 'text-zinc-500'}`} />
            <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Watchlist'}</span>
          </button>

        </div>
      </div>

      {/* Main Editorial PDP Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Multi-Angle High-Res Gallery, Fitpics & Video Loop (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <MultiAngleGallery
              images={item.images}
              fitpicUrls={item.fitpicUrls}
              videoUrl={item.videoUrl}
              title={item.title}
            />

            {/* Garment Assurance Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Curated 1-of-1 Authenticity</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700">
                <RefreshCw className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Hand-Measured Fits</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700">
                <Truck className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Metro Manila Same-Day</span>
              </div>
            </div>
          </div>

          {/* Right Column: Garment Specs, Tailoring Blueprint & Mine Action (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Badges & Drop Tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="gold">1-of-1 Curated Drop</Badge>
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  {item.dropNumber}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">SKU: {item.id}</span>
            </div>

            {/* Title & Brand */}
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
                {item.brand}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 mt-1 leading-tight tracking-tight">
                {item.title}
              </h1>
            </div>

            {/* Price Row */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-baseline justify-between font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  Curated Archive Price
                </span>
                <span className="font-bold text-3xl text-zinc-950">
                  {formatPhp(item.pricePhp)}
                </span>
              </div>
              {item.originalEstimatedPricePhp && (
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase">Est. Retail Value</span>
                  <span className="text-xs text-zinc-500 line-through">
                    {formatPhp(item.originalEstimatedPricePhp)}
                  </span>
                </div>
              )}
            </div>

            {/* Tag Size vs Recommended Fit */}
            <FitGuideBadge
              tagSize={item.tagSize}
              recommendedFit={item.recommendedFit}
            />

            {/* Hand-Measured Blueprint Box */}
            <MeasurementBox
              measurements={item.measurements}
              category={item.category}
            />

            {/* Condition Grade Card */}
            <ConditionGradeCard condition={item.condition} />

            {/* Archival Description & Tags */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                Archival Story &amp; Fit Details
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop Action Dock */}
            <div className="hidden sm:block pt-4 border-t border-zinc-200">
              <StickyActionDock
                item={item}
                onMine={handleMine}
                onChatSeller={handleChatSeller}
              />
            </div>

          </div>

        </div>

        {/* Related Drops Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest">
                  More 1-of-1 Pieces
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5">
                  Related Drop 08 Silhouettes
                </h2>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-mono font-semibold text-zinc-600 hover:text-black transition-colors"
              >
                View Full Archive →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  item={p}
                  onClick={() => onSelectProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Fixed Sticky Action Dock at Bottom */}
      <div className="block sm:hidden">
        <StickyActionDock
          item={item}
          onMine={handleMine}
          onChatSeller={handleChatSeller}
        />
      </div>

    </div>
  );
};
