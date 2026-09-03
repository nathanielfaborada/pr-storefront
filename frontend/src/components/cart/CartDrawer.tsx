import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { Button } from '../common/Button.tsx';
import { CartItemRow } from './CartItemRow.tsx';
import { CartSummary } from './CartSummary.tsx';

interface CartDrawerProps {
  onOpenCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotalPhp,
    shippingFeePhp,
    totalPhp,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const totalItemsCount = cart.reduce((sum, ci) => sum + (ci.quantity || 1), 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-mono">
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      {/* 2. Slide-out Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-white border-l border-zinc-200 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-zinc-900">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-zinc-950">Shopping Bag</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-950 text-white font-bold font-mono">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">P&amp;R Archival Streetwear Vault</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            title="Close Shopping Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-2xs">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base text-zinc-950">Your Bag is Empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                No curated streetwear pieces in your bag yet. Browse our live Drop 08 collection!
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="mt-2 font-bold text-xs shadow-xs cursor-pointer"
              onClick={() => setIsCartOpen(false)}
            >
              Browse Digital Racks
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Items Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-zinc-50/50">
              {cart.map(ci => (
                <CartItemRow
                  key={ci.item.id}
                  cartItem={ci}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Fixed Bottom Summary & Checkout CTA */}
            <CartSummary
              subtotal={subtotalPhp}
              shipping={shippingFeePhp}
              total={totalPhp}
              onProceedToCheckout={handleCheckout}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
