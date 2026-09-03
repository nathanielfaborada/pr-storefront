import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, Item, AttachedProductSummary } from '../types/index.ts';

interface ChatContextType {
  messages: ChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  openChatWithProduct: (item: Item) => void;
  attachedProduct: AttachedProductSummary | null;
  setAttachedProduct: (product: AttachedProductSummary | null) => void;
  sendMessage: (text: string, imageAttachmentUrl?: string) => Promise<void>;
  isSellerTyping: boolean;
  unreadCount: number;
  markAllAsRead: () => void;
}

const CHAT_STORAGE_KEY = 'pr_chat_messages_v1';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome-001",
    sender: "seller",
    text: "Peace! Welcome to P&R Vintage & Streetwear Archive. 🔥 All pieces are 1-of-1 authentic vintage. Let me know if you need sizing advice, pit-to-pit fit comparisons, or natural light photos!",
    timestamp: "Just now",
    isRead: false,
  }
];

const getStoredMessages = (): ChatMessage[] => {
  const saved = localStorage.getItem(CHAT_STORAGE_KEY);
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
  return INITIAL_MESSAGES;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(getStoredMessages);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [attachedProduct, setAttachedProduct] = useState<AttachedProductSummary | null>(null);
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const openChatWithProduct = (item: Item) => {
    setAttachedProduct({
      id: item.id,
      title: item.title,
      pricePhp: item.pricePhp,
      tagSize: item.tagSize,
      thumbnailUrl: item.images[0] || '',
      recommendedFit: item.recommendedFit,
    });
    setIsChatOpen(true);
    markAllAsRead();
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
  };

  const sendMessage = async (text: string, imageAttachmentUrl?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'shopper',
      text: text || 'Sent an image attachment.',
      timestamp: timeFormatted,
      attachedProduct: attachedProduct || undefined,
      imageAttachmentUrl,
      isRead: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSellerTyping(true);

    // Natural simulated seller response (100% localStorage, zero HTTP fetch errors)
    setTimeout(() => {
      setIsSellerTyping(false);
      const sellerReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'seller',
        text: attachedProduct 
          ? `Got your inquiry regarding "${attachedProduct.title}". The piece is in top condition with exact measurements shown on the card. Let me know if you need it dispatched today!`
          : "Thanks for messaging P&R! All items on our drop page are verified 1-of-1 authentic vintage. Ready to dispatch!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: isChatOpen,
      };
      setMessages(prev => [...prev, sellerReply]);
      if (!isChatOpen) setUnreadCount(c => c + 1);
    }, 1000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isChatOpen,
        setIsChatOpen,
        openChatWithProduct,
        attachedProduct,
        setAttachedProduct,
        sendMessage,
        isSellerTyping,
        unreadCount,
        markAllAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
