import React from 'react';
import { useFilter } from '../../context/FilterContext.tsx';
import { CategoryType } from '../../types/index.ts';

interface CategoryPillsProps {
  categoryCounts: Record<CategoryType, number>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categoryCounts }) => {
  const { selectedCategory, setSelectedCategory } = useFilter();

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Drops' },
    { id: 'boxy-tees', label: 'Boxy Tees' },
    { id: 'cropped-hoodies', label: 'Cropped Hoodies' },
    { id: 'parachute-cargos', label: 'Parachute & Cargos' },
    { id: 'techwear-outerwear', label: 'Techwear & Outerwear' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-4 sm:px-0">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all select-none ${
                isSelected
                  ? 'bg-zinc-950 text-white shadow-sm font-bold'
                  : 'bg-white text-zinc-600 hover:text-black hover:bg-zinc-50 border border-zinc-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isSelected ? 'bg-white/20 text-white font-bold' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
