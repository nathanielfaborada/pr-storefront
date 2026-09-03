import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header.tsx';
import { Footer } from '../components/layout/Footer.tsx';
import { CustomerSidebar } from '../components/layout/CustomerSidebar.tsx';
import { SearchModal } from '../components/layout/SearchModal.tsx';
import { WishlistDrawer } from '../components/layout/WishlistDrawer.tsx';
import { CartDrawer } from '../components/cart/CartDrawer.tsx';
import { AuthModal } from '../components/auth/AuthModal.tsx';
import { ChatDrawer } from '../components/chat/ChatDrawer.tsx';
import { INITIAL_PRODUCTS } from '../data/products.ts';
import { Item } from '../types/index.ts';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [products] = useState<Item[]>(INITIAL_PRODUCTS);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSelectProduct = (item: Item) => {
    navigate(`/drops/${item.id}`);
  };

  // If on Admin routes (/admin, /admin/drops/new, /admin/login), render clean Admin Studio viewport without customer footer or customer drawers
  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-950">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  // Customer / Shopper Public Layout
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-950 selection:bg-orange-500 selection:text-white">
      {/* 1. Masthead Header */}
      <Header
        onLogoClick={() => navigate('/')}
        onMenuClick={() => setIsCustomerMenuOpen(true)}
      />

      {/* Customer Drawer Sidebar */}
      <CustomerSidebar
        isOpen={isCustomerMenuOpen}
        onClose={() => setIsCustomerMenuOpen(false)}
      />

      {/* 3. Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 4. Customer Global Footer */}
      <Footer />

      {/* Global Customer Modals & Drawers */}
      <SearchModal
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      <WishlistDrawer
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Slide-out Shopping Bag Drawer */}
      <CartDrawer />

      {/* Social Google/Facebook Auth Modal */}
      <AuthModal />

      {/* Live Stylist Concierge DM Drawer */}
      <ChatDrawer />
    </div>
  );
};

export default MainLayout;
