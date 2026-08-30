import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { OrderPayload } from '../types/index.ts';
import { orderService } from '../services/orderService.ts';
import { VisualTrackingPipeline } from '../components/order/VisualTrackingPipeline.tsx';
import { WaybillCard } from '../components/order/WaybillCard.tsx';
import { Button } from '../components/common/Button.tsx';
import { Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { useChat } from '../context/ChatContext.tsx';

export const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsChatOpen } = useChat();

  const [order, setOrder] = useState<OrderPayload | null>(() => {
    return (location.state as any)?.order || null;
  });
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      setIsLoading(true);
      orderService.getOrderById(orderId).then(data => {
        setOrder(data);
        setIsLoading(false);
      });
    }
  }, [orderId, order]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-zinc-500">
        Loading Courier Waybill Tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 font-mono">
        <h2 className="font-heading text-xl font-bold text-zinc-950">Order Not Found</h2>
        <p className="text-xs text-zinc-500 mt-2">Could not retrieve order manifest for reference #{orderId}.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold"
        >
          ← Return to Drops
        </button>
      </div>
    );
  }

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
            onClick={() => navigate('/')}
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
