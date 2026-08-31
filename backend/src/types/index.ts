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
  pitToPitInches: number;
  lengthInches: number;
  shoulderDropInches?: number;
  sleeveInches?: number;
  bottomHemInches?: number;
}

export interface ConditionReport {
  grade: ConditionScore;
  ratingValue: number;
  defectsSummary: string;
  isSanitized: boolean;
  fabricGsm?: number;
  originCountry?: string;
}

export interface Item {
  id: string;
  title: string;
  brand: string;
  category: CategoryType;
  pricePhp: number;
  originalEstimatedPricePhp?: number;
  tagSize: string;
  recommendedFit: string;
  silhouette: SilhouetteDescriptor;
  measurements: GarmentMeasurements;
  condition: ConditionReport;
  images: string[];
  fitpicUrls?: string[];
  videoUrl?: string;
  stockQuantity?: number;
  sizeInventory?: Record<string, number>;
  isSoldOut: boolean;
  isReserved: boolean;
  reservedUntil?: number;
  dropNumber: string;
  isOneOfOne: boolean;
  tags: string[];
  description: string;
}

export interface CartItem {
  item: Item;
  heldAt: number;
  holdExpiresAt: number;
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
  timestamp: string;
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
  phoneNumber: string;
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
