import { Request, Response } from 'express';
import { db } from '../store/index.js';
import { OrderPayload, TrackingStep } from '../types/index.js';

export const createOrder = (req: Request, res: Response) => {
  const { items, shippingAddress, paymentDetails, subtotalPhp, shippingFeePhp, discountPhp, totalAmountPhp, vintagePolicyAccepted } = req.body;

  if (!items || !items.length || !shippingAddress || !paymentDetails || !vintagePolicyAccepted) {
    return res.status(400).json({
      success: false,
      message: 'Incomplete order payload. All fields and vintage policy agreement are required.',
    });
  }

  // Mark all purchased 1-of-1 items as SOLD OUT and release holds
  for (const cartItem of items) {
    const item = db.products.find(p => p.id === cartItem.id || p.id === cartItem.item?.id);
    if (item) {
      item.isSoldOut = true;
      item.isReserved = false;
      item.reservedUntil = undefined;
      db.holds.delete(item.id);
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `PR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;
  const waybillNumber = `WB-JNT-${Math.floor(10000000 + Math.random() * 90000000)}-MNL`;

  const now = new Date();
  const timeString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                     now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const trackingPipeline: TrackingStep[] = [
    {
      stepNumber: 1,
      label: paymentDetails.method === 'cod' ? 'Order Placed (COD Requested)' : 'Payment Proof Submitted',
      status: 'completed',
      timestamp: timeString,
      description: paymentDetails.method === 'cod' 
        ? 'Cash on Delivery selected. Buyer details verified.' 
        : `GCash/Maya ref #${paymentDetails.referenceNumber || 'N/A'} uploaded for audit.`,
    },
    {
      stepNumber: 2,
      label: 'Payment Verified by P&R Vault',
      status: paymentDetails.method === 'cod' ? 'completed' : 'current',
      timestamp: paymentDetails.method === 'cod' ? timeString : 'Verifying (1-2 mins)',
      description: 'Audit clearance confirmed for 1-of-1 garment release.',
    },
    {
      stepNumber: 3,
      label: 'Sanitized, Tagged & Packed',
      status: 'upcoming',
      description: 'Garment steamed, tagged with archival seal, and packed in dustbag.',
    },
    {
      stepNumber: 4,
      label: 'Handed Over to Courier',
      status: 'upcoming',
      description: 'Express pickup by J&T Express / Lalamove Hub.',
    },
    {
      stepNumber: 5,
      label: 'Out for Delivery / Mine Delivered',
      status: 'upcoming',
      description: 'Estimated delivery: 1-2 days (Metro Manila) / 3-4 days (Provincial).',
    }
  ];

  const newOrder: OrderPayload = {
    orderId,
    waybillNumber,
    items: items.map((i: any) => i.item || i),
    shippingAddress,
    paymentDetails: {
      ...paymentDetails,
      submittedAt: new Date().toISOString(),
    },
    subtotalPhp,
    shippingFeePhp,
    discountPhp: discountPhp || 0,
    totalAmountPhp,
    vintagePolicyAccepted,
    createdAt: new Date().toISOString(),
    fulfillmentStatus: 'payment_verified',
    trackingPipeline,
  };

  db.orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: 'Mine Secured! Order placed successfully.',
    data: newOrder,
  });
};

export const getOrderById = (req: Request, res: Response) => {
  const { id } = req.params;
  const order = db.orders.find(o => o.orderId === id || o.waybillNumber === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order / Waybill not found.' });
  }

  res.json({ success: true, data: order });
};
