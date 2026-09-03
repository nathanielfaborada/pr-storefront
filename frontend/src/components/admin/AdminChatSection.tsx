import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { ChatMessage, AttachedProductSummary } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import {
  MessageSquare,
  Search,
  Send,
  User,
  MapPin,
  Phone,
  CheckCheck,
  Sparkles,
  ArrowLeft,
  Tag,
  Clock,
  ShieldCheck,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Radio,
  ExternalLink
} from 'lucide-react';

export interface AdminChatThread {
  id: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessageTime: string;
  attachedProduct?: AttachedProductSummary;
  messages: ChatMessage[];
}

const ADMIN_THREADS_STORAGE_KEY = 'pr_admin_chat_threads_v3';

const INITIAL_THREADS: AdminChatThread[] = [
  {
    id: 'thread-live-01',
    customerName: 'Nathaniel Faborada',
    customerPhone: '0917-884-9124',
    customerLocation: 'Quezon City, Metro Manila',
    isOnline: true,
    unreadCount: 1,
    lastMessageTime: 'Just now',
    attachedProduct: {
      id: 'PR-BOXY-001',
      title: 'Heavyweight 260 GSM Drop-Shoulder Boxy Tee',
      pricePhp: 2450,
      tagSize: 'XL',
      thumbnailUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      recommendedFit: 'Boxy Large',
    },
    messages: [
      {
        id: 'msg-seed-101',
        sender: 'shopper',
        text: 'Peace! Available pa po ba yung Heavyweight Boxy Tee in Faded Charcoal? Bibilhin ko na sana today for Drop 08.',
        timestamp: '11:42 AM',
        isRead: true,
        attachedProduct: {
          id: 'PR-BOXY-001',
          title: 'Heavyweight 260 GSM Drop-Shoulder Boxy Tee',
          pricePhp: 2450,
          tagSize: 'XL',
          thumbnailUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
          recommendedFit: 'Boxy Large',
        },
      },
      {
        id: 'msg-seed-102',
        sender: 'seller',
        text: 'Yes po Nathaniel! 100% available and verified on Rack A-01. Pit-to-pit is 25.5 inches, heavyweight archival cotton.',
        timestamp: '11:45 AM',
        isRead: true,
      },
      {
        id: 'msg-seed-103',
        sender: 'shopper',
        text: 'Solid! Mag-50% GCash DP na ako today tapos COD na yung balance sa J&T courier upon parcel handover.',
        timestamp: '11:50 AM',
        isRead: false,
      }
    ],
  },
  {
    id: 'thread-02',
    customerName: 'Kenji Sato',
    customerPhone: '0920-551-9922',
    customerLocation: 'Makati City, Metro Manila',
    isOnline: true,
    unreadCount: 0,
    lastMessageTime: '10:30 AM',
    attachedProduct: {
      id: 'PR-HOOD-002',
      title: 'Archival French Terry Cropped Hoodie',
      pricePhp: 2850,
      tagSize: 'L',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      recommendedFit: 'Cropped Boxy Fit',
    },
    messages: [
      {
        id: 'msg-seed-201',
        sender: 'shopper',
        text: 'Good morning studio! Inquire po sa French Terry Hoodie. Sun-faded vintage po ba talaga ang wash finish nito?',
        timestamp: '10:15 AM',
        isRead: true,
      },
      {
        id: 'msg-seed-202',
        sender: 'seller',
        text: 'Yes Kenji! Natural sun-faded patina wash with raw hem crop. 1-of-1 archival piece ready for courier pickup.',
        timestamp: '10:20 AM',
        isRead: true,
      },
      {
        id: 'msg-seed-203',
        sender: 'shopper',
        text: 'Solid! Checkout ko na sa website mamaya.',
        timestamp: '10:30 AM',
        isRead: true,
      }
    ],
  },
  {
    id: 'thread-03',
    customerName: 'Bea Corpuz',
    customerPhone: '0919-442-8811',
    customerLocation: 'Pasig City, Metro Manila',
    isOnline: false,
    unreadCount: 0,
    lastMessageTime: 'Yesterday',
    attachedProduct: {
      id: 'PR-CARGO-003',
      title: 'Wide-Leg Parachute Cargo Trousers',
      pricePhp: 2650,
      tagSize: 'M (30-33")',
      thumbnailUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
      recommendedFit: 'Wide-Leg Drape',
    },
    messages: [
      {
        id: 'msg-seed-301',
        sender: 'shopper',
        text: 'Hi seller, may adjustable bungee drawstrings po ba sa hemline ng Parachute Cargos?',
        timestamp: 'Yesterday',
        isRead: true,
      },
      {
        id: 'msg-seed-302',
        sender: 'seller',
        text: 'Opo Bea, may heavy-duty ankle bungees para puwedeng wide-leg baggy drape or cinched tapered balloon silhouette.',
        timestamp: 'Yesterday',
        isRead: true,
      }
    ],
  }
];

