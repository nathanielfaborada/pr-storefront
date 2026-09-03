import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { openChatWithProduct } = useChat();
  const { toggleWishlist, isWishlisted } = useWishlist();

  if (!item) return null;

  const wishlisted = isWishlisted(item.id);

  const handleAddToCart = () => {
    addToCart(item);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(item);
    onClose();
    navigate('/checkout');
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
              className={`p-2 rounded-full border transition-all ${
                wishlisted
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-zinc-200 text-zinc-600 hover:text-black'
              }`}
              title="Save to Watchlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            
            {/* Left: Interactive Media Gallery */}
            <div className="w-full">
              <MultiAngleGallery
                images={item.images}
                fitpicUrls={item.fitpicUrls}
                videoUrl={item.videoUrl}
                title={item.title}
              />
            </div>

            {/* Right: Garment Specs & Architecture */}
            <div className="space-y-4">
              
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
                  <span>{item.brand}</span>
                  <span>SKU: {item.id}</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-zinc-950 leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Fit Guide Badge */}
              <FitGuideBadge
                tagSize={item.tagSize}
                recommendedFit={item.recommendedFit}
              />

              {/* Tailoring Measurement Box */}
              <MeasurementBox
                measurements={item.measurements}
                category={item.category}
              />

              {/* Condition Report */}
              <ConditionGradeCard condition={item.condition} />

              {/* Curator Editorial Notes */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900">
                  Archival Curator Notes
                </h4>
                <p className="text-xs font-mono text-zinc-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
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
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
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
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onChatSeller={handleChatSeller}
          />
        </div>

      </div>
    </div>
  );
};
