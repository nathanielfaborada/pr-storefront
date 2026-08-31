export type CategoryType = string;

export type SilhouetteDescriptor = 
  | 'Drop-Shoulder Boxy'
  | 'Ultra-Cropped Boxy'
  | 'Straight Wide-Leg'
  | 'Relaxed Techwear'
  | 'Oversized Balloon Fit';

export type ConditionScore = 
  | 'Pristine Sample (10/10)'
  | 'Curated Archival (9.5/10)'
  | 'Grade A Vault (9/10)'
  | 'Custom Distressed / Rework (8.5/10)';

export interface GarmentMeasurements {
  pitToPitInches: number;      // Boxy Chest Width across front in inches
  lengthInches: number;        // Top collar seam to bottom hem (Cropped / Total)
  shoulderDropInches?: number; // Drop shoulder seam width in inches
  sleeveInches?: number;       // Shoulder to cuff
  bottomHemInches?: number;    // Bottom opening width / leg opening
}

export interface ConditionReport {
  grade: ConditionScore;
  ratingValue: number;        // e.g. 9.4
  defectsSummary: string;     // e.g. "Custom sun-faded charcoal patina, pristine rib collar, zero structural flaws."
  isSanitized: boolean;       // true (steam sanitized)
  fabricGsm?: number;         // e.g. 260
  originCountry?: string;     // e.g. "Made in Japan"
}

export interface Item {
  id: string;                 // e.g. "PR-BOXY-TEE-001"
  title: string;              // e.g. "Heavyweight 260GSM Drop-Shoulder Boxy Tee"
  brand: string;              // e.g. "P&R Archival Studio"
  category: CategoryType;
  pricePhp: number;           // e.g. 2450
  originalEstimatedPricePhp?: number; // e.g. 4800
  
  // Tailoring & Silhouette
  tagSize: string;            // e.g. "XL"
  recommendedFit: string;     // e.g. "Drop Shoulder Boxy Large"
  silhouette: SilhouetteDescriptor;
  measurements: GarmentMeasurements;
  
  // Condition & Authenticity
  condition: ConditionReport;
  
  // Media & Video/Fitpic Preview
  images: string[];           // High-res photo angles
  fitpicUrls?: string[];      // On-body model fitpics
  videoUrl?: string;          // 10s silent loop video preview
  
  // Inventory Status & Quantity
  stockQuantity?: number;     // e.g. 1 for 1-of-1, or 2, 3, 5+ for batch pieces
  sizeInventory?: Record<string, number>; // e.g. { S: 1, M: 2, L: 3, XL: 1 }
  hasCustomSizePricing?: boolean; // true if sizes have different prices
  sizePricing?: Record<string, number>;   // e.g. { S: 250, M: 250, L: 280, XL: 300 }
  minPricePhp?: number;
  maxPricePhp?: number;
  isSoldOut: boolean;         // true when claimed/purchased
  isReserved: boolean;        // true when in active 15-min cart hold
  reservedUntil?: number;     // Timestamp in ms
  
  // Badges & Drop Meta
  dropNumber: string;         // e.g. "DROP-08"
  isOneOfOne: boolean;        // true when 1-of-1 curated
  tags: string[];             // e.g. ["260 GSM", "Boxy Fit", "Drop Shoulder", "Charcoal Wash"]
  description: string;
}

export interface CartItem {
  item: Item;
  quantity: number;
  selectedSize?: string;
  heldAt?: number;
  holdExpiresAt?: number;
}

export type MessageSender = 'shopper' | 'seller' | 'system';

export interface AttachedProductSummary {
  id: string;
  title: string;
  pricePhp: number;
  tagSize: string;
  thumbnailUrl: string;
  recommendedFit: string;
  silhouette?: SilhouetteDescriptor;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;          // Formatted time (e.g. "11:42 PM")
  attachedProduct?: AttachedProductSummary;
  imageAttachmentUrl?: string;
  isRead?: boolean;
}

export interface QuickChip {
  id: string;
  label: string;
  promptText: string;
}

export type PaymentMethod = 'gcash' | 'maya' | 'cod';

export type OrderFulfillmentStatus = 
  | 'payment_verification'
  | 'payment_verified'
  | 'packed_and_tagged'
  | 'in_transit'
  | 'delivered';

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;        // e.g. "09178849124"
  region: 'Metro Manila' | 'Luzon' | 'Visayas' | 'Mindanao';
  city: string;
  barangay: string;
  streetAddress: string;
  landmarkNotes?: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  referenceNumber?: string;
  receiptImageUrl?: string;
  paidAmountPhp: number;
  submittedAt: string;
}

export interface TrackingStep {
  stepNumber: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  description?: string;
}

export interface OrderPayload {
  orderId: string;
  waybillNumber: string;
  items: Item[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  subtotalPhp: number;
  shippingFeePhp: number;
  discountPhp: number;
  totalAmountPhp: number;
  vintagePolicyAccepted: boolean;
  createdAt: string;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingPipeline: TrackingStep[];
}
