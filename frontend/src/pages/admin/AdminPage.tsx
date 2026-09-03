import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.tsx';
import { Item, OrderPayload, SupplyItem, StudioRack } from '../../types/index.ts';
import { productService } from '../../services/productService.ts';
import { orderService } from '../../services/orderService.ts';
import { supplyService } from '../../services/supplyService.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { WaybillCard } from '../../components/order/WaybillCard.tsx';
import { AdminSidebar } from '../../components/layout/AdminSidebar.tsx';
import { AdminHeader } from '../../components/admin/AdminHeader.tsx';
import { AdminStatCards } from '../../components/admin/AdminStatCards.tsx';
import { AdminInventorySection } from '../../components/admin/AdminInventorySection.tsx';
import { AdminOrdersSection } from '../../components/admin/AdminOrdersSection.tsx';
import { AdminDispatchSection } from '../../components/admin/AdminDispatchSection.tsx';
import { AdminSuppliesSection } from '../../components/admin/AdminSuppliesSection.tsx';
import { AdminChatSection } from '../../components/admin/AdminChatSection.tsx';
import { AdminReceiptModal } from '../../components/admin/AdminReceiptModal.tsx';
import { AdminProfileModal } from '../../components/admin/AdminProfileModal.tsx';

export const AdminPage: React.FC = () => {
  const location = useLocation();
  const toast = useToast();

  const [products, setProducts] = useState<Item[]>([]);
  const [orders, setOrders] = useState<OrderPayload[]>([]);
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [racks, setRacks] = useState<StudioRack[]>([]);

  const [activeTab, setActiveTab] = useState<'racks' | 'payments' | 'dispatch' | 'supplies' | 'chats'>('racks');
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
    } else if (path.includes('suppl') || path.includes('asset')) {
      setActiveTab('supplies');
    } else if (path.includes('chat') || path.includes('message')) {
      setActiveTab('chats');
    } else {
      setActiveTab('racks');
    }
  }, [location.pathname]);

  // 2. Load live data from services
  const refreshData = () => {
    productService.getAll().then(setProducts);
    
    // Load stored orders (with fallback seed data if completely empty)
    const storedOrders = orderService.getAll();
    if (storedOrders.length > 0) {
      setOrders(storedOrders);
    } else {
      // Seed default orders
      const seedOrders: OrderPayload[] = [
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
      ];
      setOrders(seedOrders);
    }

    setSupplies(supplyService.getAllSupplies());
    setRacks(supplyService.getAllRacks());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Delete Piece from Racks
  const handleDeletePiece = (id: string) => {
    productService.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.warning('Piece permanently removed from Drop 08 inventory.', 'Piece Deleted');
  };

  // Approve Payment
  const handleApprovePayment = (orderId: string) => {
    const updated = orders.map(o =>
      o.orderId === orderId
        ? {
            ...o,
            fulfillmentStatus: 'payment_verified' as const,
            trackingPipeline: o.trackingPipeline.map(s =>
              s.stepNumber <= 2 ? { ...s, status: 'completed' as const } : s
            ),
          }
        : o
    );
    setOrders(updated);
    localStorage.setItem('pr_custom_orders', JSON.stringify(updated));
    setSelectedReceiptOrder(null);
    toast.success(`50% deposit verified for ${orderId}. Waybill released to J&T Dispatch!`, 'Payment Approved');
  };

  // Cancel Order
  const handleCancelJoyMinerOrder = (orderId: string) => {
    const updated = orders.filter(o => o.orderId !== orderId);
    setOrders(updated);
    localStorage.setItem('pr_custom_orders', JSON.stringify(updated));
    setSelectedReceiptOrder(null);
    toast.info(`Order ${orderId} has been declined and removed from queue.`, 'Order Declined');
  };

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'racks':
        return { title: 'Products & Inventory', subtitle: `Managing ${products.length} Curated Streetwear Pieces` };
      case 'payments':
        return { title: 'Orders & Payments', subtitle: `${orders.length} Customer Orders in Studio Queue` };
      case 'dispatch':
        return { title: 'Shipping & Waybills', subtitle: 'J&T Express Courier Logistics & Waybills' };
      case 'supplies':
        return { title: 'Studio Supplies & Assets', subtitle: `${supplies.length} Supplies & ${racks.length} Physical Clothes Racks` };
      case 'chats':
        return { title: 'Customer Chats & Inquiries', subtitle: 'Live Buyer Inquiries & Archival Sizing Questions' };
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
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        racksCount={products.length}
        ordersCount={orders.length}
        suppliesCount={supplies.length}
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
          />

          {/* Metric Stat Cards Component (Context-Aware for Active Tab) */}
          <AdminStatCards
            activeTab={activeTab}
            products={products}
            orders={orders}
            supplies={supplies}
            racks={racks}
            packagingCostPerOrder={supplyService.getAveragePackagingCostPerOrder()}
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

          {/* TAB 4: Studio Supplies & Physical Racks */}
          {activeTab === 'supplies' && (
            <AdminSuppliesSection
              supplies={supplies}
              racks={racks}
              onRefresh={refreshData}
            />
          )}

          {/* TAB 5: Customer Chats & Inquiries */}
          {activeTab === 'chats' && (
            <AdminChatSection />
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

export default AdminPage;
