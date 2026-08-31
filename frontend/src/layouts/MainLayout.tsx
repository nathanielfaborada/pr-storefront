import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header.tsx';
import { Footer } from '../components/layout/Footer.tsx';
import { CustomerSidebar } from '../components/layout/CustomerSidebar.tsx';
import { SearchModal } from '../components/layout/SearchModal.tsx';
import { WishlistDrawer } from '../components/layout/WishlistDrawer.tsx';
import { CartDrawer } from '../components/cart/CartDrawer.tsx';
import { CheckoutModal } from '../components/checkout/CheckoutModal.tsx';
import { AuthModal } from '../components/auth/AuthModal.tsx';
import { ChatDrawer } from '../components/chat/ChatDrawer.tsx';
import { useCart } from '../context/CartContext.tsx';
import { INITIAL_PRODUCTS } from '../data/products.ts';
import { Item, OrderPayload } from '../types/index.ts';
import { AlertCircle, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { expiredAlertItem, dismissExpiredAlert } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [products] = useState<Item[]>(INITIAL_PRODUCTS);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSelectProduct = (item: Item) => {
    navigate(`/drops/${item.id}`);
  };

  const handleOrderCompleted = (order: OrderPayload) => {
    navigate(`/orders/${order.orderId}`, { state: { order } });
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

      {/* Expired Hold Floating Alert */}
      {expiredAlertItem && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md w-[90%] font-mono">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs leading-tight">
            Your 15-minute hold on <strong>"{expiredAlertItem}"</strong> has expired and returned to the racks.
          </p>
          <button
            onClick={dismissExpiredAlert}
            className="p-1 hover:bg-red-100 rounded-lg shrink-0 transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* 3. Page Content */}
      <main className="flex-1">
        <Outlet context={{ openCheckout: () => setIsCheckoutOpen(true) }} />
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

      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Social Google/Facebook Auth Modal */}
      <AuthModal />

      {/* Live Stylist Concierge DM Drawer */}
      <ChatDrawer />
    </div>
  );
};
