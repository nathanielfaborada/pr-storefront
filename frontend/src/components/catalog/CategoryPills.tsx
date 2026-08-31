import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext.tsx';
import { CategoryType } from '../../types/index.ts';

interface CategoryPillsProps {
  categoryCounts?: Partial<Record<CategoryType, number>>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categoryCounts = {} }) => {
  const { selectedCategory, setSelectedCategory } = useFilter();

  const categories = useMemo(() => {
    const defaultLabels: Record<string, string> = {
      all: 'All Releases',
      'boxy-tees': 'Boxy Tees',
      'cropped-hoodies': 'Cropped Hoodies',
      'parachute-cargos': 'Parachute & Cargos',
      'techwear-outerwear': 'Outerwear & Jackets',
      accessories: 'Accessories',
    };

    // Gather all existing category keys from inventory
    const customKeys = Object.keys(categoryCounts).filter(k => k !== 'all');
    const allKeys = ['all', ...Array.from(new Set(['boxy-tees', 'cropped-hoodies', 'parachute-cargos', 'techwear-outerwear', 'accessories', ...customKeys]))];

    return allKeys.map(catId => {
      const label = defaultLabels[catId] || catId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return { id: catId, label };
    });
  }, [categoryCounts]);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-0.5">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id || (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all'));
          const count = categoryCounts[cat.id];

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'all' ? '' : cat.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-semibold tracking-wide transition-all select-none ${
                isSelected
                  ? 'bg-zinc-950 text-white shadow-xs font-bold ring-1 ring-orange-500/50'
                  : 'bg-white text-zinc-600 hover:text-zinc-950 hover:bg-orange-50/40 border border-zinc-200 hover:border-orange-300'
              }`}
            >
              <span>{cat.label}</span>
              {typeof count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  isSelected ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
