import { Request, Response } from 'express';
import { db } from '../store/index.js';
import { ChatMessage } from '../types/index.js';

export const getChatMessages = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.messages,
  });
};

export const sendChatMessage = (req: Request, res: Response) => {
  const { text, attachedProduct, imageAttachmentUrl } = req.body;

  if (!text && !imageAttachmentUrl) {
    return res.status(400).json({ success: false, message: 'Message text or image attachment required.' });
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sender: 'shopper',
    text: text || 'Sent an image attachment.',
    timestamp: timeFormatted,
    attachedProduct,
    imageAttachmentUrl,
    isRead: true,
  };

  db.messages.push(userMsg);

  // Generate automated intelligent response from P&R Vintage Stylist
  let replyText = "Thanks for checking in! Our stylist is reviewing this piece right now.";

  const lower = (text || '').toLowerCase();
  if (lower.includes('available') || lower.includes('avail')) {
    if (attachedProduct) {
      const item = db.products.find(p => p.id === attachedProduct.id);
      if (item?.isSoldOut) {
        replyText = `Ah, the ${attachedProduct.title} was just secured by another buyer! Check out our new outerwear drop for similar 90s archive pieces.`;
      } else if (item?.isReserved) {
        replyText = `Yes! The ${attachedProduct.title} is currently in a 15-min cart hold, but you can Mine it once released or grab it right now if it's in your bag!`;
      } else {
        replyText = `Yes! ${attachedProduct.title} is available in the archive. It's a genuine 1-of-1, so click "Mine" on the product view to secure a 15-minute lock! 🔥`;
      }
    } else {
      replyText = "All items listed in the current drop without the 'SOLD OUT' stamp are 100% available and ready to dispatch via express courier!";
    }
  } else if (lower.includes('fit') || lower.includes('pit') || lower.includes('size')) {
    if (attachedProduct) {
      replyText = `For "${attachedProduct.title}": Tagged as ${attachedProduct.tagSize}, recommended fit is ${attachedProduct.recommendedFit}. Vintage measurements are exact in inches on the PDP. Fits perfectly boxy! 📐`;
    } else {
      replyText = "Every vintage piece has exact pit-to-pit and length dimensions measured by hand. Check the 'Vintage Measurement Box' on the item details! 📏";
    }
  } else if (lower.includes('photo') || lower.includes('pic') || lower.includes('lighting')) {
    replyText = "All photos in our gallery are taken under neutral 5500K archival studio lighting with zero color filters. What you see is the true natural patina!";
  } else if (lower.includes('hold') || lower.includes('reserve')) {
    replyText = "Clicking 'Mine / Add to Bag' automatically grants you a 15-minute exclusive hold timer so nobody else can take it while you fill out your checkout details. ⏱️";
  } else if (lower.includes('ship') || lower.includes('lalamove') || lower.includes('j&t')) {
    replyText = "We ship Metro Manila orders via Same-Day Lalamove/Grab (₱99 flat) and Provincial orders via J&T Express (₱160). Free shipping on orders over ₱2,500! 📦";
  }

  const sellerReply: ChatMessage = {
    id: `msg-${Date.now() + 100}-${Math.random().toString(36).substring(2, 7)}`,
    sender: 'seller',
    text: replyText,
    timestamp: timeFormatted,
    isRead: false,
  };

  // Add seller response
  db.messages.push(sellerReply);

  res.json({
    success: true,
    userMessage: userMsg,
    sellerReply: sellerReply,
  });
};
