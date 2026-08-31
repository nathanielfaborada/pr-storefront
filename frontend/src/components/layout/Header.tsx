import React from 'react';
import { Search, ShoppingBag, Menu, User } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useFilter } from '../../context/FilterContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { PRMonogramLogo } from '../common/PRMonogramLogo.tsx';

interface HeaderProps {
  onLogoClick?: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, onMenuClick }) => {
  const { cart, secondsRemaining, setIsCartOpen } = useCart();
  const { setIsSearchOpen } = useFilter();
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const totalCartCount = cart.length;
  const isHoldActive = secondsRemaining > 0 && totalCartCount > 0;

  const handleLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all border-b border-zinc-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-4">
        
        {/* Left: Menu Trigger & Search */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-orange-50/60 border border-zinc-200 hover:border-orange-300 transition-all font-mono text-xs font-semibold"
              title="Open Menu"
            >
              <Menu className="w-4 h-4 text-zinc-800" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl border border-transparent hover:border-zinc-200 transition-all text-xs"
            title="Search pieces (⌘K)"
          >
            <Search className="w-4 h-4 text-zinc-500 hover:text-orange-600 transition-colors" />
            <span className="hidden md:inline font-mono">Search...</span>
          </button>
        </div>

        {/* Center: Official P&R Monogram Logo & Wordmark */}
        <a
          href="#"
          onClick={handleLogo}
          className="cursor-pointer shrink-0"
        >
          <PRMonogramLogo size="sm" showSubtitle={true} className="sm:hidden" />
          <PRMonogramLogo size="md" showSubtitle={true} className="hidden sm:flex" />
        </a>

        {/* Right: Cart / Bag & Account */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* User Profile Avatar / Sign In */}
          {isAuthenticated && user ? (
            <button
              onClick={() => navigate('/account')}
              className="p-1 rounded-xl hover:bg-zinc-100 transition-colors"
              title="My Account"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 text-xs font-mono font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Bag / Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all text-xs font-mono font-bold shadow-xs ${
              isHoldActive
                ? 'bg-orange-50 text-orange-950 border border-orange-300 shadow-orange-500/10'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'
            }`}
            title="Open Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Bag</span>
            {totalCartCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
            )}

            {/* Live Hold Timer inside Cart button */}
            {isHoldActive && (
              <span className="font-mono text-orange-600 text-[11px] sm:text-xs pl-1 border-l border-orange-200">
                {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
