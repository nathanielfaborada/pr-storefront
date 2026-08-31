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
  Clock
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
  const { cart, secondsRemaining, setIsCartOpen } = useCart();
  const { wishlistIds, setIsWishlistOpen } = useWishlist();
  const { selectedCategory, setSelectedCategory } = useFilter();
  const { setIsChatOpen, unreadCount } = useChat();

  const isHoldActive = secondsRemaining > 0 && cart.length > 0;

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
          
          {/* Active Cart Hold Banner */}
          {isHoldActive && (
            <div
              onClick={handleOpenCart}
              className="p-3 bg-orange-50 rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-100/70 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 text-orange-950 font-bold">
                <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
                <span>Bag Hold Active</span>
              </div>
              <span className="bg-orange-500 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Categories Navigation */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 block">
              Categories
            </span>

            {categories.map(cat => {
              const isSelected = (selectedCategory === cat.id) || (cat.id === 'all' && !selectedCategory);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Shopper Links */}
          <div className="space-y-1 pt-3 border-t border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 block">
              My Shopping
            </span>

            <button
              onClick={handleOpenCart}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>My Bag</span>
              </div>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500 text-white font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={handleOpenWishlist}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Wishlist</span>
              </div>
              {wishlistIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-600 font-bold border border-red-200">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                navigate('/account');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-zinc-700" />
                <span>Track Order</span>
              </div>
              <span className="text-zinc-400 text-xs">→</span>
            </button>

            <button
              onClick={handleOpenChat}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-medium transition-colors"
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

        {/* 3. Footer Auth */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/60">
          {isAuthenticated && user ? (
            <div
              onClick={() => {
                navigate('/account');
                onClose();
              }}
              className="flex items-center justify-between cursor-pointer p-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Member Active</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400">→</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                onClose();
              }}
              className="w-full py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>

      </aside>
    </>
  );
};
