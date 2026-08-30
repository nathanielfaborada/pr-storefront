import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, MessageSquareText, User as UserIcon, LogOut, Shield, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useFilter } from '../../context/FilterContext.tsx';
import { useChat } from '../../context/ChatContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const { cart, secondsRemaining, setIsCartOpen } = useCart();
  const { wishlistIds, setIsWishlistOpen } = useWishlist();
  const { setIsSearchOpen } = useFilter();
  const { setIsChatOpen, unreadCount, markAllAsRead } = useChat();
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.length;
  const isHoldActive = secondsRemaining > 0 && totalCartCount > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    markAllAsRead();
  };

  const handleLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Search Modal Trigger (Left) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all text-xs group"
            title="Search pieces (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-600 transition-colors" />
            <span className="hidden sm:inline font-mono">Search Drops...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 border border-zinc-300 rounded text-zinc-600">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Brand Logo & Wordmark (Center) */}
        <a
          href="#"
          onClick={handleLogo}
          className="flex flex-col items-center text-center group select-none cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tighter text-zinc-950 group-hover:text-amber-600 transition-colors">
              P&amp;R
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-amber-glow animate-pulse" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-zinc-500 group-hover:text-zinc-800 transition-colors">
            Streetwear &amp; Style
          </span>
        </a>

        {/* Action Triggers: Auth, Wishlist, Chat & Cart (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* User Auth Trigger / Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-zinc-50 transition-all text-xs font-mono"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-zinc-300"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline font-semibold text-zinc-900 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-zinc-200 shadow-xl p-3 z-50 font-mono text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <div 
                    onClick={() => {
                      navigate('/account');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="px-2 py-2 border-b border-zinc-100 pb-2 cursor-pointer hover:bg-zinc-50 rounded-xl transition-colors"
                  >
                    <p className="font-bold text-zinc-950 truncate hover:text-amber-700">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {user.provider} Verified Pass
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/account');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-zinc-800 hover:bg-zinc-100 transition-colors text-left"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>My Vault (Cart, Wishlist &amp; Orders)</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-zinc-800 hover:bg-zinc-100 transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Curator Vault Console</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Live Stylist Chat Trigger */}
          <button
            onClick={handleOpenChat}
            className="relative p-2.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl border border-transparent hover:border-zinc-200 transition-colors"
            title="Live Stylist Sizing DM"
          >
            <MessageSquareText className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl border border-transparent hover:border-zinc-200 transition-colors"
            title="Saved pieces"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-zinc-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Bag / Cart Trigger with 15-min Hold Pulse */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-xs font-heading font-semibold border ${
              isHoldActive
                ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-sm animate-pulseGlow'
                : 'bg-zinc-950 text-white hover:bg-zinc-800 border-zinc-950'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-black text-[10px] font-mono font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>

            {/* Desktop Hold Timer countdown inside header */}
            {isHoldActive && (
              <span className="hidden sm:inline font-mono font-bold text-amber-700 text-xs">
                {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
