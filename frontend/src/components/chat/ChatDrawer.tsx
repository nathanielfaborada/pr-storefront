import React from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext.tsx';
import { ProductContextCard } from './ProductContextCard.tsx';
import { QuickActionChips } from './QuickActionChips.tsx';
import { MessageThread } from './MessageThread.tsx';
import { ChatInputBar } from './ChatInputBar.tsx';

export const ChatDrawer: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    messages,
    attachedProduct,
    setAttachedProduct,
    sendMessage,
    isSellerTyping,
    unreadCount,
    markAllAsRead,
  } = useChat();

  const handleOpen = () => {
    setIsChatOpen(true);
    markAllAsRead();
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* Persistent Floating Chat Trigger Bubble */}
      {!isChatOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-zinc-950 text-white shadow-xl hover:scale-105 active:scale-95 transition-all group flex items-center gap-2 border border-zinc-800"
          title="Live Sizing DM"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="hidden md:inline font-mono font-bold text-xs pr-1">Stylist DM</span>
        </button>
      )}

      {/* Slide-out Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleClose}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-w-md bg-white border-l border-zinc-200 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-zinc-900">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-heading font-bold text-sm shadow-sm">
                    P&amp;R
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm text-zinc-950">P&amp;R Stylist Concierge</h3>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500">Live · Fitpics, Video Drape &amp; Sizing</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Product Card if attached */}
            {attachedProduct && (
              <div className="p-3 bg-zinc-50 border-b border-zinc-200">
                <ProductContextCard
                  product={attachedProduct}
                  onRemove={() => setAttachedProduct(null)}
                />
              </div>
            )}

            {/* Live Message Thread */}
            <MessageThread
              messages={messages}
              isSellerTyping={isSellerTyping}
            />

            {/* Quick Action Inquiry Chips */}
            <div className="px-3 py-1 bg-zinc-50 border-t border-zinc-200">
              <QuickActionChips
                hasAttachedProduct={Boolean(attachedProduct)}
                onSelectChip={(text) => sendMessage(text)}
              />
            </div>

            {/* Chat Input Bar */}
            <ChatInputBar
              onSendMessage={sendMessage}
              disabled={isSellerTyping}
            />

          </div>
        </div>
      )}
    </>
  );
};
