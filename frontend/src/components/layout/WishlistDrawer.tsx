import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { Badge } from '../common/Badge.tsx';

interface WishlistDrawerProps {
  products: Item[];
  onSelectProduct: (item: Item) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ products, onSelectProduct }) => {
  const { wishlistIds, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistedItems = products.filter(item => wishlistIds.includes(item.id));

  return (
    <Modal
      isOpen={isWishlistOpen}
      onClose={() => setIsWishlistOpen(false)}
      drawerMode
      title={
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span className="font-heading font-bold text-base text-zinc-950">Vault Watchlist</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono">
            {wishlistedItems.length}
          </span>
        </div>
      }
    >
      {wishlistedItems.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-zinc-950">Your Vault Watchlist is Empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
            Save limited 1-of-1 streetwear silhouettes to track sizing availability before they're claimed.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-6"
            onClick={() => setIsWishlistOpen(false)}
          >
            Explore Active Drops
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {wishlistedItems.map(item => (
            <div
              key={item.id}
              className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex gap-3 group relative hover:border-zinc-300 transition-colors shadow-sm"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-18 h-22 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0 cursor-pointer"
                onClick={() => {
                  onSelectProduct(item);
                  setIsWishlistOpen(false);
                }}
              />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4
                    onClick={() => {
                      onSelectProduct(item);
                      setIsWishlistOpen(false);
                    }}
                    className="text-xs font-heading font-semibold text-zinc-900 hover:text-amber-700 transition-colors line-clamp-1 cursor-pointer mt-0.5"
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      Tag: <strong className="text-zinc-800">{item.tagSize}</strong>
                    </span>
                    {item.isSoldOut && <Badge variant="sold">Claimed</Badge>}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200">
                  <span className="font-mono font-bold text-xs text-zinc-950">
                    {formatPhp(item.pricePhp)}
                  </span>
                  {!item.isSoldOut && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        addToCart(item);
                        setIsWishlistOpen(false);
                      }}
                      className="text-[10px] py-1 px-3 shadow-sm"
                    >
                      Mine
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
