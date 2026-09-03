import { OrderPayload, TrackingStep } from '../types/index.ts';

const LOCAL_STORAGE_ORDERS_KEY = 'pr_custom_orders';

const getStoredOrders = (): OrderPayload[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

const saveStoredOrders = (orders: OrderPayload[]) => {
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
};

export const orderService = {
  getAll(): OrderPayload[] {
    return getStoredOrders();
  },

  async getOrderById(orderId: string): Promise<OrderPayload | null> {
    const orders = getStoredOrders();
    const found = orders.find(
      o => o.orderId.toLowerCase() === orderId.toLowerCase() ||
           o.waybillNumber.toLowerCase() === orderId.toLowerCase()
    );
    return found || null;
  },

  async createOrder(payload: {
    items: any[];
    shippingAddress: any;
    paymentDetails: any;
    subtotalPhp: number;
    shippingFeePhp: number;
    discountPhp?: number;
    totalAmountPhp: number;
    vintagePolicyAccepted: boolean;
  }): Promise<OrderPayload> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const orderId = `PR-${yearMonth}-${randomSuffix}`;
    const waybillNumber = `WB-JNT-${Math.floor(10000000 + Math.random() * 90000000)}-MNL`;

    const isCod = payload.paymentDetails.method === 'cod';
    const nowTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const trackingPipeline: TrackingStep[] = [
      {
        stepNumber: 1,
        label: isCod ? 'Order Placed (COD Requested)' : 'Payment Proof Submitted',
        status: 'completed',
        timestamp: nowTime,
        description: isCod
          ? 'Cash on Delivery selected. Buyer details recorded.'
          : `GCash/Maya ref #${payload.paymentDetails.referenceNumber || 'N/A'} uploaded.`,
      },
      {
        stepNumber: 2,
        label: 'Payment Verified by P&R Vault',
        status: 'completed',
        timestamp: 'Just now',
        description: 'Audit clearance confirmed for garment release.',
      },
      {
        stepNumber: 3,
        label: 'Sanitized, Tagged & Packed',
        status: 'current',
        description: 'Garment steamed, tagged with archival seal, and packed in dustbag.',
      },
      {
        stepNumber: 4,
        label: 'Handed Over to Courier',
        status: 'upcoming',
        description: 'Express pickup scheduled via J&T Express / Lalamove Hub.',
      },
      {
        stepNumber: 5,
        label: 'Out for Delivery',
        status: 'upcoming',
        description: 'Estimated delivery: 1-2 business days.',
      },
    ];

    const newOrder: OrderPayload = {
      orderId,
      waybillNumber,
      items: payload.items.map(i => i.item || i),
      shippingAddress: payload.shippingAddress,
      paymentDetails: {
        ...payload.paymentDetails,
        submittedAt: new Date().toISOString(),
      },
      subtotalPhp: payload.subtotalPhp,
      shippingFeePhp: payload.shippingFeePhp,
      discountPhp: payload.discountPhp || 0,
      totalAmountPhp: payload.totalAmountPhp,
      vintagePolicyAccepted: payload.vintagePolicyAccepted,
      createdAt: new Date().toISOString(),
      fulfillmentStatus: 'payment_verified',
      trackingPipeline,
    };

    const currentOrders = getStoredOrders();
    const updatedOrders = [newOrder, ...currentOrders.filter(o => o.orderId !== orderId)];
    saveStoredOrders(updatedOrders);

    return newOrder;
  },
};
