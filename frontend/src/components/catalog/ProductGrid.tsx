import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../types/index.ts';
import { ProductCard } from './ProductCard.tsx';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface ProductGridProps {
  products?: Item[];
  items?: Item[];
  onSelectProduct?: (item: Item) => void;
  onResetFilter?: () => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  items,
  onSelectProduct,
  onResetFilter,
  onResetFilters,
}) => {
  const navigate = useNavigate();
  const list = items || products || [];
  const handleReset = onResetFilters || onResetFilter || (() => {});
  const handleSelect = onSelectProduct || ((item: Item) => navigate(`/drops/${item.id}`));

  if (list.length === 0) {
    return (
      <div className="py-8 sm:py-16 text-center max-w-sm mx-auto px-3 font-mono flex flex-col items-center justify-center">
        
        <h3 className="font-heading text-sm sm:text-base font-bold text-zinc-950">
          No Pieces Match This Filter
        </h3>
        <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 leading-relaxed max-w-xs">
          All releases are 1-of-1 curated drops. Try resetting your silhouette or size filters to view live pieces.
        </p>
        <Button
          variant="primary"
          size="sm"
          className="mt-3.5 sm:mt-5 shadow-sm text-xs font-bold px-4 py-2"
          onClick={handleReset}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Reset All Filters</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-0.5">
      {list.map(item => (
        <ProductCard
          key={item.id}
          item={item}
          onClick={() => handleSelect(item)}
        />
      ))}
    </div>
  );
};
