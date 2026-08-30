import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { HoldTimerBanner } from './HoldTimerBanner.tsx';
import { CartItemRow } from './CartItemRow.tsx';
import { CartSummary } from './CartSummary.tsx';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    secondsRemaining,
    subtotalPhp,
    shippingFeePhp,
    totalPhp,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    onOpenCheckout();
  };

  return (
    <Modal
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      drawerMode
      title={
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-600" />
          <span className="font-heading font-bold text-base text-zinc-950">Your Bag</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono">
            {cart.length} {cart.length === 1 ? 'Piece' : 'Pieces'}
          </span>
        </div>
      }
    >
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-20 px-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-zinc-950">Your Bag is Empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed font-mono">
            Pieces are 1-of-1. Click <strong>"Mine"</strong> on any drop to engage an exclusive 15-minute reservation lock!
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-6 shadow-sm"
            onClick={() => setIsCartOpen(false)}
          >
            Browse Drop 08
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full -m-5">
          {/* 15-minute countdown progress banner */}
          <HoldTimerBanner secondsRemaining={secondsRemaining} />

          {/* Reserved Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.map(ci => (
              <CartItemRow
                key={ci.item.id}
                cartItem={ci}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Summary & Checkout Button */}
          <CartSummary
            subtotal={subtotalPhp}
            shipping={shippingFeePhp}
            total={totalPhp}
            onProceedToCheckout={handleCheckout}
          />
        </div>
      )}
    </Modal>
  );
};
