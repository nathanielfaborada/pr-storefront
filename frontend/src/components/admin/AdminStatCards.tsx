import React from 'react';
import {
  Shirt,
  Receipt,
  Truck,
  Boxes,
  Coins,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  PackageCheck
} from 'lucide-react';
import { formatPhp } from '../../utils/index.ts';
import { Item, OrderPayload, SupplyItem, StudioRack } from '../../types/index.ts';

interface AdminStatCardsProps {
  activeTab: 'racks' | 'payments' | 'dispatch' | 'supplies' | 'chats';
  products: Item[];
  orders: OrderPayload[];
  supplies: SupplyItem[];
  racks: StudioRack[];
  packagingCostPerOrder: number;
}

export const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  activeTab,
  products,
  orders,
  supplies,
  racks,
  packagingCostPerOrder,
}) => {
  // 1. Racks & Inventory Metrics
  if (activeTab === 'racks') {
    const totalCount = products.length;
    const availableCount = products.filter(p => !p.isSoldOut).length;
    const soldCount = products.filter(p => p.isSoldOut).length;
    const inventoryValue = products
      .filter(p => !p.isSoldOut)
      .reduce((acc, p) => acc + p.pricePhp, 0);

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 font-mono">
        {/* Card 1: On Racks */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Shirt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">On Racks</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Active</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {availableCount}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Available in Drop 08
            </span>
          </div>
        </div>

        {/* Card 2: Total Catalog */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Catalog Size</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Total</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {totalCount}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Curated Vintage Pieces
            </span>
          </div>
        </div>

        {/* Card 3: Sold Out */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">Sold Out</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Archive</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {soldCount}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Claimed by Shoppers
            </span>
          </div>
        </div>

        {/* Card 4: Inventory Retail Value */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">Rack Worth</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded font-bold">PHP</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block truncate leading-tight">
              {formatPhp(inventoryValue)}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Total Unsold Value
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Orders & Payments Metrics
  if (activeTab === 'payments') {
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmountPhp, 0);
    const verifiedCount = orders.filter(o => o.fulfillmentStatus === 'payment_verified').length;
    const gcashCount = orders.filter(o => o.paymentDetails.method === 'gcash' || o.paymentDetails.method === 'maya').length;
    const codCount = orders.filter(o => o.paymentDetails.method === 'cod').length;

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 font-mono">
        {/* Card 1: Verified Sales */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Revenue</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Verified</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-emerald-600 block truncate leading-tight">
              {formatPhp(totalSales)}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Gross sales collected
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders in Queue */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Orders</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Queue</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {orders.length}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              {verifiedCount} verified slips
            </span>
          </div>
        </div>

        {/* Card 3: GCash / Maya QR Volume */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <QrCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">E-Wallet</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">QR Slips</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {gcashCount}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              GCash &amp; Maya checkouts
            </span>
          </div>
        </div>

        {/* Card 4: COD Volume */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 shrink-0" />
              <span className="truncate">COD Rider</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Cash</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {codCount}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Rider collection
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Shipping & Courier Dispatch Metrics
  if (activeTab === 'dispatch') {
    const readyForPickup = orders.filter(o => o.fulfillmentStatus === 'payment_verified').length;
    const totalWaybills = orders.filter(o => o.waybillNumber).length;
    const declaredValue = orders.reduce((sum, o) => sum + o.totalAmountPhp, 0);

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 font-mono">
        {/* Card 1: Ready for Courier Pickup */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 shrink-0" />
              <span className="truncate">Ready J&amp;T</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-bold">Courier</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {readyForPickup}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Parcels packed &amp; sealed
            </span>
          </div>
        </div>

        {/* Card 2: J&T Express Waybills Generated */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <PackageCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Waybills</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Pandi Hub</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {totalWaybills}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Labels generated
            </span>
          </div>
        </div>

        {/* Card 3: Fulfillment SLA Rate */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">SLA Rate</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">100%</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-emerald-600 block leading-tight">
              100%
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Same-day packing rate
            </span>
          </div>
        </div>

        {/* Card 4: Declared Parcel Valuation */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 shrink-0" />
              <span className="truncate">Declared</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Total</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block truncate leading-tight">
              {formatPhp(declaredValue)}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Total parcel valuation
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Supplies & Assets Metrics
  if (activeTab === 'supplies') {
    const totalSupplyValue = supplies.reduce((acc, s) => acc + (s.quantity * s.unitCostPhp), 0);
    const lowStockItems = supplies.filter(s => s.quantity <= s.lowStockThreshold);
    const totalRackCapacity = racks.reduce((acc, r) => acc + r.capacity, 0);
    const totalRackedPieces = racks.reduce((acc, r) => acc + r.currentPiecesCount, 0);

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 font-mono">
        {/* Card 1: Asset Inventory Value */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Boxes className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Assets</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Value</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block truncate leading-tight">
              {formatPhp(totalSupplyValue)}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              {supplies.length} supply items tracked
            </span>
          </div>
        </div>

        {/* Card 2: Packaging Overhead COGS */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">Packaging</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">COGS</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-orange-600 block leading-tight">
              {formatPhp(packagingCostPerOrder)}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Per-order packing overhead
            </span>
          </div>
        </div>

        {/* Card 3: Low Stock Warnings */}
        <div className={`border rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between ${
          lowStockItems.length > 0
            ? 'bg-amber-50/80 border-amber-300 text-amber-950'
            : 'bg-white border-zinc-200 text-zinc-950'
        }`}>
          <div className="flex items-center justify-between pb-0.5 sm:pb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <AlertTriangle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${lowStockItems.length > 0 ? 'text-amber-600' : 'text-zinc-400'} shrink-0`} />
              <span className="truncate">Low Stock</span>
            </span>
            {lowStockItems.length > 0 && (
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div>
            <span className={`font-bold text-sm sm:text-2xl block leading-tight ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-zinc-950'}`}>
              {lowStockItems.length}
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              {lowStockItems.length > 0 ? 'Needs reorder' : 'All stocked'}
            </span>
          </div>
        </div>

        {/* Card 4: Studio Physical Racks */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Racks</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Pandi Hub</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              {totalRackedPieces} <span className="text-[10px] sm:text-xs text-zinc-400 font-normal">/ {totalRackCapacity}</span>
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Across physical racks
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Customer Chats & Inquiries Metrics
  if (activeTab === 'chats') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 font-mono">
        {/* Card 1: Active Conversations */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Boxes className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Inquiries</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Live</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              3
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Active buyer threads
            </span>
          </div>
        </div>

        {/* Card 2: Unread Messages */}
        <div className="bg-orange-50/70 border border-orange-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-orange-900">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">New Messages</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-orange-950 block leading-tight">
              1 Unread
            </span>
            <span className="hidden sm:block text-[10px] text-orange-800/80 mt-0.5">
              Requires seller response
            </span>
          </div>
        </div>

        {/* Card 3: Vault Piece Attached */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Shirt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Piece Inquiries</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-400">Drop 08</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              3 Items
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Sizing &amp; fit questions
            </span>
          </div>
        </div>

        {/* Card 4: Avg Response Time */}
        <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 text-zinc-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 shrink-0" />
              <span className="truncate">Response Rate</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-emerald-600 font-bold">⚡ Fast</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-2xl text-zinc-950 block leading-tight">
              &lt; 2 Mins
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 mt-0.5">
              Avg studio reply time
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminStatCards;
