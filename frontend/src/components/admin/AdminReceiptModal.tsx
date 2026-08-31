import React from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Modal } from '../common/Modal.tsx';
import { CheckCircle2 } from 'lucide-react';

interface AdminReceiptModalProps {
  order: OrderPayload | null;
  onClose: () => void;
  onApprovePayment: (orderId: string) => void;
  onCancelJoyMiner: (orderId: string) => void;
}

export const AdminReceiptModal: React.FC<AdminReceiptModalProps> = ({
  order,
  onClose,
  onApprovePayment,
  onCancelJoyMiner,
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={Boolean(order)}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-heading font-bold text-base text-zinc-950">
            Audit GCash/Maya Receipt Slip
          </span>
        </div>
      }
    >
      <div className="space-y-4 font-mono text-xs text-zinc-950">
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
          <p>
            Order: <strong>{order.orderId}</strong>
          </p>
          <p>
            Buyer: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phoneNumber})
          </p>
          <p>
            13-Digit Ref:{' '}
            <strong className="text-orange-800 text-sm">
              {order.paymentDetails.referenceNumber || 'N/A'}
            </strong>
          </p>
          <p>
            Declared Total: <strong className="text-zinc-950">{formatPhp(order.totalAmountPhp)}</strong>
          </p>
        </div>

        {order.paymentDetails.receiptImageUrl && (
          <div className="rounded-xl overflow-hidden border border-zinc-200 bg-black">
            <img
              src={order.paymentDetails.receiptImageUrl}
              alt="Receipt Screenshot"
              className="w-full max-h-80 object-contain mx-auto"
            />
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onCancelJoyMiner(order.orderId)}
            className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200 transition-colors"
          >
            ⚠️ Flag Joy Miner (Cancel)
          </button>

          <button
            onClick={() => onApprovePayment(order.orderId)}
            className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold transition-colors shadow-xs"
          >
            ✓ Valid GCash (Release Waybill)
          </button>
        </div>
      </div>
    </Modal>
  );
};
