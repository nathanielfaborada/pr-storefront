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
  db.cleanupExpiredHolds();
  const { id } = req.params;
  const item = db.products.find(p => p.id === id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in archive.' });
  }

  res.json({ success: true, data: item });
};
