import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { ShippingAddress, PaymentMethod } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Button } from '../../components/common/Button.tsx';
import { ShippingForm } from '../../components/checkout/ShippingForm.tsx';
import { PaymentSelector } from '../../components/checkout/PaymentSelector.tsx';
import { QRPaymentCard } from '../../components/checkout/QRPaymentCard.tsx';
import { ReceiptUploadDropzone } from '../../components/checkout/ReceiptUploadDropzone.tsx';
import { PolicyDisclaimer } from '../../components/checkout/PolicyDisclaimer.tsx';
import { orderService } from '../../services/orderService.ts';
import { productService } from '../../services/productService.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cart, subtotalPhp, shippingFeePhp, totalPhp, clearCart } = useCart();

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('partial_cod');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-mono">
        <div className="w-16 h-16 rounded-3xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400 mb-4 shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-zinc-950 mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-zinc-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any pieces to your bag yet. Browse our curated streetwear drop to get started.
        </p>
        <Link to="/">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Explore Drop Archive
          </Button>
        </Link>
      </div>
    );
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phoneNumber || !shippingAddress.city || !shippingAddress.streetAddress) {
      toast.warning('Please fill in all required shipping address fields.', 'Missing Address');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!policyAccepted) {
      toast.warning('Please accept the 1-of-1 streetwear authenticity and sales agreement.', 'Policy Agreement');
      return;
    }

    if (paymentMethod !== 'cod' && !referenceNumber) {
      if (paymentMethod === 'paymongo') {
        toast.warning('Please click the PayMongo payment button to authorize payment.', 'PayMongo Authorization');
      } else {
        toast.warning('Please enter your 13-digit GCash / Maya payment reference number.', 'Payment Proof Required');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order in phone/local storage
      const order = await orderService.createOrder({
        items: cart.map(ci => ci.item),
        shippingAddress,
        paymentDetails: {
          method: paymentMethod,
          referenceNumber: referenceNumber || undefined,
          receiptImageUrl: receiptUrl || undefined,
          paidAmountPhp: totalPhp,
        },
        subtotalPhp,
        shippingFeePhp,
        discountPhp: 0,
        totalAmountPhp: totalPhp,
        vintagePolicyAccepted: true,
      });

      // 2. Mark purchased 1-of-1 items as sold in product storage
      for (const cartItem of cart) {
        if (cartItem.item.isOneOfOne) {
          await productService.update(cartItem.item.id, { isSoldOut: true });
        }
      }

      // 3. Clear shopping bag & navigate to Waybill tracking page
      clearCart();
      toast.success(`Order ${order.orderId} created successfully!`, 'Order Confirmed');
      navigate(`/orders/${order.orderId}`, { state: { order } });
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order.', 'Order Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 font-mono text-zinc-950">
      
      {/* Checkout Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-0.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Fast Checkout</span>
          </div>
          <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-zinc-950 tracking-tight">
            Complete Your Streetwear Order
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
            step === 1 ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-2xs' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Delivery Info</span>
          </div>
          <span className="text-zinc-300">→</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
            step === 2 ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-2xs' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Payment Proof</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 mt-4 sm:mt-8 items-start">
        
        {/* Left Form Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 space-y-4 sm:space-y-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="font-heading font-bold text-base sm:text-lg text-zinc-950">
                  1. Shipping &amp; Recipient Details
                </h2>
                <span className="text-[10px] sm:text-[11px] text-zinc-400">All fields required</span>
              </div>

              <ShippingForm
                address={shippingAddress}
                onChange={(updated) => setShippingAddress(prev => ({ ...prev, ...updated }))}
              />

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <Link to="/" className="text-xs text-zinc-500 hover:text-black flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Shop</span>
                </Link>

                <Button type="submit" variant="primary" size="md">
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 space-y-4 sm:space-y-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 sm:pb-4">
                <h2 className="font-heading font-bold text-base sm:text-lg text-zinc-950">
                  2. Payment Gateway
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              </div>

              {/* Payment Selector with Option 1 and Option 2 */}
              <PaymentSelector
                selectedMethod={paymentMethod}
                onChange={setPaymentMethod}
                totalAmount={totalPhp}
              />

              {/* QR Code & Payment Instructions */}
              <div className="space-y-4 pt-1">
                <QRPaymentCard
                  method={paymentMethod}
                  referenceNumber={referenceNumber}
                  onReferenceChange={setReferenceNumber}
                  totalAmount={totalPhp}
                />

                {/* Screenshot Receipt Upload for Manual QR Options */}
                {(paymentMethod === 'partial_cod' || paymentMethod === 'gcash' || paymentMethod === 'maya') && (
                  <ReceiptUploadDropzone
                    receiptUrl={receiptUrl}
                    onReceiptChange={setReceiptUrl}
                  />
                )}
              </div>

              {/* Policy Disclaimer Agreement */}
              <PolicyDisclaimer
                accepted={policyAccepted}
                onToggle={setPolicyAccepted}
              />

              {/* Final Place Order Action */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-500 hover:text-black flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || !policyAccepted}
                  className="shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                </Button>
              </div>
            </form>
          )}

        </div>

        {/* Right Order Summary Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-heading font-bold text-base text-zinc-950">
                Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-md">
                Drop 08
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map(ci => (
                <div key={ci.item.id} className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-zinc-200">
                  <img
                    src={ci.item.images[0]}
                    alt={ci.item.title}
                    className="w-14 h-14 object-cover rounded-xl shrink-0 bg-zinc-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-bold text-xs text-zinc-900 truncate">
                      {ci.item.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Tag: <strong className="text-zinc-700">{ci.item.tagSize}</strong> · Qty: {ci.quantity || 1}
                    </p>
                    <span className="font-bold text-xs text-zinc-950">
                      {formatPhp(ci.item.pricePhp * (ci.quantity || 1))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-zinc-200 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatPhp(subtotalPhp)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Courier Express Shipping</span>
                <span className="font-bold text-zinc-900">
                  {shippingFeePhp === 0 ? (
                    <strong className="text-emerald-700 uppercase">FREE (Over ₱2,500)</strong>
                  ) : (
                    formatPhp(shippingFeePhp)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Amount</span>
                <span className="text-base text-orange-600 font-bold">{formatPhp(totalPhp)}</span>
              </div>
            </div>

            {/* Assurance Box */}
            <div className="pt-2">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Curated Authenticity &amp; Live Waybill Tracking Included</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
