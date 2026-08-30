import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, CategoryType } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/products.ts';
import { productService } from '../services/productService.ts';
import { useFilter } from '../context/FilterContext.tsx';
import { CategoryPills } from '../components/catalog/CategoryPills.tsx';
import { FilterBar } from '../components/catalog/FilterBar.tsx';
import { ProductGrid } from '../components/catalog/ProductGrid.tsx';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Item[]>(INITIAL_PRODUCTS);

  const {
    selectedCategory,
    searchQuery,
    selectedCondition,
    selectedSize,
    sortBy,
    hideSoldOut,
    resetFilters,
  } = useFilter();

  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      all: products.length,
      'boxy-tees': 0,
      'cropped-hoodies': 0,
      'parachute-cargos': 0,
      'techwear-outerwear': 0,
      accessories: 0,
    };
    products.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tagSize.toLowerCase().includes(q) ||
        p.recommendedFit.toLowerCase().includes(q) ||
        p.silhouette.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedSize !== 'all') {
      result = result.filter(p => 
        p.tagSize.toLowerCase() === selectedSize.toLowerCase() ||
        p.recommendedFit.toLowerCase().includes(selectedSize.toLowerCase())
      );
    }

    if (selectedCondition !== 'all') {
      result = result.filter(p => p.condition.grade.toLowerCase().includes(selectedCondition.toLowerCase()));
    }

    if (hideSoldOut) {
      result = result.filter(p => !p.isSoldOut);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePhp - b.pricePhp);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePhp - a.pricePhp);
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedSize, selectedCondition, hideSoldOut, sortBy]);

  const handleSelectProduct = (item: Item) => {
    navigate(`/drops/${item.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Silhouette Category Scroller */}
      <CategoryPills categoryCounts={categoryCounts} />

      {/* Filter & Sort Bar */}
      <FilterBar />

      {/* Responsive Product Grid */}
      <ProductGrid
        products={filteredProducts}
        onSelectProduct={handleSelectProduct}
        onResetFilters={resetFilters}
      />
    </div>
  );
};
