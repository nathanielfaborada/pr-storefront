import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { ShippingAddress, PaymentMethod, OrderPayload } from '../../types/index.ts';
import { orderService } from '../../services/orderService.ts';
import { formatPhp } from '../../utils/index.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { ShippingForm } from './ShippingForm.tsx';
import { PaymentSelector } from './PaymentSelector.tsx';
import { QRPaymentCard } from './QRPaymentCard.tsx';
import { ReceiptUploadDropzone } from './ReceiptUploadDropzone.tsx';
import { PolicyDisclaimer } from './PolicyDisclaimer.tsx';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: OrderPayload) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { cart, subtotalPhp, shippingFeePhp, totalPhp, clearCart } = useCart();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phoneNumber: '',
    region: 'Metro Manila',
    city: '',
    barangay: '',
    streetAddress: '',
    landmarkNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phoneNumber || !shippingAddress.city || !shippingAddress.streetAddress) {
      toast.warning('Please complete all required shipping fields before proceeding.', 'Missing Information');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!policyAccepted) {
      toast.warning('Please confirm the 1-of-1 streetwear policy checkbox.', 'Policy Check');
      return;
    }

    if (paymentMethod !== 'cod' && !referenceNumber) {
      toast.warning('Please enter your 13-digit GCash / Maya reference number.', 'Payment Proof Required');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdOrder = await orderService.createOrder({
        items: cart.map(ci => ci.item),
        shippingAddress,
        paymentDetails: {
          method: paymentMethod,
          referenceNumber: referenceNumber || '100982348123',
          receiptImageUrl: receiptUrl || undefined,
          paidAmountPhp: totalPhp,
        },
        subtotalPhp,
        shippingFeePhp,
        discountPhp: 0,
        totalAmountPhp: totalPhp,
        vintagePolicyAccepted: true,
      });

      clearCart();
      toast.success(`Order ${createdOrder.orderId} placed successfully!`, 'Order Confirmed');
      onOrderCompleted(createdOrder);
      onClose();
    } catch {
      toast.error('Failed to place order. Please try again.', 'Order Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="font-heading font-bold text-base text-zinc-950">Fast Checkout</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
            Step {step} of 2
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <ShippingForm
              address={shippingAddress}
              onChange={(updated) => setShippingAddress(prev => ({ ...prev, ...updated }))}
            />

            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between font-mono">
              <span className="text-xs text-zinc-500">
                Total: <strong className="font-mono text-sm text-zinc-950">{formatPhp(totalPhp)}</strong>
              </span>
              <Button type="submit" variant="primary" size="md">
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Payment, QR, Proof & Policy */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            {/* Payment Method Selector */}
            <PaymentSelector
              selectedMethod={paymentMethod}
              onChange={setPaymentMethod}
            />

            {/* QR Card / Reference Number */}
            <QRPaymentCard
              method={paymentMethod}
              referenceNumber={referenceNumber}
              onReferenceChange={setReferenceNumber}
              totalAmount={totalPhp}
            />

            {/* Receipt Upload Dropzone if GCash / Maya */}
            {paymentMethod !== 'cod' && (
              <ReceiptUploadDropzone
                receiptUrl={receiptUrl}
                onReceiptChange={setReceiptUrl}
              />
            )}

            {/* Mandatory 1-of-1 Vintage Policy Disclaimer */}
            <PolicyDisclaimer
              accepted={policyAccepted}
              onToggle={setPolicyAccepted}
            />

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3 font-mono">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black px-3 py-2 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Address</span>
              </button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!policyAccepted || isSubmitting}
                className="shadow-sm font-bold"
              >
                {isSubmitting ? 'Securing Your Mine...' : `Complete Purchase (${formatPhp(totalPhp)})`}
              </Button>
            </div>
          </form>
        )}

      </div>
    </Modal>
  );
};
