import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../common/Button.tsx';
import {
  Menu,
  Plus,
  ChevronDown,
  User,
  ExternalLink,
  LogOut
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  activeTab: 'racks' | 'payments' | 'dispatch' | 'holds';
  onOpenSidebar: () => void;
  onOpenProfileModal: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  activeTab,
  onOpenSidebar,
  onOpenProfileModal,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMobileTitle = () => {
    switch (activeTab) {
      case 'racks':
        return 'Inventory';
      case 'payments':
        return 'Orders';
      case 'dispatch':
        return 'Waybills';
      case 'holds':
        return 'Holds';
      default:
        return title;
    }
  };

  return (
    <header className="bg-white px-2.5 py-1.5 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 flex items-center justify-between gap-2 shadow-xs">
      {/* Left: Mobile Menu Toggle + Title */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg sm:rounded-xl border border-zinc-200 lg:hidden shrink-0"
          title="Open Studio Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <h1 className="font-heading text-sm sm:text-lg font-bold tracking-tight text-zinc-950 truncate">
            <span className="sm:hidden">{getMobileTitle()}</span>
            <span className="hidden sm:inline">{title}</span>
          </h1>
          <p className="hidden sm:block text-xs text-zinc-500 font-mono mt-0.5 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: + Add Piece CTA + User Profile Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/admin/drops/new')}
          className="h-8 text-xs font-bold shadow-xs flex items-center gap-1 px-2.5 sm:px-3.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Add Piece</span>
        </Button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all bg-white shadow-2xs"
          >
            <div className="relative">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 border border-white" />
            </div>

            <div className="hidden sm:block text-left text-xs leading-tight">
              <p className="font-bold text-zinc-900 whitespace-nowrap">{user?.name || 'Curator'}</p>
              <span className="text-[10px] text-zinc-400 font-mono block">Pandi Hub</span>
            </div>

            <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border border-zinc-200 shadow-lg py-1.5 z-30 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-zinc-100">
                <p className="font-bold text-zinc-950 truncate">{user?.name || 'Curator'}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user?.email || 'admin@prstorefront.com'}</p>
              </div>

              <button
                onClick={() => {
                  onOpenProfileModal();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-zinc-700 hover:text-zinc-950 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin Profile &amp; Settings</span>
              </button>

              <button
                onClick={() => {
                  navigate('/');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-zinc-700 hover:text-zinc-950 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                <span>View Storefront</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 font-semibold border-t border-zinc-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
