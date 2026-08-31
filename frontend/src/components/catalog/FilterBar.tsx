import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useFilter } from '../../context/FilterContext.tsx';

export const FilterBar: React.FC = () => {
  const {
    selectedSize,
    setSelectedSize,
    sortBy,
    setSortBy,
    hideSoldOut,
    setHideSoldOut,
    resetFilters,
  } = useFilter();

  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL+', 'OSFA'];

  const hasActiveFilters = selectedSize !== 'all' || sortBy !== 'featured' || hideSoldOut;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 p-2 sm:py-3 sm:px-3.5 border border-orange-200/70 bg-gradient-to-r from-orange-50/40 via-white to-amber-50/30 text-xs font-mono rounded-xl sm:rounded-2xl shadow-xs">
      
      {/* Left Filter Controls */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 text-zinc-600 mr-0.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
          <span className="font-bold uppercase tracking-wider text-[10px] hidden sm:inline">Filter:</span>
        </div>

        {/* Size Filter */}
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs text-[11px] sm:text-xs"
        >
          <option value="all">Sizes</option>
          {sizes.filter(s => s !== 'all').map(s => (
            <option key={s} value={s}>Tag: {s}</option>
          ))}
        </select>

        {/* Hide Sold Out Toggle */}
        <label className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 cursor-pointer hover:bg-zinc-100 transition-colors shadow-xs text-[11px] sm:text-xs select-none">
          <input
            type="checkbox"
            checked={hideSoldOut}
            onChange={(e) => setHideSoldOut(e.target.checked)}
            className="rounded border-zinc-300 text-orange-500 focus:ring-orange-500 w-3.5 h-3.5"
          />
          <span className="font-medium">Hide Claimed</span>
        </label>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2 py-1 text-zinc-500 hover:text-red-600 text-[11px] sm:text-xs font-medium transition-colors hover:bg-red-50 rounded-lg"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right Sort Dropdown */}
      <div className="flex items-center gap-1.5">
        <span className="text-zinc-500 text-[11px] sm:text-xs">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs text-[11px] sm:text-xs"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">₱ Low to High</option>
          <option value="price-desc">₱ High to Low</option>
        </select>
      </div>

    </div>
  );
};
