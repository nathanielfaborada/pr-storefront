import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useFilter } from '../../context/FilterContext.tsx';
import { useChat } from '../../context/ChatContext.tsx';
import { PRMonogramLogo } from '../common/PRMonogramLogo.tsx';
import {
  ShoppingBag,
  Heart,
  Package,
  MessageSquare,
  User,
  X,
  Clock,
  Lock
} from 'lucide-react';
import { CategoryType } from '../../types/index.ts';

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const { wishlistIds, setIsWishlistOpen } = useWishlist();
  const { selectedCategory, setSelectedCategory } = useFilter();
  const { setIsChatOpen, unreadCount } = useChat();

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Releases' },
    { id: 'boxy-tees', label: 'Boxy Tees' },
    { id: 'cropped-hoodies', label: 'Cropped Hoodies' },
    { id: 'parachute-cargos', label: 'Parachute & Cargos' },
    { id: 'techwear-outerwear', label: 'Outerwear & Jackets' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const handleSelectCategory = (catId: CategoryType) => {
    setSelectedCategory(catId);
    if (location.pathname !== '/') {
      navigate('/');
    }
    onClose();
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
    onClose();
  };

  const handleOpenWishlist = () => {
    setIsWishlistOpen(true);
    onClose();
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-white text-zinc-900 border-r border-zinc-200 flex flex-col justify-between transition-transform duration-200 ease-out shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <PRMonogramLogo size="sm" showSubtitle={true} />
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5">
          {/* Categories Navigation */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 block">
              Categories
            </span>
            <div className="space-y-0.5 font-mono">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    (selectedCategory === cat.id) || (cat.id === 'all' && !selectedCategory)
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Quick Links */}
          <div className="space-y-1 pt-2 border-t border-zinc-100 font-mono">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 block">
              Concierge
            </span>

            <button
              onClick={handleOpenCart}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-zinc-700" />
                <span>Shopping Bag</span>
              </div>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-950 text-white font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={handleOpenWishlist}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-zinc-700" />
                <span>Wishlist</span>
              </div>
              {wishlistIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 text-zinc-600 font-bold">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              onClick={handleOpenChat}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span>Chat Stylist</span>
              </div>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              )}
            </button>
          </div>

        </div>

        {/* 3. Studio Footer Info & Locked Sign In */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/60 space-y-2 font-mono">
          <button
            type="button"
            disabled
            title="Customer Sign In is locked for this demo"
            className="w-full py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-400 text-xs font-bold flex items-center justify-between opacity-60 cursor-not-allowed shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign In / Sign Up</span>
            </div>
            <span className="text-[9px] bg-zinc-200 text-zinc-500 px-1.5 py-0.2 rounded flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" />
              Locked
            </span>
          </button>

          <div className="text-center pt-0.5">
            <p className="text-[11px] font-bold text-zinc-950">P&amp;R Thrift &amp; Style</p>
            <span className="text-[10px] text-zinc-400 block">
              Archival Studio · Pandi, Bulacan
            </span>
          </div>
        </div>

      </aside>
    </>
  );
};
