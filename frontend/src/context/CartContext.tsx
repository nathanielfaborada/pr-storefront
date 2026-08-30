import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item, CartItem } from '../types/index.ts';
import { safeLocalStorage, getOrGenerateSessionId } from '../utils/index.ts';

const CART_STORAGE_KEY = 'pr_shopper_cart';
const HOLD_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item) => boolean;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  secondsRemaining: number;
  isHoldWarning: boolean;
  subtotalPhp: number;
  shippingFeePhp: number;
  totalPhp: number;
  expiredAlertItem: string | null;
  dismissExpiredAlert: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = safeLocalStorage.get<CartItem[]>(CART_STORAGE_KEY, []);
    const now = Date.now();
    // Filter out expired items on initial load
    return saved.filter(ci => ci.holdExpiresAt > now);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isHoldWarning, setIsHoldWarning] = useState<boolean>(false);
  const [expiredAlertItem, setExpiredAlertItem] = useState<string | null>(null);

  // Synchronize cart with LocalStorage
  useEffect(() => {
    safeLocalStorage.set(CART_STORAGE_KEY, cart);
  }, [cart]);

  // Master Hold Countdown Timer Engine
  useEffect(() => {
    if (cart.length === 0) {
      setSecondsRemaining(0);
      setIsHoldWarning(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      let minRemainingSec = Infinity;
      const validItems: CartItem[] = [];
      let expiredFound = false;
      let expiredTitle = '';

      for (const ci of cart) {
        const remaining = Math.max(0, Math.ceil((ci.holdExpiresAt - now) / 1000));
        if (remaining > 0) {
          validItems.push(ci);
          if (remaining < minRemainingSec) {
            minRemainingSec = remaining;
          }
        } else {
          expiredFound = true;
          expiredTitle = ci.item.title;
          // Notify backend of release if available
          try {
            fetch('/api/cart/release', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                itemId: ci.item.id,
                sessionId: getOrGenerateSessionId(),
              }),
            }).catch(() => {});
          } catch {}
        }
      }

      if (expiredFound) {
        setCart(validItems);
        setExpiredAlertItem(expiredTitle);
      }

      if (validItems.length > 0 && minRemainingSec !== Infinity) {
        setSecondsRemaining(minRemainingSec);
        setIsHoldWarning(minRemainingSec <= 180); // <= 3 minutes
      } else {
        setSecondsRemaining(0);
        setIsHoldWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cart]);

  const addToCart = (item: Item): boolean => {
    if (item.isSoldOut) return false;

    // Check if already in cart
    const exists = cart.find(ci => ci.item.id === item.id);
    if (exists) {
      setIsCartOpen(true);
      return true;
    }

    const now = Date.now();
    const expiresAt = now + HOLD_DURATION_MS;

    const newCartItem: CartItem = {
      item: { ...item, isReserved: true, reservedUntil: expiresAt },
      heldAt: now,
      holdExpiresAt: expiresAt,
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);

    // Call backend hold API
    try {
      fetch('/api/cart/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          sessionId: getOrGenerateSessionId(),
        }),
      }).catch(() => {});
    } catch {}

    return true;
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));

    // Release hold on backend
    try {
      fetch('/api/cart/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          sessionId: getOrGenerateSessionId(),
        }),
      }).catch(() => {});
    } catch {}
  };

  const clearCart = () => {
    setCart([]);
  };

  const dismissExpiredAlert = () => {
    setExpiredAlertItem(null);
  };

  const subtotalPhp = cart.reduce((sum, ci) => sum + ci.item.pricePhp, 0);
  const shippingFeePhp = subtotalPhp >= 2500 || subtotalPhp === 0 ? 0 : 99;
  const totalPhp = subtotalPhp + shippingFeePhp;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        secondsRemaining,
        isHoldWarning,
        subtotalPhp,
        shippingFeePhp,
        totalPhp,
        expiredAlertItem,
        dismissExpiredAlert,
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
