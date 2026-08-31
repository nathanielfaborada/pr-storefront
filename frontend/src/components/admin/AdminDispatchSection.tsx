import React from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Button } from '../common/Button.tsx';
import { Printer, ShieldCheck } from 'lucide-react';

interface AdminDispatchSectionProps {
  orders: OrderPayload[];
  onPrintWaybill: (order: OrderPayload) => void;
}

export const AdminDispatchSection: React.FC<AdminDispatchSectionProps> = ({
  orders,
  onPrintWaybill,
}) => {
  // Privacy Helper: Masks recipient phone in admin preview cards
  const maskPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.length >= 10) {
      const first4 = cleaned.slice(0, 4);
      const last4 = cleaned.slice(-4);
      return `${first4}-***-${last4}`;
    }
    return phone.replace(/\d(?=\d{3})/g, '*');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {orders.map(order => (
          <div
            key={order.orderId}
            className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 space-y-3 sm:space-y-4 shadow-xs"
          >
            {/* Waybill Card Header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-zinc-100 gap-2">
              <div>
                <span className="font-heading font-bold text-sm sm:text-base text-zinc-950 block">
                  Waybill #{order.waybillNumber}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Recipient: <strong className="text-zinc-900">{order.shippingAddress.fullName}</strong>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    Courier: J&amp;T Express
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrintWaybill(order)}
                className="text-xs shrink-0"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                <span>Print Label</span>
              </Button>
            </div>

            {/* Recipient Details (Masked Phone for Privacy) */}
            <div className="text-xs space-y-1 bg-zinc-50 p-2.5 sm:p-3 rounded-xl border border-zinc-100 font-mono">
              <p className="font-bold text-zinc-900">
                {order.shippingAddress.streetAddress}, {order.shippingAddress.barangay}, {order.shippingAddress.city}
              </p>
              <p className="text-zinc-600">
                Region: <strong>{order.shippingAddress.region}</strong> · Contact:{' '}
                <strong className="text-orange-800 tracking-wider font-mono">
                  {maskPhoneNumber(order.shippingAddress.phoneNumber)}
                </strong>
                <span className="text-[10px] text-zinc-400 ml-1.5 inline-flex items-center gap-0.5" title="Unmasked on full printed waybill">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                  <span>Masked</span>
                </span>
              </p>
              {order.shippingAddress.landmarkNotes && (
                <p className="text-[10px] text-zinc-500 italic">Landmark: {order.shippingAddress.landmarkNotes}</p>
              )}
            </div>

            {/* Declared Value & Status */}
            <div className="flex items-center justify-between text-xs pt-1 font-mono">
              <span className="text-zinc-500">
                Declared Value: <strong className="text-zinc-950">{formatPhp(order.totalAmountPhp)}</strong>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Ready for Pickup
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
