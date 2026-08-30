import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Sparkles, CheckCheck } from 'lucide-react';

interface MessageThreadProps {
  messages: ChatMessage[];
  isSellerTyping: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ messages, isSellerTyping }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSellerTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-white">
      {messages.map(msg => {
        const isShopper = msg.sender === 'shopper';

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isShopper ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mb-1 px-1">
              {!isShopper && (
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  P&amp;R Stylist
                </span>
              )}
              {isShopper && <span>You</span>}
              <span>·</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Message Bubble Container */}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                isShopper
                  ? 'bg-zinc-950 text-white font-medium rounded-br-none shadow-sm'
                  : 'bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-bl-none shadow-sm'
              }`}
            >
              {/* Attached product card preview if message was sent with product reference */}
              {msg.attachedProduct && (
                <div className={`mb-2 p-2 rounded-xl flex items-center gap-2 border ${
                  isShopper 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
                }`}>
                  <img
                    src={msg.attachedProduct.thumbnailUrl}
                    alt={msg.attachedProduct.title}
                    className="w-9 h-11 object-cover rounded-lg shrink-0 bg-zinc-100 border border-zinc-200"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-heading font-bold truncate">
                      {msg.attachedProduct.title}
                    </p>
                    <p className="text-[10px] font-mono opacity-80">
                      {formatPhp(msg.attachedProduct.pricePhp)} · Tag: {msg.attachedProduct.tagSize}
                    </p>
                  </div>
                </div>
              )}

              {/* Message Text */}
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Image attachment if provided */}
              {msg.imageAttachmentUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img
                    src={msg.imageAttachmentUrl}
                    alt="Chat Attachment"
                    className="max-h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Read Receipt */}
            {isShopper && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 mt-0.5 px-1">
                <CheckCheck className="w-3 h-3 text-amber-600" />
                <span>Delivered</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Stylist Typing Indicator */}
      {isSellerTyping && (
        <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 rounded-2xl px-3 py-2 text-xs font-mono text-zinc-600 w-max animate-pulse shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>Stylist is reviewing fitpics...</span>
          <div className="flex gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
