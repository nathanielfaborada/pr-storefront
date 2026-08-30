import { Item, ChatMessage, OrderPayload } from '../types/index.js';
import { INITIAL_PRODUCTS } from '../data/products.js';

class InMemoryStore {
  public products: Item[] = [];
  public holds: Map<string, { itemId: string; sessionId: string; heldAt: number; expiresAt: number }> = new Map();
  public messages: ChatMessage[] = [];
  public orders: OrderPayload[] = [];

  constructor() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    
    // Initial welcome message from P&R Head Stylist
    this.messages = [
      {
        id: "msg-welcome-001",
        sender: "seller",
        text: "Peace! Welcome to P&R Vintage & Streetwear Archive. 🔥 All pieces are 1-of-1 authentic vintage. Let me know if you need sizing advice, pit-to-pit fit comparisons, or natural light photos!",
        timestamp: "Just now",
        isRead: true,
      }
    ];

    // Background interval to release expired 15-minute holds
    setInterval(() => {
      this.cleanupExpiredHolds();
    }, 5000);
  }

  public cleanupExpiredHolds() {
    const now = Date.now();
    for (const [key, hold] of this.holds.entries()) {
      if (now >= hold.expiresAt) {
        this.holds.delete(key);
        const item = this.products.find(p => p.id === hold.itemId);
        if (item && item.isReserved && !item.isSoldOut) {
          item.isReserved = false;
          item.reservedUntil = undefined;
          console.log(`[Inventory Hold] Expired & Released 1-of-1 item: ${item.title}`);
        }
      }
    }
  }
}

export const db = new InMemoryStore();
