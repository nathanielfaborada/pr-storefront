import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { PRMonogramLogo } from '../common/PRMonogramLogo.tsx';
import {
  Shirt,
  Receipt,
  Truck,
  Boxes,
  MessageSquare,
  User,
  ExternalLink,
  LogOut,
  X,
  MapPin,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: 'racks' | 'payments' | 'dispatch' | 'supplies' | 'chats';
  onTabChange?: (tab: 'racks' | 'payments' | 'dispatch' | 'supplies' | 'chats') => void;
  onOpenProfileModal?: () => void;
  racksCount?: number;
  ordersCount?: number;
  suppliesCount?: number;
  unreadChatsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = false,
  onClose,
  activeTab = 'racks',
  onTabChange,
  onOpenProfileModal,
  racksCount = 0,
  ordersCount = 0,
  suppliesCount = 0,
  unreadChatsCount = 1,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const toast = useToast();

  const isCurateRoute = location.pathname.startsWith('/admin/drops');

  const handleNav = (tab: 'racks' | 'payments' | 'dispatch' | 'supplies' | 'chats') => {
    const routeMap: Record<string, string> = {
      racks: '/admin/products',
      payments: '/admin/orders',
      dispatch: '/admin/dispatch',
      supplies: '/admin/supplies',
      chats: '/admin/chats',
    };
    navigate(routeMap[tab] || '/admin');
    if (onTabChange) {
      onTabChange(tab);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSignOut = () => {
    logout();
    toast.info('Signed out from Seller Studio.', 'Session Ended');
    navigate('/admin/login', { replace: true });
    if (onClose) {
      onClose();
    }
  };

  const navItems = [
    {
      id: 'racks' as const,
      label: 'Products & Inventory',
      icon: Shirt,
      badge: racksCount > 0 ? `${racksCount}` : undefined,
    },
    {
      id: 'payments' as const,
      label: 'Orders & Payments',
      icon: Receipt,
      badge: ordersCount > 0 ? `${ordersCount}` : undefined,
    },
    {
      id: 'dispatch' as const,
      label: 'Shipping & Waybills',
      icon: Truck,
      badge: ordersCount > 0 ? `${ordersCount}` : undefined,
    },
    {
      id: 'supplies' as const,
      label: 'Studio Supplies & Assets',
      icon: Boxes,
      badge: suppliesCount > 0 ? `${suppliesCount}` : undefined,
    },
    {
      id: 'chats' as const,
      label: 'Customer Chats',
      icon: MessageSquare,
      badge: unreadChatsCount > 0 ? `${unreadChatsCount}` : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-zinc-900 border-r border-zinc-200 flex flex-col justify-between transition-transform duration-200 ease-out shadow-lg lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 1. Brand Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PRMonogramLogo size="sm" showSubtitle={false} />
            <div>
              <span className="font-heading font-bold text-sm text-zinc-950 block leading-tight">
                Seller Studio
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Admin Panel
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 lg:hidden rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. Focused Navigation Menu */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1">
          <nav className="space-y-1 font-mono">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = !isCurateRoute && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 3. Curator Profile & Settings Footer */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/70 space-y-2.5 font-mono">
          
          {/* User Profile Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-zinc-950 truncate leading-tight">
                    {user?.name || 'Nathaniel Faborada (Curator)'}
                  </h4>
                </div>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {user?.email || 'nathaniel.faborada@gmail.com'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded uppercase">
                    Pandi Hub
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-0.5 text-xs">
            <button
              onClick={() => {
                if (onOpenProfileModal) onOpenProfileModal();
                if (onClose) onClose();
              }}
              className="w-full px-2.5 py-1.5 text-left rounded-xl hover:bg-white text-zinc-700 hover:text-zinc-950 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-medium text-[11px]">Admin Profile &amp; Settings</span>
            </button>

            <button
              onClick={() => {
                navigate('/');
                if (onClose) onClose();
              }}
              className="w-full px-2.5 py-1.5 text-left rounded-xl hover:bg-white text-zinc-700 hover:text-zinc-950 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-medium text-[11px]">View Storefront</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-2.5 py-1.5 text-left rounded-xl hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[11px]">Sign Out</span>
            </button>
          </div>

          {/* Hub Location Tag */}
          <div className="text-center pt-0.5 border-t border-zinc-200/60">
            <span className="text-[9px] text-zinc-400">
              P&amp;R Archival Studio · Pandi Bulacan
            </span>
          </div>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