const getStoredThreads = (): AdminChatThread[] => {
  const saved = localStorage.getItem(ADMIN_THREADS_STORAGE_KEY);
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
  return INITIAL_THREADS;
};

export const AdminChatSection: React.FC = () => {
  const [threads, setThreads] = useState<AdminChatThread[]>(getStoredThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('thread-live-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'attached'>('all');
  const [inputText, setInputText] = useState('');
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const { messages: liveStorefrontMessages } = useChat();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync with live storefront shopper messages when updated
  useEffect(() => {
    if (liveStorefrontMessages && liveStorefrontMessages.length > 0) {
      setThreads(prevThreads => {
        return prevThreads.map(t => {
          if (t.id === 'thread-live-01') {
            const lastMsg = liveStorefrontMessages[liveStorefrontMessages.length - 1];
            return {
              ...t,
              messages: liveStorefrontMessages,
              lastMessageTime: lastMsg ? lastMsg.timestamp : t.lastMessageTime,
            };
          }
          return t;
        });
      });
    }
  }, [liveStorefrontMessages]);

  // Persist threads in localStorage
  useEffect(() => {
    localStorage.setItem(ADMIN_THREADS_STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThreadId, threads]);

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const filteredThreads = threads.filter(t => {
    if (filterTab === 'unread' && t.unreadCount === 0) return false;
    if (filterTab === 'attached' && !t.attachedProduct) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.customerName.toLowerCase().includes(q) ||
      t.customerPhone.includes(q) ||
      t.customerLocation.toLowerCase().includes(q) ||
      (t.attachedProduct && t.attachedProduct.title.toLowerCase().includes(q))
    );
  });

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setIsMobileViewingChat(true);
    setIsPhoneRevealed(false);

    // Mark messages as read
    setThreads(prev =>
      prev.map(t => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeThread) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReply: ChatMessage = {
      id: `admin-msg-${Date.now()}`,
      sender: 'seller',
      text,
      timestamp: timeFormatted,
      isRead: true,
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessageTime: timeFormatted,
            messages: [...t.messages, newReply],
          };
        }
        return t;
      })
    );

    // If it's the live storefront thread, sync directly to live shopper messages store
    if (activeThread.id === 'thread-live-01') {
      const liveKey = 'pr_chat_messages_v1';
      try {
        const stored = JSON.parse(localStorage.getItem(liveKey) || '[]');
        stored.push(newReply);
        localStorage.setItem(liveKey, JSON.stringify(stored));
      } catch {
        // Fallback
      }
    }

    setInputText('');
    toast.success('Reply dispatched to customer.', 'Message Sent');
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    toast.success(`Phone ${phone} copied to clipboard!`, 'Copied');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const formatMaskedPhone = (phone: string, reveal: boolean) => {
    if (reveal) return phone;
    const parts = phone.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-***-${parts[2]}`;
    }
    return phone.slice(0, 4) + '****' + phone.slice(-4);
  };

  const quickReplies = [
    "Available pa po! 100% authentic vintage piece.",
    "Pit-to-pit size is exact as measured in the specs.",
    "Puwede po i-dispatch agad via J&T Express today!",
    "50% GCash DP + 50% COD balance upon parcel handover.",
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden font-mono text-zinc-950 flex flex-col h-[78vh] min-h-[580px]">
      
      {/* 1. Main 2-Column Console Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: THREADS SIDEBAR (Full width on mobile when not viewing chat)     */}
        {/* ========================================================================= */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-zinc-200 flex flex-col bg-zinc-50/50 shrink-0 ${
            isMobileViewingChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Bar & Filter Header */}
          <div className="p-3 border-b border-zinc-200 bg-white space-y-2">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search customer, phone, or piece..."
                className="w-full h-9 pl-8 pr-7 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
              {[
                { id: 'all' as const, label: 'All', count: threads.length },
                { id: 'unread' as const, label: 'Unread', count: threads.filter(t => t.unreadCount > 0).length },
                { id: 'attached' as const, label: 'With Pieces', count: threads.filter(t => Boolean(t.attachedProduct)).length },
              ].map(tab => {
                const isSelected = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-zinc-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 space-y-2">
                <MessageSquare className="w-6 h-6 mx-auto text-zinc-300" />
                <p>No matching conversations found.</p>
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = thread.id === activeThread?.id;
                const lastMessage = thread.messages[thread.messages.length - 1];

                return (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`w-full p-3 text-left transition-all flex items-start gap-2.5 cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-orange-600 shadow-2xs'
                        : 'hover:bg-zinc-100/70'
                    }`}
                  >
                    {/* Avatar with Online Badge */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                        {thread.customerName.charAt(0)}
                      </div>
                      {thread.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-zinc-950 truncate">
                          {thread.customerName}
                        </h4>
                        <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                          {thread.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {lastMessage ? (
                          <span>
                            {lastMessage.sender === 'seller' && <strong className="text-zinc-700">You: </strong>}
                            {lastMessage.text}
                          </span>
                        ) : 'No messages yet'}
                      </p>

                      {/* Tag Size / Item Chip */}
                      {thread.attachedProduct && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] bg-orange-50 text-orange-800 border border-orange-200 px-1.5 py-0.2 rounded font-bold truncate max-w-full">
                          <Tag className="w-2.5 h-2.5 shrink-0 text-orange-600" />
                          <span className="truncate">{thread.attachedProduct.title} ({thread.attachedProduct.tagSize})</span>
                        </div>
                      )}
                    </div>

                    {/* Unread Pill */}
                    {thread.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {thread.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: ACTIVE CHAT CONSOLE                                             */}
        {/* ========================================================================= */}
        {activeThread ? (
          <div
            className={`flex-1 flex flex-col bg-white overflow-hidden ${
              !isMobileViewingChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* 1. Chat Header */}
            <div className="p-3 sm:p-3.5 border-b border-zinc-200 bg-zinc-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setIsMobileViewingChat(false)}
                  className="md:hidden p-1.5 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
                  title="Back to conversation list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {activeThread.customerName.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-xs text-zinc-950 truncate">
                      {activeThread.customerName}
                    </h3>

                    {/* Phone with NPC Asterisk Mask & Reveal */}
                    <div className="flex items-center gap-1 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200 text-[10px] font-mono text-zinc-700">
                      <Phone className="w-2.5 h-2.5 text-zinc-400" />
                      <span>{formatMaskedPhone(activeThread.customerPhone, isPhoneRevealed)}</span>
                      
                      <button
                        type="button"
                        onClick={() => setIsPhoneRevealed(!isPhoneRevealed)}
                        className="text-zinc-400 hover:text-zinc-900 ml-0.5 cursor-pointer"
                        title={isPhoneRevealed ? 'Hide phone' : 'Reveal full phone'}
                      >
                        {isPhoneRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyPhone(activeThread.customerPhone)}
                        className="text-zinc-400 hover:text-zinc-900 ml-0.5 cursor-pointer"
                        title="Copy phone"
                      >
                        {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 flex items-center gap-1 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="truncate">{activeThread.customerLocation}</span>
                  </p>
                </div>
              </div>

              {/* Online Indicator Badge */}
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Shopper</span>
              </div>
            </div>

            {/* 2. Attached Product Card (If available) */}
            {activeThread.attachedProduct && (
              <div className="p-2.5 sm:p-3 bg-orange-50/70 border-b border-orange-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeThread.attachedProduct.thumbnailUrl}
                    alt={activeThread.attachedProduct.title}
                    className="w-10 h-10 rounded-xl object-cover border border-orange-200 bg-zinc-900 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-orange-800 block">
                      Inquired Item · {activeThread.attachedProduct.id}
                    </span>
                    <h4 className="font-bold text-xs text-zinc-950 truncate">
                      {activeThread.attachedProduct.title}
                    </h4>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      Tag Size: <strong>{activeThread.attachedProduct.tagSize}</strong> · {formatPhp(activeThread.attachedProduct.pricePhp)}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-white text-orange-950 px-2.5 py-1 rounded-xl border border-orange-300 shadow-2xs shrink-0 font-mono">
                  1-of-1 Vault Item
                </span>
              </div>
            )}

            {/* 3. Messages Feed */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-zinc-50/40">
              {activeThread.messages.map(msg => {
                const isSeller = msg.sender === 'seller';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[9px] text-zinc-400 font-bold uppercase font-mono">
                      <span>{isSeller ? 'P&R Studio Curator' : activeThread.customerName}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isSeller
                          ? 'bg-zinc-950 text-white rounded-tr-sm shadow-sm'
                          : 'bg-white border border-zinc-200 text-zinc-900 rounded-tl-sm shadow-2xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {isSeller && (
                      <span className="text-[9px] text-zinc-400 flex items-center gap-1 mt-0.5 font-mono">
                        <CheckCheck className="w-3 h-3 text-orange-500" />
                        <span>Delivered</span>
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* 4. Quick Reply Action Chips */}
            <div className="p-2 border-t border-zinc-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 pl-1">
                ⚡ Quick Reply:
              </span>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-transparent text-[10px] text-zinc-700 font-bold whitespace-nowrap transition-all shrink-0 active:scale-98 cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* 5. Input Bar */}
            <div className="p-3 border-t border-zinc-200 bg-white shrink-0">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`Reply to ${activeThread.customerName}...`}
                  className="flex-1 h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 font-mono shadow-2xs"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="h-10 px-4 rounded-xl bg-zinc-950 hover:bg-orange-600 disabled:opacity-40 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-xs active:scale-98 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send Reply</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-400 font-mono text-xs">
            Select a customer conversation to start chatting.
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminChatSection;
