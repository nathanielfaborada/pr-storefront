import React from 'react';
import { Shirt, Clock, Receipt, Truck } from 'lucide-react';
import { formatPhp } from '../../utils/index.ts';

interface AdminStatCardsProps {
  totalProductsCount: number;
  availableProductsCount: number;
  activeHoldsCount: number;
  totalSalesPhp: number;
  ordersCount: number;
}

export const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  totalProductsCount,
  availableProductsCount,
  activeHoldsCount,
  totalSalesPhp,
  ordersCount,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3">
      {/* Stat 1: Products on Racks */}
      <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 pb-0.5 sm:pb-1.5 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 truncate">
            <Shirt className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="truncate">On Racks</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-400 shrink-0">Drop 08</span>
        </div>
        <div className="mt-0.5">
          <span className="font-mono font-bold text-base sm:text-2xl text-zinc-950 block">
            {availableProductsCount}
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 truncate mt-0.5 block">
            Catalog: <strong className="text-zinc-700">{totalProductsCount}</strong>
          </span>
        </div>
      </div>

      {/* Stat 2: Active Holds */}
      <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 pb-0.5 sm:pb-1.5 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 truncate">
            <Clock className="w-3 h-3 text-orange-500 shrink-0" />
            <span className="truncate">15m Holds</span>
          </span>
          {activeHoldsCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
          )}
        </div>
        <div className="mt-0.5">
          <span className="font-mono font-bold text-base sm:text-2xl text-orange-600 block">
            {activeHoldsCount}
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 truncate mt-0.5 block">
            Cart Locks
          </span>
        </div>
      </div>

      {/* Stat 3: Verified Sales */}
      <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 pb-0.5 sm:pb-1.5 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 truncate">
            <Receipt className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Sales</span>
          </span>
          <span className="text-[8px] sm:text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 shrink-0">
            Verified
          </span>
        </div>
        <div className="mt-0.5">
          <span className="font-mono font-bold text-base sm:text-2xl text-zinc-950 block truncate">
            {formatPhp(totalSalesPhp)}
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 truncate mt-0.5 block">
            <strong className="text-zinc-700">{ordersCount}</strong> Cleared
          </span>
        </div>
      </div>

      {/* Stat 4: Ready for J&T Dispatch */}
      <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 pb-0.5 sm:pb-1.5 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 truncate">
            <Truck className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="truncate">Dispatch</span>
          </span>
          <span className="text-[8px] sm:text-[10px] font-mono font-semibold text-zinc-400 shrink-0">J&amp;T</span>
        </div>
        <div className="mt-0.5">
          <span className="font-mono font-bold text-base sm:text-2xl text-zinc-950 block">
            {ordersCount}
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 truncate mt-0.5 block">
            Parcels Ready
          </span>
        </div>
      </div>
    </div>
  );
};
