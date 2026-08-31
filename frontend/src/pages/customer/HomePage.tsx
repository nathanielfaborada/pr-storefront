import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, CategoryType } from '../../types/index.ts';
import { INITIAL_PRODUCTS } from '../../data/products.ts';
import { productService } from '../../services/productService.ts';
import { useFilter } from '../../context/FilterContext.tsx';
import { CategoryPills } from '../../components/catalog/CategoryPills.tsx';
import { ProductGrid } from '../../components/catalog/ProductGrid.tsx';

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

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter (matches title, brand, tags, dropNumber)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);
        const matchesDrop = item.dropNumber.toLowerCase().includes(query);
        const matchesTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesBrand && !matchesDrop && !matchesTags) {
          return false;
        }
      }

      // Condition grade filter
      if (selectedCondition && selectedCondition !== 'all' && item.condition?.grade !== selectedCondition) {
        return false;
      }

      // Size filter
      if (selectedSize && selectedSize !== 'all' && item.tagSize !== selectedSize) {
        return false;
      }

      // Hide sold out filter
      if (hideSoldOut && item.isSoldOut) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Available items always appear before sold-out items
      if (a.isSoldOut !== b.isSoldOut) {
        return a.isSoldOut ? 1 : -1;
      }

      if (sortBy === 'price-asc') {
        return a.pricePhp - b.pricePhp;
      }
      if (sortBy === 'price-desc') {
        return b.pricePhp - a.pricePhp;
      }
      // 'newest' or default: sort by Drop order / ID desc
      return b.id.localeCompare(a.id);
    });
  }, [products, selectedCategory, searchQuery, selectedCondition, selectedSize, sortBy, hideSoldOut]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.length,
      'boxy-tees': 0,
      'cropped-hoodies': 0,
      'parachute-cargos': 0,
      'techwear-outerwear': 0,
      accessories: 0,
    };
    products.forEach(p => {
      const cat = p.category || 'accessories';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-3 sm:space-y-6">
      
      {/* 1. Category Filter Strip */}
      <CategoryPills categoryCounts={categoryCounts} />

      {/* 2. Product Grid with Live Bag Hold Status */}
      <ProductGrid
        items={filteredProducts}
        onResetFilter={resetFilters}
      />
    </div>
  );
};
