import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useFilter } from '../../context/FilterContext.tsx';

export const FilterBar: React.FC = () => {
  const {
    selectedSize,
    setSelectedSize,
    selectedCondition,
    setSelectedCondition,
    sortBy,
    setSortBy,
    hideSoldOut,
    setHideSoldOut,
    resetFilters,
  } = useFilter();

  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL+', 'OSFA'];
  const conditions = [
    { value: 'all', label: 'All Grades' },
    { value: 'Pristine Sample', label: 'Pristine Sample (10/10)' },
    { value: 'Curated Archival', label: 'Curated Archival (9.5/10)' },
    { value: 'Grade A', label: 'Grade A Vault (9/10)' },
    { value: 'Custom Distressed', label: 'Custom Distressed (8.5/10)' },
  ];

  const hasActiveFilters = selectedSize !== 'all' || selectedCondition !== 'all' || sortBy !== 'featured' || hideSoldOut;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 sm:px-0 border-y border-zinc-200 bg-zinc-50/60 text-xs font-mono">
      
      {/* Left Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-zinc-500 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-bold uppercase tracking-wider text-[10px]">Filter:</span>
        </div>

        {/* Size Filter */}
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium focus:outline-none focus:border-black cursor-pointer shadow-sm"
        >
          <option value="all">All Sizes</option>
          {sizes.filter(s => s !== 'all').map(s => (
            <option key={s} value={s}>Tag: {s}</option>
          ))}
        </select>

        {/* Condition Filter */}
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium focus:outline-none focus:border-black cursor-pointer shadow-sm"
        >
          {conditions.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Hide Sold Out Toggle */}
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 cursor-pointer hover:bg-zinc-100 transition-colors shadow-sm">
          <input
            type="checkbox"
            checked={hideSoldOut}
            onChange={(e) => setHideSoldOut(e.target.checked)}
            className="rounded border-zinc-300 text-black focus:ring-black"
          />
          <span className="select-none font-medium">Hide Claimed</span>
        </label>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2 py-1.5 text-zinc-500 hover:text-red-600 text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 text-[11px]">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium focus:outline-none focus:border-black cursor-pointer shadow-sm"
        >
          <option value="featured">Featured Drops</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

    </div>
  );
};
