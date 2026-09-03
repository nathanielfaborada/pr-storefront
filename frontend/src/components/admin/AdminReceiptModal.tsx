import React, { useState } from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Modal } from '../common/Modal.tsx';
import { ConfirmModal } from '../common/ConfirmModal.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import {
  CheckCircle2,
  XCircle,
  QrCode,
  Zap,
  Receipt,
  User,
  Check,
  Copy,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

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
  const toast = useToast();
  const [activeModeTab, setActiveModeTab] = useState<'option1_manual' | 'option2_paymongo'>('option1_manual');
  const [copiedRef, setCopiedRef] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isPhoneUnmasked, setIsPhoneUnmasked] = useState(false);
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);

  if (!order) return null;

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

  const halfPaymentDeposit = Math.round(order.totalAmountPhp / 2);
  const remainingBalanceCod = order.totalAmountPhp - halfPaymentDeposit;

  // PayMongo Automated Fee Breakdown (2.5% transaction fee)
  const paymongoFee = Math.round(halfPaymentDeposit * 0.025 * 100) / 100;
  const paymongoNet = halfPaymentDeposit - paymongoFee;

  const handleCopyRef = () => {
    if (order.paymentDetails.referenceNumber) {
      navigator.clipboard.writeText(order.paymentDetails.referenceNumber);
      setCopiedRef(true);
      toast.info(`Ref #${order.paymentDetails.referenceNumber} copied to clipboard.`, 'Reference Copied');
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={Boolean(order)}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-start gap-2.5 font-mono">
          <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0 mt-0.5">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-sm sm:text-base text-zinc-950 leading-tight">
              Payment Verification
            </h2>
            <span className="text-[10px] text-zinc-500 font-mono block">
              FinTech Transaction Audit
            </span>
            <span className="mt-1 inline-block text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
              {order.orderId}
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-2.5 font-mono text-xs text-zinc-950">
        
        {/* 1. COMPACT PROFILE & POLICY STRIP */}
        <div className="space-y-1.5">
          
          {/* Customer Row */}
          <div className="bg-white rounded-xl border border-zinc-200 px-3 py-2 flex items-center justify-between gap-2 text-xs shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
                <User className="w-3 h-3" />
              </div>
              <strong className="text-zinc-950 font-bold truncate">
                {order.shippingAddress.fullName}
              </strong>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-zinc-500 font-mono text-[11px]">
                {isPhoneUnmasked ? order.shippingAddress.phoneNumber : maskPhoneNumber(order.shippingAddress.phoneNumber)}
              </span>
              <button
                type="button"
                onClick={() => setIsPhoneUnmasked(!isPhoneUnmasked)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                title={isPhoneUnmasked ? 'Hide Phone' : 'Reveal Phone'}
              >
                {isPhoneUnmasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-zinc-400" />}
              </button>
            </div>
          </div>

          {/* 50% Downpayment Banner (Compact Inline Row) */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px]">
            <span className="font-bold text-orange-950 tracking-tight flex items-center gap-1.5 text-[10px] sm:text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>50% DOWNPAYMENT REQUIRED</span>
            </span>
            <span className="text-[9px] font-bold text-orange-800 bg-white px-2 py-0.5 rounded uppercase font-mono tracking-wide">
              MANDATORY
            </span>
          </div>
        </div>

        {/* 2. PRICE SPLIT CARD (2-Tone Compact Summary Box) */}
        <div className="rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
          
          {/* Upper Half: Highlighted DUE NOW Amount */}
          <div className="bg-orange-50/70 p-2.5 text-center border-b border-orange-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 block">
              DUE NOW (50% DEPOSIT)
            </span>
            <strong className="font-mono font-bold text-xl sm:text-2xl text-orange-600 block leading-tight mt-0.5">
              {formatPhp(halfPaymentDeposit)}
            </strong>
          </div>

          {/* Lower Half: 2-Column Split */}
          <div className="bg-white p-2.5 grid grid-cols-2 divide-x divide-zinc-200 text-center text-xs">
            <div className="pr-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Total Order
              </span>
              <strong className="text-zinc-900 text-xs font-mono font-semibold block mt-0.5">
                {formatPhp(order.totalAmountPhp)}
              </strong>
            </div>

            <div className="pl-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Balance (COD)
              </span>
              <strong className="text-zinc-700 text-xs font-mono font-semibold block mt-0.5">
                {formatPhp(remainingBalanceCod)}
              </strong>
            </div>
          </div>
        </div>

        {/* 3. PAYMENT METHOD TABS (Grid 2-Column with Short Labels) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
          
          {/* Tab 1: Manual GCash */}
          <button
            onClick={() => setActiveModeTab('option1_manual')}
            className={`py-2 px-1 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 text-xs truncate ${
              activeModeTab === 'option1_manual'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
            }`}
          >
            <QrCode className={`w-3.5 h-3.5 shrink-0 ${activeModeTab === 'option1_manual' ? 'text-orange-400' : 'text-zinc-400'}`} />
            <span className="truncate">Manual GCash (0%)</span>
          </button>

          {/* Tab 2: PayMongo Auto */}
          <button
            onClick={() => setActiveModeTab('option2_paymongo')}
            className={`py-2 px-1 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 text-xs truncate ${
              activeModeTab === 'option2_paymongo'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 shrink-0 ${activeModeTab === 'option2_paymongo' ? 'text-blue-400' : 'text-zinc-400'}`} />
            <span className="truncate">PayMongo (Auto)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: OPTION 1 - MANUAL QR & SCREENSHOT SLIP (0% FEE)                   */}
        {/* ========================================================================= */}
        {activeModeTab === 'option1_manual' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            
            {/* GCash Reference Row (Responsive Flex) */}
            <div className="bg-white rounded-xl border border-zinc-200 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                  13-Digit GCash Ref #
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <strong className="text-zinc-950 text-xs sm:text-sm font-mono tracking-wider truncate">
                    {order.paymentDetails.referenceNumber || '100982348123'}
                  </strong>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-950 transition-colors shrink-0"
                    title="Copy Reference Number"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-mono whitespace-nowrap shrink-0">
                0% Platform Fee
              </span>
            </div>

            {/* Receipt Screenshot Card with Zoom Toggle */}
            {order.paymentDetails.receiptImageUrl && (
              <div className="bg-white rounded-xl border border-zinc-200 p-2.5 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span className="text-[11px]">Customer Uploaded Screenshot:</span>
                  <button
                    onClick={() => setIsImageExpanded(!isImageExpanded)}
                    className="text-orange-600 hover:text-orange-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isImageExpanded ? 'Collapse' : 'Tap to Zoom'}</span>
                  </button>
                </div>
                
                <div className={`rounded-lg overflow-hidden border border-zinc-200 bg-zinc-900 transition-all ${
                  isImageExpanded ? 'max-h-80' : 'max-h-40'
                }`}>
                  <img
                    src={order.paymentDetails.receiptImageUrl}
                    alt="Receipt Screenshot"
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons (Stacked on Mobile, Side-by-Side on Desktop) */}
            <div className="pt-0.5 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmRejectOpen(true)}
                className="w-full sm:flex-1 h-10 rounded-xl bg-white hover:bg-red-50 text-zinc-600 hover:text-red-700 font-bold border border-zinc-200 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5 text-xs active:scale-98 cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-zinc-400" />
                <span>Reject / Cancel Slip</span>
              </button>

              <button
                type="button"
                onClick={() => onApprovePayment(order.orderId)}
                className="w-full sm:flex-1 h-10 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-xs active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ Approve &amp; Release Waybill</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: OPTION 2 - AUTOMATED PAYMONGO GATEWAY (AUTO-PILOT)                 */}
        {/* ========================================================================= */}
        {activeModeTab === 'option2_paymongo' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            
            {/* PayMongo Financial Breakdown Card */}
            <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-2xs space-y-2.5">
              
              {/* Webhook Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <strong className="text-zinc-950 text-xs">
                    PayMongo Webhook: <span className="text-emerald-700">paid.success</span>
                  </strong>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono bg-zinc-100 px-2 py-0.5 rounded">
                  pay_98a4xLq92m
                </span>
              </div>

              {/* Financial Calculation Lines */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Gross 50% Deposit Received:</span>
                  <strong className="text-zinc-950 font-mono">{formatPhp(halfPaymentDeposit)}</strong>
                </div>

                <div className="flex items-center justify-between text-zinc-500">
                  <span>PayMongo Processing Fee (2.5%):</span>
                  <span className="text-red-600 font-mono">- {formatPhp(paymongoFee)}</span>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-orange-700 font-bold">Net Payout to Studio Bank:</span>
                  <strong className="text-orange-600 text-sm font-mono font-bold">
                    {formatPhp(paymongoNet)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Zero-Touch Dispatch Box */}
            <div className="p-2.5 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-orange-950 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Admin Action Required</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-600 leading-relaxed">
                Kusa nang na-verify ang 50% deposit via PayMongo Webhook. Ang <strong>J&amp;T Courier Waybill</strong> ay kusa nang nai-stage sa Dispatch na may kokolektahing <strong>{formatPhp(remainingBalanceCod)} COD</strong> balance.
              </p>
            </div>

            {/* Live Automated Status Bar & Close */}
            <div className="pt-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-zinc-100 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] sm:text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Status: Waybill Ready for J&amp;T</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-bold transition-all text-xs active:scale-98 cursor-pointer"
              >
                Done / Close
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Reject Slip Confirmation Modal */}
      {isConfirmRejectOpen && (
        <ConfirmModal
          isOpen={isConfirmRejectOpen}
          onClose={() => setIsConfirmRejectOpen(false)}
          onConfirm={() => {
            onCancelJoyMiner(order.orderId);
            setIsConfirmRejectOpen(false);
          }}
          title="Decline & Reject Payment Slip?"
          description="Are you sure you want to reject this payment receipt and cancel the order from the dispatch queue?"
          itemName={`${order.shippingAddress.fullName} · ${order.orderId} (GCash Ref #${order.paymentDetails.referenceNumber || 'N/A'})`}
          confirmText="Yes, Reject Slip"
          cancelText="Keep Slip"
          variant="danger"
        />
      )}
    </Modal>
  );
};

export default AdminReceiptModal;
