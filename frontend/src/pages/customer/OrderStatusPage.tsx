import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { OrderPayload } from '../../types/index.ts';
import { orderService } from '../../services/orderService.ts';
import { VisualTrackingPipeline } from '../../components/order/VisualTrackingPipeline.tsx';
import { WaybillCard } from '../../components/order/WaybillCard.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { useChat } from '../../context/ChatContext.tsx';

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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-mono">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-zinc-200 rounded w-1/3 mx-auto" />
          <div className="h-48 bg-zinc-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-mono">
        <h2 className="font-heading text-2xl font-bold text-zinc-950 mb-2">Order Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">
          We could not locate an order with tracking code: <strong className="text-zinc-900">{orderId}</strong>.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/')}>
          ← Return to Drop 08
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 font-mono">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {order.fulfillmentStatus.replace('_', ' ')}
          </span>
          <span className="text-xs text-zinc-400">Order: {order.orderId}</span>
        </div>
      </div>

      {/* Visual Tracking Pipeline */}
      <VisualTrackingPipeline
        currentStatus={order.fulfillmentStatus}
        pipeline={order.trackingPipeline}
      />

      {/* J&T Courier Waybill Card */}
      <WaybillCard order={order} />

      {/* Chat with Seller Helper */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Need Same-Day Dispatch or Rider Coordination?</span>
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Directly message the P&amp;R Studio dispatch team for rush delivery or courier changes.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsChatOpen(true)}
          className="shrink-0 text-xs"
        >
          <MessageSquare className="w-4 h-4 mr-1.5 text-zinc-600" />
          <span>Message Studio</span>
        </Button>
      </div>
    </div>
  );
};
