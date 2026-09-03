import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button.tsx';
import { Menu, Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  activeTab: 'racks' | 'payments' | 'dispatch' | 'supplies' | 'chats';
  onOpenSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  activeTab,
  onOpenSidebar,
}) => {
  const navigate = useNavigate();

  const getMobileTitle = () => {
    switch (activeTab) {
      case 'racks':
        return 'Inventory';
      case 'payments':
        return 'Orders';
      case 'dispatch':
        return 'Waybills';
      case 'supplies':
        return 'Supplies';
      case 'chats':
        return 'Live Chat';
      default:
        return title;
    }
  };

  return (
    <header className="bg-white px-3 py-2 sm:px-5 sm:py-3.5 rounded-2xl border border-zinc-200 flex items-center justify-between gap-3 shadow-2xs">
      {/* Left: Mobile Menu Toggle + Section Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl border border-zinc-200 lg:hidden shrink-0 cursor-pointer"
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

      {/* Right: + Add Piece CTA (Only visible on Products & Inventory tab) */}
      {activeTab === 'racks' && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/drops/new')}
            className="h-8 sm:h-9 text-xs font-bold shadow-xs flex items-center gap-1.5 px-3 sm:px-4 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span> Add Piece</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
