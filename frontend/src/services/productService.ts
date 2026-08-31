import { apiClient } from './apiClient.ts';
import { Item } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/products.ts';

const LOCAL_STORAGE_KEY = 'pr_custom_products';

const getStoredProducts = (): Item[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }
  return INITIAL_PRODUCTS;
};

const saveStoredProducts = (products: Item[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
  async getAll(): Promise<Item[]> {
    try {
      const res = await apiClient.get<Item[]>('/api/items');
      if (res.success && res.data && res.data.length > 0) {
        saveStoredProducts(res.data);
        return res.data;
      }
    } catch {
      // fallback to stored products
    }
    return getStoredProducts();
  },

  async getById(id: string): Promise<Item | null> {
    try {
      const res = await apiClient.get<Item>(`/api/items/${id}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // fallback
    }
    const products = getStoredProducts();
    const found = products.find(p => p.id === id);
    return found || null;
  },

  async create(item: Item): Promise<Item> {
    try {
      await apiClient.post<Item>('/api/items', item);
    } catch {
      // offline / local mode
    }
    const current = getStoredProducts();
    const updated = [item, ...current.filter(p => p.id !== item.id)];
    saveStoredProducts(updated);
    return item;
  },

  async update(id: string, item: Partial<Item>): Promise<Item | null> {
    try {
      await apiClient.put<Item>(`/api/items/${id}`, item);
    } catch {
      // offline / local mode
    }
    const current = getStoredProducts();
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedItem = { ...current[index], ...item };
      current[index] = updatedItem;
      saveStoredProducts(current);
      return updatedItem;
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/items/${id}`);
    } catch {
      // offline / local mode
    }
    const current = getStoredProducts();
    const updated = current.filter(p => p.id !== id);
    saveStoredProducts(updated);
    return true;
  },
};
