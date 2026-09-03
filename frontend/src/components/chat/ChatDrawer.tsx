import React from 'react';
import { MessageSquare, Sparkles, X, Lock, ShieldCheck, Ruler, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { useChat } from '../../context/ChatContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ProductContextCard } from './ProductContextCard.tsx';
import { QuickActionChips } from './QuickActionChips.tsx';
import { MessageThread } from './MessageThread.tsx';
import { ChatInputBar } from './ChatInputBar.tsx';
import { PRMonogramLogo } from '../common/PRMonogramLogo.tsx';

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

  const { isAuthenticated, setIsAuthModalOpen, loginWithGoogle } = useAuth();

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
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-zinc-950 text-white shadow-xl hover:scale-105 active:scale-95 transition-all group flex items-center gap-2 border border-zinc-800 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex justify-end font-mono">
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
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                    isAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm text-zinc-950">P&amp;R Stylist Concierge</h3>
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Live · Pandi Studio Sizing &amp; Support
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
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

            {/* ========================================================================= */}
            {/* VIEW 1: AUTHENTICATED CHAT INTERFACE                                      */}
            {/* ========================================================================= */}
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              /* ========================================================================= */
              /* VIEW 2: NON-AUTHENTICATED LOCKED ACCESS PROMPT                            */
              /* ========================================================================= */
              <div className="flex-1 flex flex-col justify-between p-6 bg-zinc-50/50">
                <div className="space-y-5 pt-4 text-center">
                  
                  

                  <div className="space-y-1">
                    <h4 className="font-heading text-lg font-bold text-zinc-950">
                      Sign In to Chat with Stylist
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                      Please sign in with your account to ask questions about measurements, fabric condition, or delivery.
                    </p>
                  </div>

                  {/* What You Can Ask List */}
                  <div className="bg-white rounded-2xl p-4 border border-zinc-200 text-left space-y-3 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                      What you can ask our team:
                    </span>

                    <div className="space-y-2.5 text-xs text-zinc-700">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                          <Ruler className="w-3 h-3" />
                        </div>
                        <div>
                          <strong className="text-zinc-950 block">Exact Measurements &amp; Fit Advice</strong>
                          <span className="text-[11px] text-zinc-500">Pit-to-pit chest width, shoulder drop, and length.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                          <Camera className="w-3 h-3" />
                        </div>
                        <div>
                          <strong className="text-zinc-950 block">Fabric Condition &amp; Sanitization</strong>
                          <span className="text-[11px] text-zinc-500">Pre-washed, sanitized, and steam-curated pieces.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div>
                          <strong className="text-zinc-950 block">Order &amp; Courier Inquiries</strong>
                          <span className="text-[11px] text-zinc-500">J&amp;T Express tracking, COD balance, and dispatch schedule.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign-In Actions (Locked for Demo) */}
                <div className="space-y-2.5 pt-4">
                  <button
                    type="button"
                    disabled
                    title="Customer Sign In is locked for this demo"
                    className="w-full h-11 rounded-xl bg-zinc-200 border border-zinc-300 text-zinc-500 font-bold transition-all flex items-center justify-center gap-2 text-xs opacity-75 cursor-not-allowed shadow-2xs font-mono"
                  >
                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>⚡ Sign In (Locked for Studio Demo)</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Secure Encrypted Session · Pandi Hub</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default ChatDrawer;
