import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
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
    updateQuantity,
    removeFromCart,
    subtotalPhp,
    shippingFeePhp,
    totalPhp,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    onOpenCheckout();
  };

  const totalItemsCount = cart.reduce((sum, ci) => sum + (ci.quantity || 1), 0);

  return (
    <Modal
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      drawerMode
      title={
        <div className="flex items-center gap-2 font-mono">
          <ShoppingBag className="w-4 h-4 text-orange-600" />
          <span className="font-heading font-bold text-base text-zinc-950">Shopping Bag</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-bold border border-zinc-200">
            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      }
    >
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-20 px-4 font-mono">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 shadow-2xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-zinc-950">Your Bag is Empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
            Looks like you haven't added any curated streetwear pieces to your bag yet.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-6 shadow-xs font-bold text-xs"
            onClick={() => setIsCartOpen(false)}
          >
            Browse Digital Racks
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full -m-5">
          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.map(ci => (
              <CartItemRow
                key={ci.item.id}
                cartItem={ci}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Pricing Summary & Checkout Action */}
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
