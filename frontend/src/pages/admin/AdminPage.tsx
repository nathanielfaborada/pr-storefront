import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Item, OrderPayload } from '../../types/index.ts';
import { productService } from '../../services/productService.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { WaybillCard } from '../../components/order/WaybillCard.tsx';
import { AdminSidebar } from '../../components/layout/AdminSidebar.tsx';
import { AdminHeader } from '../../components/admin/AdminHeader.tsx';
import { AdminStatCards } from '../../components/admin/AdminStatCards.tsx';
import { AdminInventorySection } from '../../components/admin/AdminInventorySection.tsx';
import { AdminOrdersSection } from '../../components/admin/AdminOrdersSection.tsx';
import { AdminDispatchSection } from '../../components/admin/AdminDispatchSection.tsx';
import { AdminHoldsSection } from '../../components/admin/AdminHoldsSection.tsx';
import { AdminReceiptModal } from '../../components/admin/AdminReceiptModal.tsx';
import { AdminProfileModal } from '../../components/admin/AdminProfileModal.tsx';

export const AdminPage: React.FC = () => {
  const location = useLocation();

  const [products, setProducts] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<'racks' | 'payments' | 'dispatch' | 'holds'>('racks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Modal inspection states
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderPayload | null>(null);
  const [selectedWaybillOrder, setSelectedWaybillOrder] = useState<OrderPayload | null>(null);

  // 1. Sync Active Tab from URL Route Path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('order')) {
      setActiveTab('payments');
    } else if (path.includes('dispatch') || path.includes('waybill')) {
      setActiveTab('dispatch');
    } else if (path.includes('hold')) {
      setActiveTab('holds');
    } else {
      setActiveTab('racks');
    }
  }, [location.pathname]);

  // 2. Simulated Real-World Orders for P&R Thrift Store
  const [orders, setOrders] = useState<OrderPayload[]>([
    {
      orderId: 'PR-202608-8841',
      waybillNumber: 'WB-JNT-49201948-MNL',
      items: [
        {
          id: 'PR-BOXY-001',
          title: 'Heavyweight 260 GSM Drop-Shoulder Boxy Tee - Faded Charcoal',
          brand: 'P&R Archival Studio',
          category: 'boxy-tees',
          pricePhp: 2450,
          originalEstimatedPricePhp: 4200,
          tagSize: 'XL',
          recommendedFit: 'Drop Shoulder Boxy Large',
          silhouette: 'Drop-Shoulder Boxy',
          measurements: {
            pitToPitInches: 25.5,
            lengthInches: 26.0,
            shoulderDropInches: 22.0,
            sleeveInches: 9.0,
            bottomHemInches: 25.0,
          },
          condition: {
            grade: 'Pristine Sample (10/10)',
            ratingValue: 9.8,
            defectsSummary: '260 GSM combed cotton. Custom enzyme wash.',
            isSanitized: true,
          },
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
          isSoldOut: true,
          isReserved: false,
          dropNumber: 'DROP-08',
          isOneOfOne: true,
          tags: ['260 GSM', 'Boxy Fit'],
          description: 'Drop shoulder boxy drape.',
        },
      ],
      shippingAddress: {
        fullName: 'Nathaniel Faborada',
        phoneNumber: '0917-884-9124',
        region: 'Metro Manila',
        city: 'Quezon City',
        barangay: 'Brgy. Sacred Heart',
        streetAddress: 'Unit 402, Scout Chuatoco St.',
        landmarkNotes: 'Near 7-Eleven Gate 2',
      },
      paymentDetails: {
        method: 'gcash',
        referenceNumber: '100982348123',
        receiptImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e55722c6?auto=format&fit=crop&w=600&q=80',
        paidAmountPhp: 2549,
        submittedAt: '2026-08-31T04:15:00Z',
      },
      subtotalPhp: 2450,
      shippingFeePhp: 99,
      discountPhp: 0,
      totalAmountPhp: 2549,
      vintagePolicyAccepted: true,
      createdAt: '2026-08-31T04:15:00Z',
      fulfillmentStatus: 'payment_verified',
      trackingPipeline: [
        { stepNumber: 1, label: 'Payment Proof Submitted', status: 'completed', timestamp: '12:15 PM', description: 'GCash screenshot received and logged.' },
        { stepNumber: 2, label: 'Payment Verified by P&R Studio', status: 'completed', timestamp: '12:18 PM', description: 'Reference # verified with Pandi studio merchant.' },
        { stepNumber: 3, label: 'Sanitized, Tagged & Packed in Pouch', status: 'current', description: 'Eco-steamed and sealed in courier pouch.' },
        { stepNumber: 4, label: 'Handed Over to J&T Express Rider', status: 'upcoming', description: 'Scheduled for afternoon rider collection.' },
        { stepNumber: 5, label: 'Delivered to Customer', status: 'upcoming', description: 'Delivered to door with signature.' },
      ],
    },
    {
      orderId: 'PR-202608-8842',
      waybillNumber: 'WB-JNT-77218392-BUL',
      items: [
        {
          id: 'PR-HOOD-002',
          title: 'Heavy French Terry Cropped Boxy Hoodie 450 GSM - Washed Onyx',
          brand: 'P&R Archival Studio',
          category: 'cropped-hoodies',
          pricePhp: 3850,
          tagSize: 'L',
          recommendedFit: 'Ultra-Cropped Boxy Large',
          silhouette: 'Ultra-Cropped Boxy',
          measurements: { pitToPitInches: 26.5, lengthInches: 24.5, shoulderDropInches: 23.5, sleeveInches: 24.5, bottomHemInches: 22.0 },
          condition: { grade: 'Curated Archival (9.5/10)', ratingValue: 9.6, defectsSummary: '450 GSM loopback terry.', isSanitized: true },
          images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
          isSoldOut: true,
          isReserved: false,
          dropNumber: 'DROP-08',
          isOneOfOne: true,
          tags: ['450 GSM', 'Cropped'],
          description: 'Heavy French Terry hoodie.',
        },
      ],
      shippingAddress: {
        fullName: 'Maria Santos',
        phoneNumber: '0918-924-8192',
        region: 'Luzon',
        city: 'Pandi',
        barangay: 'Cacarong Matanda',
        streetAddress: 'Block 4, Lot 12, Villa St.',
      },
      paymentDetails: {
        method: 'gcash',
        referenceNumber: '100847291038',
        receiptImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e55722c6?auto=format&fit=crop&w=600&q=80',
        paidAmountPhp: 4010,
        submittedAt: '2026-08-31T04:25:00Z',
      },
      subtotalPhp: 3850,
      shippingFeePhp: 160,
      discountPhp: 0,
      totalAmountPhp: 4010,
      vintagePolicyAccepted: true,
      createdAt: '2026-08-31T04:25:00Z',
      fulfillmentStatus: 'payment_verified',
      trackingPipeline: [
        { stepNumber: 1, label: 'Payment Proof Submitted', status: 'completed', timestamp: '12:25 PM', description: 'GCash screenshot received.' },
        { stepNumber: 2, label: 'Payment Verified by P&R Studio', status: 'completed', timestamp: '12:28 PM', description: 'Reference # verified.' },
        { stepNumber: 3, label: 'Sanitized, Tagged & Packed in Pouch', status: 'current', description: 'Prepared for Bulacan dispatch.' },
        { stepNumber: 4, label: 'Handed Over to J&T Express Rider', status: 'upcoming', description: 'Courier transit to delivery address.' },
        { stepNumber: 5, label: 'Delivered to Customer', status: 'upcoming', description: 'Completed delivery.' },
      ],
    },
  ]);

  // Load live products
  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  // Delete Piece
  const handleDeletePiece = (id: string) => {
    if (confirm('Permanently remove this piece from Drop 08 racks?')) {
      productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Release 15-min hold lock
  const handleReleaseHoldLock = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isReserved: false } : p))
    );
  };

  // Approve Payment
  const handleApprovePayment = (orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.orderId === orderId
          ? {
              ...o,
              fulfillmentStatus: 'payment_verified',
              trackingPipeline: o.trackingPipeline.map(s =>
                s.stepNumber <= 2 ? { ...s, status: 'completed' as const } : s
              ),
            }
          : o
      )
    );
    setSelectedReceiptOrder(null);
  };

  // Flag Joy Miner Cancel Action
  const handleCancelJoyMinerOrder = (orderId: string) => {
    if (confirm('Flag this order and release all held items back to the digital racks?')) {
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      setSelectedReceiptOrder(null);
    }
  };

  const activeHolds = products.filter(p => p.isReserved && !p.isSoldOut);
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmountPhp, 0);

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'racks':
        return { title: 'Products & Inventory', subtitle: `Managing ${products.length} Drop Pieces` };
      case 'payments':
        return { title: 'Orders & Payments', subtitle: `${orders.length} Verified Customer Orders` };
      case 'dispatch':
        return { title: 'Shipping & Waybills', subtitle: 'J&T Express Logistics & Dispatch' };
      case 'holds':
        return { title: 'Active Holds Radar', subtitle: `${activeHolds.length} 15-Minute Cart Locks` };
      default:
        return { title: 'Products & Inventory', subtitle: 'Drop Management' };
    }
  };

  const currentSection = getSectionTitle();

  return (
    <div className="min-h-screen bg-zinc-100/60 font-mono text-zinc-950">
      
      {/* 1. Dedicated Admin Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        racksCount={products.length}
        ordersCount={orders.length}
        holdsCount={activeHolds.length}
      />

      {/* 2. Main Studio Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <div className="max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-6 space-y-2 sm:space-y-5 animate-in fade-in duration-200">
          
          {/* Top Header Component */}
          <AdminHeader
            title={currentSection.title}
            subtitle={currentSection.subtitle}
            activeTab={activeTab}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />

          {/* Metric Stat Cards Component */}
          <AdminStatCards
            totalProductsCount={products.length}
            availableProductsCount={products.filter(p => !p.isSoldOut).length}
            activeHoldsCount={activeHolds.length}
            totalSalesPhp={totalSales}
            ordersCount={orders.length}
          />

          {/* TAB 1: Products & Inventory */}
          {activeTab === 'racks' && (
            <AdminInventorySection
              products={products}
              onDeletePiece={handleDeletePiece}
            />
          )}

          {/* TAB 2: Orders & Payments */}
          {activeTab === 'payments' && (
            <AdminOrdersSection
              orders={orders}
              onInspectReceipt={order => setSelectedReceiptOrder(order)}
            />
          )}

          {/* TAB 3: Shipping & Waybills */}
          {activeTab === 'dispatch' && (
            <AdminDispatchSection
              orders={orders}
              onPrintWaybill={order => setSelectedWaybillOrder(order)}
            />
          )}

          {/* TAB 4: Active Holds Radar */}
          {activeTab === 'holds' && (
            <AdminHoldsSection
              activeHolds={activeHolds}
              onReleaseLock={handleReleaseHoldLock}
            />
          )}

        </div>
      </div>

      {/* MODAL 1: GCash Proof Inspection */}
      <AdminReceiptModal
        order={selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
        onApprovePayment={handleApprovePayment}
        onCancelJoyMiner={handleCancelJoyMinerOrder}
      />

      {/* MODAL 2: Printable J&T Courier Waybill */}
      {selectedWaybillOrder && (
        <Modal
          isOpen={Boolean(selectedWaybillOrder)}
          onClose={() => setSelectedWaybillOrder(null)}
          maxWidth="2xl"
          title="Print Courier Waybill Manifest"
        >
          <div className="space-y-4">
            <WaybillCard order={selectedWaybillOrder} />
          </div>
        </Modal>
      )}

      {/* MODAL 3: Admin Profile & Studio Settings */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

    </div>
  );
};
