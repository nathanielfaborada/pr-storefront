import React from 'react';
import { MessageSquareText, Zap, ShoppingBag, ShieldAlert } from 'lucide-react';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Button } from '../common/Button.tsx';

interface StickyActionDockProps {
  item: Item;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onMine?: () => void;
  onChatSeller: () => void;
}

export const StickyActionDock: React.FC<StickyActionDockProps> = ({
  item,
  onAddToCart,
  onBuyNow,
  onMine,
  onChatSeller,
}) => {
  const handleAdd = onAddToCart || onMine || (() => {});
  const handleBuy = onBuyNow || onMine || (() => {});

  return (
    <div className="fixed sm:static bottom-0 left-0 right-0 z-40 bg-white border-t sm:border-t-0 border-zinc-200 p-3 sm:p-0 shadow-lg sm:shadow-none font-mono">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Price display */}
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
            {item.stockQuantity && item.stockQuantity > 1 ? `${item.stockQuantity} Pieces Available` : '1-of-1 Curated Drop'}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-xl sm:text-2xl text-zinc-950">
              {formatPhp(item.pricePhp)}
            </span>
            {item.originalEstimatedPricePhp && (
              <span className="text-xs font-mono text-zinc-400 line-through">
                {formatPhp(item.originalEstimatedPricePhp)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Chat Stylist Button */}
          <button
            onClick={onChatSeller}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-orange-50 border border-zinc-300 hover:border-orange-300 text-zinc-800 hover:text-orange-950 font-mono font-semibold text-xs transition-colors shadow-xs"
            title="Chat with Stylist"
          >
            <MessageSquareText className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Chat</span>
          </button>

          {/* Add to Cart & Buy Now Buttons */}
          {!item.isSoldOut ? (
            <>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-mono font-bold text-xs transition-colors shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-700" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuy}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs transition-colors shadow-xs"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>Buy Now</span>
              </button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="md"
              disabled
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-mono font-bold text-zinc-400"
            >
              <ShieldAlert className="w-4 h-4 mr-1.5 text-red-500" />
              Claimed
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
