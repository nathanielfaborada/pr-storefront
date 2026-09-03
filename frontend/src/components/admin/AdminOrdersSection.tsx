import React from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Eye, Receipt, Phone, User, QrCode, CheckCircle2 } from 'lucide-react';

interface AdminOrdersSectionProps {
  orders: OrderPayload[];
  onInspectReceipt: (order: OrderPayload) => void;
}

export const AdminOrdersSection: React.FC<AdminOrdersSectionProps> = ({
  orders,
  onInspectReceipt,
}) => {
  // Privacy Helper: Masks phone number in view
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
    <div className="space-y-3 font-mono text-zinc-950">
      
      {/* 1. MOBILE VIEW: Native-Style Responsive Order Cards (hidden on md and up) */}
      <div className="md:hidden space-y-3">
        {orders.map(order => (
          <div
            key={order.orderId}
            className="bg-white rounded-2xl border border-zinc-200 p-3.5 shadow-xs space-y-3"
          >
            {/* Top Row: Order ID & Status Badge */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-100">
              <span className="font-bold text-xs text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md">
                {order.orderId}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            </div>

            {/* Middle Grid: Customer & Payment Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              
              {/* Customer Info */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Buyer</span>
                <span className="font-bold text-zinc-900 block truncate">{order.shippingAddress.fullName}</span>
                <span className="text-[11px] text-zinc-500 font-mono block">
                  {maskPhoneNumber(order.shippingAddress.phoneNumber)}
                </span>
              </div>

              {/* Payment Details */}
              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Method &amp; Ref #</span>
                <span className="font-bold text-blue-700 uppercase block text-[11px]">
                  {order.paymentDetails.method}
                </span>
                <span className="text-[11px] text-zinc-700 font-bold block truncate">
                  #{order.paymentDetails.referenceNumber || 'COD'}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            {order.items && order.items.length > 0 && (
              <div className="bg-zinc-50 rounded-xl p-2 text-[11px] text-zinc-600 space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="truncate flex-1 pr-2">{item.title}</span>
                    <strong className="text-zinc-900 shrink-0">Size {item.tagSize}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Row: Total Amount & View Slip Action */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Amount Paid</span>
                <span className="font-bold text-base text-zinc-950 block leading-tight">
                  {formatPhp(order.totalAmountPhp)}
                </span>
              </div>

              {order.paymentDetails.receiptImageUrl && (
                <button
                  onClick={() => onInspectReceipt(order)}
                  className="h-9 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors active:scale-98"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Slip</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* 2. DESKTOP / TABLET VIEW: Full Clean Table (hidden on mobile, visible on md and up) */}
      <div className="hidden md:block border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Order Code</th>
                <th className="p-3.5">Buyer &amp; Mobile</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">13-Digit Ref #</th>
                <th className="p-3.5">Amount Paid</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Audit Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map(order => (
                <tr key={order.orderId} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3.5 font-bold text-zinc-950">{order.orderId}</td>
                  <td className="p-3.5">
                    <span className="font-bold block text-zinc-900">{order.shippingAddress.fullName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {maskPhoneNumber(order.shippingAddress.phoneNumber)}
                    </span>
                  </td>
                  <td className="p-3.5 uppercase font-bold text-blue-700">{order.paymentDetails.method}</td>
                  <td className="p-3.5 text-zinc-800 font-bold">{order.paymentDetails.referenceNumber || 'COD'}</td>
                  <td className="p-3.5 font-bold text-zinc-950">{formatPhp(order.totalAmountPhp)}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {order.paymentDetails.receiptImageUrl && (
                      <button
                        onClick={() => onInspectReceipt(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrdersSection;
