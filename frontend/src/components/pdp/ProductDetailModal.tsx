import React from 'react';
import { X, Heart } from 'lucide-react';
import { Item } from '../../types/index.ts';
import { MultiAngleGallery } from './MultiAngleGallery.tsx';
import { FitGuideBadge } from './FitGuideBadge.tsx';
import { MeasurementBox } from './MeasurementBox.tsx';
import { ConditionGradeCard } from './ConditionGradeCard.tsx';
import { StickyActionDock } from './StickyActionDock.tsx';
import { Badge } from '../common/Badge.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useChat } from '../../context/ChatContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

interface ProductDetailModalProps {
  item: Item | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const { openChatWithProduct } = useChat();
  const { toggleWishlist, isWishlisted } = useWishlist();

  if (!item) return null;

  const wishlisted = isWishlisted(item.id);

  const handleMine = () => {
    addToCart(item);
    onClose();
  };

  const handleChatSeller = () => {
    openChatWithProduct(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main PDP Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-none sm:rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 text-zinc-900">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Badge variant="gold">1-of-1 Curated</Badge>
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline">
              {item.dropNumber} Archive
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(item.id)}
              className="p-2 text-zinc-500 hover:text-amber-600 rounded-lg hover:bg-zinc-100 transition-colors"
              title="Save piece"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-28 sm:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            
            {/* Left: Multi-angle Photography, Fitpics & 10s Video Loop */}
            <div>
              <MultiAngleGallery
                images={item.images}
                fitpicUrls={item.fitpicUrls}
                videoUrl={item.videoUrl}
                title={item.title}
              />
            </div>

            {/* Right: Garment Intelligence & Sizing */}
            <div className="space-y-5">
              
              {/* Brand & Title */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
                    {item.brand}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">SKU: {item.id}</span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-zinc-950 mt-1 leading-snug tracking-tight">
                  {item.title}
                </h2>
              </div>

              {/* Tag Size vs Recommended Fit comparison */}
              <FitGuideBadge
                tagSize={item.tagSize}
                recommendedFit={item.recommendedFit}
              />

              {/* Hand-Measured Specs Box */}
              <MeasurementBox
                measurements={item.measurements}
                category={item.category}
              />

              {/* Condition Grade & Transparency Notes */}
              <ConditionGradeCard condition={item.condition} />

              {/* Description & Archival Tags */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Archival Story &amp; Fit Details
                </h4>
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

              {/* Desktop Sticky Action Bar */}
              <div className="hidden sm:block pt-4 border-t border-zinc-200">
                <StickyActionDock
                  item={item}
                  onMine={handleMine}
                  onChatSeller={handleChatSeller}
                />
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Fixed Action Bar at Bottom */}
        <div className="block sm:hidden">
          <StickyActionDock
            item={item}
            onMine={handleMine}
            onChatSeller={handleChatSeller}
          />
        </div>

      </div>
    </div>
  );
};
