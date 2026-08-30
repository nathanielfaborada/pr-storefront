import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { safeLocalStorage } from '../utils/index.ts';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (itemId: string) => void;
  removeFromWishlist: (itemId: string) => void;
  isWishlisted: (itemId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'pr_shopper_wishlist';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => 
    safeLocalStorage.get<string[]>(WISHLIST_STORAGE_KEY, [])
  );
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    safeLocalStorage.set(WISHLIST_STORAGE_KEY, wishlistIds);
  }, [wishlistIds]);

  const toggleWishlist = (itemId: string) => {
    setWishlistIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== itemId));
  };

  const isWishlisted = (itemId: string) => wishlistIds.includes(itemId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
