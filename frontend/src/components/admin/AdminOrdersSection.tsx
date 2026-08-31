import React from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Eye } from 'lucide-react';

interface AdminOrdersSectionProps {
  orders: OrderPayload[];
  onInspectReceipt: (order: OrderPayload) => void;
}

export const AdminOrdersSection: React.FC<AdminOrdersSectionProps> = ({
  orders,
  onInspectReceipt,
}) => {
  // Privacy Helper: Masks phone number in table view
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
      <div className="border border-zinc-200 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
              <tr>
                <th className="p-3 sm:p-3.5">Order Code</th>
                <th className="p-3 sm:p-3.5">Buyer &amp; Mobile</th>
                <th className="p-3 sm:p-3.5">Payment Method</th>
                <th className="p-3 sm:p-3.5">13-Digit Ref #</th>
                <th className="p-3 sm:p-3.5">Amount Paid</th>
                <th className="p-3 sm:p-3.5">Status</th>
                <th className="p-3 sm:p-3.5 text-right">Audit Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map(order => (
                <tr key={order.orderId} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3 sm:p-3.5 font-bold text-zinc-950">{order.orderId}</td>
                  <td className="p-3 sm:p-3.5">
                    <span className="font-bold block text-zinc-900">{order.shippingAddress.fullName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {maskPhoneNumber(order.shippingAddress.phoneNumber)}
                    </span>
                  </td>
                  <td className="p-3 sm:p-3.5 uppercase font-bold text-blue-700">{order.paymentDetails.method}</td>
                  <td className="p-3 sm:p-3.5 text-zinc-800 font-bold">{order.paymentDetails.referenceNumber || 'COD'}</td>
                  <td className="p-3 sm:p-3.5 font-bold text-zinc-950">{formatPhp(order.totalAmountPhp)}</td>
                  <td className="p-3 sm:p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                      ✓ Payment Verified
                    </span>
                  </td>
                  <td className="p-3 sm:p-3.5 text-right space-x-2">
                    {order.paymentDetails.receiptImageUrl && (
                      <button
                        onClick={() => onInspectReceipt(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-950 text-white text-[10px] sm:text-[11px] font-semibold hover:bg-zinc-800 transition-colors shadow-xs"
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
