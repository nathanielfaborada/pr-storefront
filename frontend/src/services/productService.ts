import { apiClient } from './apiClient.ts';
import { Item } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/products.ts';

export const productService = {
  async getAll(): Promise<Item[]> {
    const res = await apiClient.get<Item[]>('/api/items');
    if (res.success && res.data && res.data.length > 0) {
      return res.data;
    }
    return INITIAL_PRODUCTS;
  },

  async getById(id: string): Promise<Item | null> {
    const res = await apiClient.get<Item>(`/api/items/${id}`);
    if (res.success && res.data) {
      return res.data;
    }
    const fallback = INITIAL_PRODUCTS.find(p => p.id === id);
    return fallback || null;
  },
};
