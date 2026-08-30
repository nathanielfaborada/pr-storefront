import React from 'react';
import { MessageSquareText, Zap, ShieldAlert } from 'lucide-react';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Button } from '../common/Button.tsx';

interface StickyActionDockProps {
  item: Item;
  onMine: () => void;
  onChatSeller: () => void;
}

export const StickyActionDock: React.FC<StickyActionDockProps> = ({ item, onMine, onChatSeller }) => {
  return (
    <div className="fixed sm:static bottom-0 left-0 right-0 z-40 bg-white border-t sm:border-t-0 border-zinc-200 p-4 sm:p-0 shadow-lg sm:shadow-none">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Price display */}
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
            1-of-1 Curated Drop
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-2xl text-zinc-950">
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
          {/* Chat Seller Button */}
          <button
            onClick={onChatSeller}
            className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 font-mono font-semibold text-xs transition-colors shadow-sm"
            title="Inquire with Stylist"
          >
            <MessageSquareText className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Chat Stylist</span>
          </button>

          {/* Mine Button */}
          {!item.isSoldOut ? (
            <Button
              variant="primary"
              size="md"
              onClick={onMine}
              className="px-6 py-3 text-sm font-bold shadow-sm flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>Mine Piece</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              disabled
              className="px-5 py-3 text-xs uppercase tracking-wider font-mono font-bold text-zinc-400"
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
