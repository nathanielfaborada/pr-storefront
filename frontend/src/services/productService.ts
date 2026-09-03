import { Item } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/products.ts';

const LOCAL_STORAGE_KEY = 'pr_custom_products_orig_v6';

const getStoredProducts = (): Item[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const saveStoredProducts = (products: Item[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
  async getAll(): Promise<Item[]> {
    return getStoredProducts();
  },

  async getById(id: string): Promise<Item | null> {
    const products = getStoredProducts();
    const found = products.find(p => p.id === id);
    return found || null;
  },

  async create(item: Item): Promise<Item> {
    const current = getStoredProducts();
    const updated = [item, ...current.filter(p => p.id !== item.id)];
    saveStoredProducts(updated);
    return item;
  },

  async update(id: string, item: Partial<Item>): Promise<Item | null> {
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
    const current = getStoredProducts();
    const updated = current.filter(p => p.id !== id);
    saveStoredProducts(updated);
    return true;
  },
};
