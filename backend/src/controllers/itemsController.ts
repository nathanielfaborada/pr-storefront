import { Request, Response } from 'express';
import { db } from '../store/index.js';

export const getItems = (req: Request, res: Response) => {
  db.cleanupExpiredHolds();
  const { category, search, condition, hideSold } = req.query;

  let results = [...db.products];

  if (category && category !== 'all') {
    results = results.filter(item => item.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.tagSize.toLowerCase().includes(q) ||
      item.recommendedFit.toLowerCase().includes(q)
    );
  }

  if (condition && typeof condition === 'string' && condition !== 'all') {
    results = results.filter(item => item.condition.grade.toLowerCase().includes(condition.toLowerCase()));
  }

  if (hideSold === 'true') {
    results = results.filter(item => !item.isSoldOut);
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
};

export const getItemById = (req: Request, res: Response) => {
  const { id } = req.params;
  const item = db.products.find(p => p.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  res.json({ success: true, data: item });
};

export const createItem = (req: Request, res: Response) => {
  const newItem = req.body;
  if (!newItem || !newItem.title || !newItem.category) {
    return res.status(400).json({ success: false, message: 'Invalid item payload' });
  }

  db.products = [newItem, ...db.products.filter(p => p.id !== newItem.id)];
  res.status(201).json({ success: true, data: newItem });
};

export const updateItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  db.products[index] = { ...db.products[index], ...updates };
  res.json({ success: true, data: db.products[index] });
};

export const deleteItem = (req: Request, res: Response) => {
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  res.json({ success: true, message: `Item ${id} removed` });
};
