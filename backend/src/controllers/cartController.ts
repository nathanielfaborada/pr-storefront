import { Request, Response } from 'express';
import { db } from '../store/index.js';

const HOLD_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

export const holdItem = (req: Request, res: Response) => {
  db.cleanupExpiredHolds();
  const { itemId, sessionId } = req.body;

  if (!itemId || !sessionId) {
    return res.status(400).json({ success: false, message: 'itemId and sessionId are required.' });
  }

  const item = db.products.find(p => p.id === itemId);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found.' });
  }

  if (item.isSoldOut) {
    return res.status(400).json({ success: false, message: 'This 1-of-1 piece has already been SOLD OUT.' });
  }

  const existingHold = db.holds.get(itemId);
  if (existingHold && existingHold.sessionId !== sessionId && Date.now() < existingHold.expiresAt) {
    const remainingSeconds = Math.ceil((existingHold.expiresAt - Date.now()) / 1000);
    return res.status(409).json({
      success: false,
      message: `Another shopper has reserved this piece. Try again in ${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s.`,
      remainingSeconds,
    });
  }

  // Create / Refresh 15-minute hold
  const now = Date.now();
  const expiresAt = now + HOLD_DURATION_MS;

  db.holds.set(itemId, {
    itemId,
    sessionId,
    heldAt: now,
    expiresAt,
  });

  item.isReserved = true;
  item.reservedUntil = expiresAt;

  res.json({
    success: true,
    message: '1-of-1 item reserved for 15 minutes!',
    data: {
      item,
      heldAt: now,
      expiresAt,
      holdDurationMs: HOLD_DURATION_MS,
    }
  });
};

export const releaseItem = (req: Request, res: Response) => {
  const { itemId, sessionId } = req.body;

  if (!itemId || !sessionId) {
    return res.status(400).json({ success: false, message: 'itemId and sessionId are required.' });
  }

  const existingHold = db.holds.get(itemId);
  if (existingHold && existingHold.sessionId === sessionId) {
    db.holds.delete(itemId);
  }

  const item = db.products.find(p => p.id === itemId);
  if (item && !item.isSoldOut) {
    item.isReserved = false;
    item.reservedUntil = undefined;
  }

  res.json({
    success: true,
    message: 'Hold released. Item returned to the rack.',
  });
};

export const getSessionHolds = (req: Request, res: Response) => {
  db.cleanupExpiredHolds();
  const { sessionId } = req.params;

  const userHolds: any[] = [];
  for (const [, hold] of db.holds.entries()) {
    if (hold.sessionId === sessionId) {
      const item = db.products.find(p => p.id === hold.itemId);
      if (item && !item.isSoldOut) {
        userHolds.push({
          item,
          heldAt: hold.heldAt,
          holdExpiresAt: hold.expiresAt,
        });
      }
    }
  }

  res.json({
    success: true,
    data: userHolds,
  });
};
