import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { FilterProvider } from './context/FilterContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ChatProvider } from './context/ChatContext.tsx';
import { AppRoutes } from './routes/AppRoutes.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <WishlistProvider>
            <CartProvider>
              <ChatProvider>
                <AppRoutes />
              </ChatProvider>
            </CartProvider>
          </WishlistProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
