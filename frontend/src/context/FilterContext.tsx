import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CategoryType } from '../types/index.ts';

interface FilterContextType {
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
  hideSoldOut: boolean;
  setHideSoldOut: (hide: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedCondition('all');
    setSelectedSize('all');
    setSortBy('featured');
    setHideSoldOut(false);
  };

  return (
    <FilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedCondition,
        setSelectedCondition,
        selectedSize,
        setSelectedSize,
        sortBy,
        setSortBy,
        hideSoldOut,
        setHideSoldOut,
        isSearchOpen,
        setIsSearchOpen,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilter must be used within FilterProvider');
  return context;
};
