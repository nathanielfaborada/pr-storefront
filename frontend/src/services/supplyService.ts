import { SupplyItem, StudioRack } from '../types/index.ts';

const SUPPLIES_STORAGE_KEY = 'pr_studio_supplies_common_v3';
const RACKS_STORAGE_KEY = 'pr_studio_racks_common_v3';

// 5 Essential Common Studio Supplies
const INITIAL_SUPPLIES: SupplyItem[] = [
  {
    id: 'sup-001',
    name: 'J&T Courier Pouches (Large 40x55cm with Pockets)',
    category: 'packaging',
    quantity: 120,
    unit: 'pcs',
    unitCostPhp: 2.50,
    lowStockThreshold: 25,
    supplierOrLocation: 'J&T Pandi Hub Desk',
    lastRestockedAt: '2026-08-28',
    notes: 'Waterproof courier shipment bags with clear waybill pocket.',
  },
  {
    id: 'sup-002',
    name: 'Frosted Matte Zipper Dustbags / Polybags',
    category: 'packaging',
    quantity: 85,
    unit: 'pcs',
    unitCostPhp: 6.00,
    lowStockThreshold: 15,
    supplierOrLocation: 'Packing Table Shelf A',
    lastRestockedAt: '2026-08-25',
    notes: 'Premium inner garment packaging for boxy tees & hoodies.',
  },
  {
    id: 'sup-003',
    name: 'Packaging & Fragile Sealing Tape (2-inch roll)',
    category: 'packaging',
    quantity: 8,
    unit: 'rolls',
    unitCostPhp: 45.00,
    lowStockThreshold: 3,
    supplierOrLocation: 'Packing Desk Drawer',
    lastRestockedAt: '2026-08-20',
    notes: 'Heavy-duty adhesive tape for sealing parcel pouches & boxes.',
  },
  {
    id: 'sup-004',
    name: 'P&R Archival Studio Hangtags & Tag Barbs',
    category: 'packaging',
    quantity: 160,
    unit: 'pcs',
    unitCostPhp: 1.50,
    lowStockThreshold: 30,
    supplierOrLocation: 'Tagging Station',
    lastRestockedAt: '2026-08-15',
    notes: 'Curated authenticity hangtags attached to collar tags.',
  },
  {
    id: 'sup-005',
    name: '4x6 Direct Thermal Waybill Sticker Paper',
    category: 'packaging',
    quantity: 380,
    unit: 'sheets',
    unitCostPhp: 0.35,
    lowStockThreshold: 50,
    supplierOrLocation: 'Thermal Printer Stand',
    lastRestockedAt: '2026-08-22',
    notes: 'Waterproof and smudge-proof thermal labels for J&T courier barcodes.',
  },
];

// Physical Clothing Racks
const INITIAL_RACKS: StudioRack[] = [
  {
    id: 'rack-01',
    rackCode: 'RACK-A',
    rackName: 'Main Heavyweight Boxy Tees Rack',
    categoryTag: 'boxy-tees',
    capacity: 30,
    currentPiecesCount: 18,
    locationNotes: 'Studio Left Wall',
  },
  {
    id: 'rack-02',
    rackCode: 'RACK-B',
    rackName: 'Cropped Hoodies & Outerwear Rack',
    categoryTag: 'cropped-hoodies',
    capacity: 20,
    currentPiecesCount: 12,
    locationNotes: 'Studio Center Wall',
  },
  {
    id: 'rack-03',
    rackCode: 'RACK-C',
    rackName: 'Parachute Pants & Cargos Rack',
    categoryTag: 'parachute-cargos',
    capacity: 25,
    currentPiecesCount: 14,
    locationNotes: 'Studio Right Bay',
  },
];

export const supplyService = {
  // Supplies
  getAllSupplies(): SupplyItem[] {
    const saved = localStorage.getItem(SUPPLIES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback to initial
      }
    }
    localStorage.setItem(SUPPLIES_STORAGE_KEY, JSON.stringify(INITIAL_SUPPLIES));
    return INITIAL_SUPPLIES;
  },

  saveSupplies(items: SupplyItem[]): void {
    localStorage.setItem(SUPPLIES_STORAGE_KEY, JSON.stringify(items));
  },

  addSupply(item: Omit<SupplyItem, 'id'>): SupplyItem {
    const items = this.getAllSupplies();
    const newItem: SupplyItem = {
      ...item,
      id: `sup-${Date.now()}`,
      lastRestockedAt: item.lastRestockedAt || new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...items];
    this.saveSupplies(updated);
    return newItem;
  },

  updateSupply(id: string, updates: Partial<SupplyItem>): SupplyItem | null {
    const items = this.getAllSupplies();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;

    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    this.saveSupplies(items);
    return updatedItem;
  },

  adjustStock(id: string, delta: number): SupplyItem | null {
    const items = this.getAllSupplies();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;

    const newQty = Math.max(0, items[index].quantity + delta);
    items[index] = { ...items[index], quantity: newQty };
    this.saveSupplies(items);
    return items[index];
  },

  deleteSupply(id: string): boolean {
    const items = this.getAllSupplies();
    const filtered = items.filter(i => i.id !== id);
    this.saveSupplies(filtered);
    return filtered.length !== items.length;
  },

  // Racks
  getAllRacks(): StudioRack[] {
    const saved = localStorage.getItem(RACKS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback to initial
      }
    }
    localStorage.setItem(RACKS_STORAGE_KEY, JSON.stringify(INITIAL_RACKS));
    return INITIAL_RACKS;
  },

  saveRacks(racks: StudioRack[]): void {
    localStorage.setItem(RACKS_STORAGE_KEY, JSON.stringify(racks));
  },

  addRack(rack: Omit<StudioRack, 'id'>): StudioRack {
    const racks = this.getAllRacks();
    const newRack: StudioRack = {
      ...rack,
      id: `rack-${Date.now()}`,
    };
    const updated = [...racks, newRack];
    this.saveRacks(updated);
    return newRack;
  },

  updateRack(id: string, updates: Partial<StudioRack>): StudioRack | null {
    const racks = this.getAllRacks();
    const index = racks.findIndex(r => r.id === id);
    if (index === -1) return null;

    const updatedRack = { ...racks[index], ...updates };
    racks[index] = updatedRack;
    this.saveRacks(racks);
    return updatedRack;
  },

  deleteRack(id: string): boolean {
    const racks = this.getAllRacks();
    const filtered = racks.filter(r => r.id !== id);
    this.saveRacks(filtered);
    return filtered.length !== racks.length;
  },

  // Financial Analytics
  getTotalAssetValue(): number {
    const supplies = this.getAllSupplies();
    return supplies.reduce((acc, s) => acc + (s.quantity * s.unitCostPhp), 0);
  },

  getAveragePackagingCostPerOrder(): number {
    // Standard packaging per shipment: 1 pouch (₱2.50) + 1 dustbag (₱6.00) + 1 sticker (₱0.35) + 1 hangtag (₱1.50) + tape (₱0.50) = ~₱10.85
    return 10.85;
  },
};
