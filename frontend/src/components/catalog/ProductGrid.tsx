import React from 'react';
import { Item } from '../../types/index.ts';
import { ProductCard } from './ProductCard.tsx';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface ProductGridProps {
  products: Item[];
  onSelectProduct: (item: Item) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 mx-auto mb-4">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white">No Pieces Match This Silhouette Filter</h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-mono">
          All releases are 1-of-1 curated drops. Try resetting your silhouette or size filters to view live pieces.
        </p>
        <Button
          variant="primary"
          size="sm"
          className="mt-6"
          onClick={onResetFilters}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Reset All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map(item => (
        <ProductCard
          key={item.id}
          item={item}
          onClick={() => onSelectProduct(item)}
        />
      ))}
    </div>
  );
};
