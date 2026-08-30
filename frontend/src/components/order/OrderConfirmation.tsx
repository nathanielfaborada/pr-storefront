import React from 'react';
import { OrderPayload } from '../../types/index.ts';
import { Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { VisualTrackingPipeline } from './VisualTrackingPipeline.tsx';
import { WaybillCard } from './WaybillCard.tsx';
import { Button } from '../common/Button.tsx';
import { useChat } from '../../context/ChatContext.tsx';

interface OrderConfirmationProps {
  order: OrderPayload;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onContinueShopping,
}) => {
  const { setIsChatOpen } = useChat();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Celebratory Hero Header */}
      <div className="text-center space-y-3 bg-zinc-50 p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center mx-auto shadow-md animate-bounce">
          <Sparkles className="w-7 h-7 fill-black" />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          Mine Secured! 🏷️
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed font-mono">
          Your 1-of-1 streetwear drop has been secured under Order Reference{' '}
          <strong className="text-amber-700">{order.orderId}</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onContinueShopping}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Continue Browsing Drop 08
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Ask Stylist About Dispatch
          </Button>
        </div>
      </div>

      {/* Visual 5-Step Courier Fulfillment Tracker */}
      <VisualTrackingPipeline pipeline={order.trackingPipeline} />

      {/* Printable Courier Waybill */}
      <WaybillCard order={order} />

    </div>
  );
};
