import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item, CartItem } from '../types/index.ts';
import { safeLocalStorage } from '../utils/index.ts';

const CART_STORAGE_KEY = 'pr_shopper_cart';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item) => boolean;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotalPhp: number;
  shippingFeePhp: number;
  totalPhp: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = safeLocalStorage.get<CartItem[]>(CART_STORAGE_KEY, []);
    return saved.map(ci => ({
      ...ci,
      quantity: typeof ci.quantity === 'number' && ci.quantity > 0 ? ci.quantity : 1,
    }));
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize cart with LocalStorage
  useEffect(() => {
    safeLocalStorage.set(CART_STORAGE_KEY, cart);
  }, [cart]);

  const addToCart = (item: Item): boolean => {
    if (item.isSoldOut) return false;

    setCart(prev => {
      const existsIndex = prev.findIndex(ci => ci.item.id === item.id);
      if (existsIndex !== -1) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          quantity: (updated[existsIndex].quantity || 1) + 1,
        };
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(ci => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotalPhp = cart.reduce(
    (sum, ci) => sum + ci.item.pricePhp * (ci.quantity || 1),
    0
  );
  const shippingFeePhp = subtotalPhp >= 2500 || subtotalPhp === 0 ? 0 : 99;
  const totalPhp = subtotalPhp + shippingFeePhp;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotalPhp,
        shippingFeePhp,
        totalPhp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
