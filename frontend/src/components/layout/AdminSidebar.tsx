import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PRMonogramLogo } from '../common/PRMonogramLogo.tsx';
import {
  Shirt,
  Receipt,
  Truck,
  Clock,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: 'racks' | 'payments' | 'dispatch' | 'holds';
  onTabChange?: (tab: 'racks' | 'payments' | 'dispatch' | 'holds') => void;
  racksCount?: number;
  ordersCount?: number;
  holdsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = false,
  onClose,
  activeTab = 'racks',
  onTabChange,
  racksCount = 0,
  ordersCount = 0,
  holdsCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurateRoute = location.pathname.startsWith('/admin/drops');

  const handleNav = (tab: 'racks' | 'payments' | 'dispatch' | 'holds') => {
    const routeMap: Record<string, string> = {
      racks: '/admin/products',
      payments: '/admin/orders',
      dispatch: '/admin/dispatch',
      holds: '/admin/holds',
    };
    navigate(routeMap[tab] || '/admin');
    if (onTabChange) {
      onTabChange(tab);
    }
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
      id: 'holds' as const,
      label: 'Active Holds',
      icon: Clock,
      badge: holdsCount > 0 ? `${holdsCount}` : undefined,
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
              className="p-1.5 text-zinc-400 hover:text-zinc-900 lg:hidden rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. Focused Navigation Menu */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1">
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = !isCurateRoute && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
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

        {/* 3. Footer Studio Version */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 text-center">
          <span className="text-[10px] font-mono text-zinc-400">
            P&amp;R Archival Studio · v2.4
          </span>
        </div>

      </aside>
    </>
  );
};
