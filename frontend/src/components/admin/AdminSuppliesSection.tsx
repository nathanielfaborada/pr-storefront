import React, { useState } from 'react';
import { SupplyItem, StudioRack, SupplyCategory } from '../../types/index.ts';
import { supplyService } from '../../services/supplyService.ts';
import { formatPhp } from '../../utils/index.ts';
import {
  Boxes,
  Package,
  Plus,
  Minus,
  AlertTriangle,
  Coins,
  Layers,
  Trash2,
  Edit2,
  Search,
  MapPin
} from 'lucide-react';
import { Modal } from '../common/Modal.tsx';
import { ConfirmModal } from '../common/ConfirmModal.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface AdminSuppliesSectionProps {
  supplies: SupplyItem[];
  racks: StudioRack[];
  onRefresh: () => void;
}

export const AdminSuppliesSection: React.FC<AdminSuppliesSectionProps> = ({
  supplies,
  racks,
  onRefresh,
}) => {
  const toast = useToast();
  // Simple 3 tabs: 'all' | 'packaging' | 'racks'
  const [activeCategory, setActiveCategory] = useState<'all' | 'packaging' | 'racks'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isAddSupplyModalOpen, setIsAddSupplyModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<SupplyItem | null>(null);
  const [deletingSupply, setDeletingSupply] = useState<SupplyItem | null>(null);

  const [isAddRackModalOpen, setIsAddRackModalOpen] = useState(false);
  const [editingRack, setEditingRack] = useState<StudioRack | null>(null);
  const [deletingRack, setDeletingRack] = useState<StudioRack | null>(null);

  // Supply Form State
  const [supplyFormData, setSupplyFormData] = useState({
    name: '',
    category: 'packaging' as SupplyCategory,
    quantity: 50,
    unit: 'pcs' as 'pcs' | 'rolls' | 'packs' | 'bottles' | 'sheets' | 'units',
    unitCostPhp: 2.50,
    lowStockThreshold: 15,
    supplierOrLocation: '',
    notes: '',
  });

  // Rack Form State
  const [rackFormData, setRackFormData] = useState({
    rackCode: 'RACK-D',
    rackName: '',
    categoryTag: 'boxy-tees',
    capacity: 25,
    currentPiecesCount: 0,
    locationNotes: '',
  });

  const lowStockItems = supplies.filter(s => s.quantity <= s.lowStockThreshold);

  // Filtered Supplies
  const filteredSupplies = supplies.filter(s => {
    if (activeCategory === 'packaging' && s.category !== 'packaging') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.supplierOrLocation && s.supplierOrLocation.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Stock Counter Handlers
  const handleStockDelta = (id: string, delta: number) => {
    supplyService.adjustStock(id, delta);
    onRefresh();
  };

  const handleRackPieceDelta = (id: string, delta: number) => {
    const rack = racks.find(r => r.id === id);
    if (!rack) return;
    const newCount = Math.max(0, Math.min(rack.capacity, rack.currentPiecesCount + delta));
    supplyService.updateRack(id, { currentPiecesCount: newCount });
    onRefresh();
  };

  const handleDeleteSupply = (id: string, name: string) => {
    supplyService.deleteSupply(id);
    onRefresh();
    toast.warning(`"${name}" removed from inventory.`, 'Supply Deleted');
  };

  const handleDeleteRack = (id: string, name: string) => {
    supplyService.deleteRack(id);
    onRefresh();
    toast.warning(`Rack "${name}" removed from studio layout.`, 'Rack Deleted');
  };

  const handleOpenAddSupply = () => {
    setEditingSupply(null);
    setSupplyFormData({
      name: '',
      category: 'packaging',
      quantity: 50,
      unit: 'pcs',
      unitCostPhp: 2.50,
      lowStockThreshold: 15,
      supplierOrLocation: '',
      notes: '',
    });
    setIsAddSupplyModalOpen(true);
  };

  const handleOpenEditSupply = (item: SupplyItem) => {
    setEditingSupply(item);
    setSupplyFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      unitCostPhp: item.unitCostPhp,
      lowStockThreshold: item.lowStockThreshold,
      supplierOrLocation: item.supplierOrLocation || '',
      notes: item.notes || '',
    });
    setIsAddSupplyModalOpen(true);
  };

  const handleSaveSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupply) {
      supplyService.updateSupply(editingSupply.id, supplyFormData);
      toast.success(`Supply "${supplyFormData.name}" updated successfully.`, 'Supply Updated');
    } else {
      supplyService.addSupply(supplyFormData);
      toast.success(`Supply "${supplyFormData.name}" added to inventory.`, 'Supply Added');
    }
    setIsAddSupplyModalOpen(false);
    onRefresh();
  };

  const handleOpenAddRack = () => {
    setEditingRack(null);
    setRackFormData({
      rackCode: `RACK-${String.fromCharCode(65 + racks.length)}`,
      rackName: '',
      categoryTag: 'boxy-tees',
      capacity: 25,
      currentPiecesCount: 0,
      locationNotes: '',
    });
    setIsAddRackModalOpen(true);
  };

  const handleOpenEditRack = (rack: StudioRack) => {
    setEditingRack(rack);
    setRackFormData({
      rackCode: rack.rackCode,
      rackName: rack.rackName,
      categoryTag: rack.categoryTag,
      capacity: rack.capacity,
      currentPiecesCount: rack.currentPiecesCount,
      locationNotes: rack.locationNotes,
    });
    setIsAddRackModalOpen(true);
  };

  const handleSaveRack = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRack) {
      supplyService.updateRack(editingRack.id, rackFormData);
      toast.success(`Rack "${rackFormData.rackName}" updated successfully.`, 'Rack Updated');
    } else {
      supplyService.addRack(rackFormData);
      toast.success(`Rack "${rackFormData.rackName}" added to studio floor.`, 'Rack Added');
    }
    setIsAddRackModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-3 sm:space-y-4 font-mono text-zinc-950">
      
      {/* 1. Low Stock Warning Bar (If any) */}
      {lowStockItems.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Low Stock Alert:</span>
            <span className="font-normal text-amber-800">
              {lowStockItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(' · ')}
            </span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
            Restock Soon
          </span>
        </div>
      )}

      {/* 2. Simplified 3 Tab Filters & Search Bar */}
      <div className="space-y-2.5">
        
        {/* Search Bar & Add Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {activeCategory !== 'racks' ? (
            <div className="relative w-full sm:max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search supply or location..."
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 shadow-2xs"
              />
            </div>
          ) : <div />}

          <button
            onClick={activeCategory === 'racks' ? handleOpenAddRack : handleOpenAddSupply}
            className="w-full sm:w-auto h-9 px-4 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-xs active:scale-98 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeCategory === 'racks' ? ' Add Rack' : ' Add Supply'}</span>
          </button>
        </div>

        {/* 3 Common Tabs (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all' as const, label: 'All Supplies', count: supplies.length },
            { id: 'packaging' as const, label: '📦 Packaging & Supplies', count: supplies.filter(s => s.category === 'packaging').length },
            { id: 'racks' as const, label: '🏬 Clothing Racks', count: racks.length },
          ].map(tab => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. Main Content: Supplies (Mobile Cards + Desktop Table) OR Physical Racks Grid */}
      {activeCategory === 'racks' ? (
        
        /* Physical Studio Racks Grid */
        <div className="space-y-4">
          {racks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3 shadow-2xs font-mono">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-950">No clothing racks configured</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Add physical studio racks to track piece capacity and hanging counts.
                </p>
              </div>
              <button
                onClick={handleOpenAddRack}
                className="h-9 px-4 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add First Studio Rack</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {racks.map(rack => {
                const fillPercentage = Math.min(100, Math.round((rack.currentPiecesCount / rack.capacity) * 100));
                const isFull = rack.currentPiecesCount >= rack.capacity;

                return (
                  <div
                    key={rack.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-2xs space-y-3 sm:space-y-4 hover:border-zinc-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-zinc-950 text-white shadow-xs">
                          {rack.rackCode}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditRack(rack)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                            title="Edit Rack"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingRack(rack)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Rack"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-heading font-bold text-sm text-zinc-950">
                          {rack.rackName}
                        </h4>
                        <span className="text-[10px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold uppercase inline-block mt-1">
                          {rack.categoryTag.replace(/-/g, ' ')}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        📍 {rack.locationNotes}
                      </p>
                    </div>

                    {/* Rack Capacity Meter & Controls */}
                    <div className="space-y-2 pt-3 border-t border-zinc-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-600">Capacity:</span>
                        <strong className="text-zinc-950">
                          {rack.currentPiecesCount} / {rack.capacity} pcs ({fillPercentage}%)
                        </strong>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isFull
                              ? 'bg-red-500'
                              : fillPercentage > 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>

                      {/* Quick Piece Counter Increment/Decrement */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-400">Update count:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRackPieceDelta(rack.id, -1)}
                            disabled={rack.currentPiecesCount <= 0}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-zinc-950">
                            {rack.currentPiecesCount}
                          </span>
                          <button
                            onClick={() => handleRackPieceDelta(rack.id, 1)}
                            disabled={rack.currentPiecesCount >= rack.capacity}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      ) : (

        /* Supplies View: Mobile Native Cards + Desktop Full Table */
        <div className="space-y-3">
          
          {filteredSupplies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3 shadow-2xs font-mono">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-950">No supplies found</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {searchQuery ? `No supplies matching "${searchQuery}"` : 'Your supply inventory is currently empty.'}
                </p>
              </div>
              <button
                onClick={handleOpenAddSupply}
                className="h-9 px-4 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add First Supply</span>
              </button>
            </div>
          ) : (
            <>
              {/* 1. MOBILE VIEW: Responsive Supply Cards (< md:) */}
              <div className="md:hidden space-y-2.5">
                {filteredSupplies.map(item => {
                  const isLowStock = item.quantity <= item.lowStockThreshold;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-zinc-200 p-3.5 shadow-2xs space-y-3"
                    >
                      {/* Top Row: Name & Low Stock Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-zinc-950 leading-tight">
                            {item.name}
                          </h4>
                          {item.supplierOrLocation && (
                            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                              <span>{item.supplierOrLocation}</span>
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-[10px] text-zinc-400 mt-0.5 italic">
                              {item.notes}
                            </p>
                          )}
                        </div>

                        {isLowStock ? (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full uppercase shrink-0">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase shrink-0">
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Middle Row: Stock Level Counter & Pricing Split */}
                      <div className="bg-zinc-50 rounded-xl p-2.5 flex items-center justify-between border border-zinc-100">
                        
                        {/* Stock Counter */}
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase font-bold block">Current Stock</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <button
                              onClick={() => handleStockDelta(item.id, -1)}
                              disabled={item.quantity <= 0}
                              className="w-6 h-6 flex items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-xs text-zinc-950 min-w-12 text-center">
                              {item.quantity} {item.unit}
                            </span>
                            <button
                              onClick={() => handleStockDelta(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Cost & Valuation */}
                        <div className="text-right space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase font-bold block">Cost &amp; Valuation</span>
                          <span className="text-xs text-zinc-600 block">
                            {formatPhp(item.unitCostPhp)} <span className="text-[10px] text-zinc-400">/{item.unit}</span>
                          </span>
                          <strong className="text-xs text-zinc-950 font-bold block font-mono">
                            {formatPhp(item.quantity * item.unitCostPhp)}
                          </strong>
                        </div>

                      </div>

                      {/* Bottom Row: Actions */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100">
                        <button
                          onClick={() => handleOpenEditSupply(item)}
                          className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all flex items-center gap-1 active:scale-98 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingSupply(item)}
                          className="h-8 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center gap-1 active:scale-98 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* 2. DESKTOP VIEW: Full Spreadsheet Table (>= md:) */}
              <div className="hidden md:block border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Supply Item</th>
                        <th className="p-3.5">Stock Level</th>
                        <th className="p-3.5">Cost / Pc</th>
                        <th className="p-3.5">Total Value</th>
                        <th className="p-3.5">Storage Location</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredSupplies.map(item => {
                        const isLowStock = item.quantity <= item.lowStockThreshold;

                        return (
                          <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                            
                            {/* Name */}
                            <td className="p-3.5">
                              <span className="font-bold text-zinc-950 block">{item.name}</span>
                              {item.notes && (
                                <span className="text-[10px] text-zinc-400 mt-0.5 block">{item.notes}</span>
                              )}
                            </td>

                            {/* Stock Level Counter */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStockDelta(item.id, -1)}
                                  disabled={item.quantity <= 0}
                                  className="p-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>

                                <span className={`font-mono font-bold text-xs min-w-8 text-center ${
                                  isLowStock ? 'text-amber-700' : 'text-zinc-950'
                                }`}>
                                  {item.quantity} {item.unit}
                                </span>

                                <button
                                  onClick={() => handleStockDelta(item.id, 1)}
                                  className="p-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>

                                {isLowStock && (
                                  <span className="ml-1 text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase shrink-0">
                                    Low Stock
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Unit Cost */}
                            <td className="p-3.5 font-bold text-zinc-700">
                              {formatPhp(item.unitCostPhp)}
                            </td>

                            {/* Total Value */}
                            <td className="p-3.5 font-bold text-zinc-950">
                              {formatPhp(item.quantity * item.unitCostPhp)}
                            </td>

                            {/* Location */}
                            <td className="p-3.5 text-zinc-500">
                              {item.supplierOrLocation || 'Studio Hub'}
                            </td>

                            {/* Actions */}
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => handleOpenEditSupply(item)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingSupply(item)}
                                className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>

      )}

      {/* 4. Add / Edit Supply Modal (Responsive Grid Form) */}
      {isAddSupplyModalOpen && (
        <Modal
          isOpen={isAddSupplyModalOpen}
          onClose={() => setIsAddSupplyModalOpen(false)}
          title={editingSupply ? 'Edit Supply Item' : 'Add Supply Item'}
        >
          <form onSubmit={handleSaveSupply} className="space-y-3.5 font-mono text-xs text-zinc-950">
            <div className="space-y-1">
              <label className="block font-bold text-zinc-800">Item Name *</label>
              <input
                type="text"
                required
                value={supplyFormData.name}
                onChange={e => setSupplyFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. J&T Pouches Large"
                className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Category</label>
                <select
                  value={supplyFormData.category}
                  onChange={e => setSupplyFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                >
                  <option value="packaging">Packaging &amp; Supplies</option>
                  <option value="equipment">Studio Equipment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Unit Type</label>
                <select
                  value={supplyFormData.unit}
                  onChange={e => setSupplyFormData(prev => ({ ...prev, unit: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="rolls">Rolls</option>
                  <option value="sheets">Sheets</option>
                  <option value="packs">Packs</option>
                  <option value="bottles">Bottles</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Current Qty</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={supplyFormData.quantity}
                  onChange={e => setSupplyFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Cost / Pc (₱)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  required
                  value={supplyFormData.unitCostPhp}
                  onChange={e => setSupplyFormData(prev => ({ ...prev, unitCostPhp: Number(e.target.value) }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Low Stock Alert</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={supplyFormData.lowStockThreshold}
                  onChange={e => setSupplyFormData(prev => ({ ...prev, lowStockThreshold: Number(e.target.value) }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-zinc-800">Storage Location</label>
              <input
                type="text"
                value={supplyFormData.supplierOrLocation}
                onChange={e => setSupplyFormData(prev => ({ ...prev, supplierOrLocation: e.target.value }))}
                placeholder="e.g. Packing Table / Shelf A"
                className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-zinc-800">Item Notes / Purpose</label>
              <input
                type="text"
                value={supplyFormData.notes}
                onChange={e => setSupplyFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g. Waterproof packaging used for courier shipments"
                className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddSupplyModalOpen(false)}
                className="w-full sm:w-auto h-10 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-bold transition-all text-xs active:scale-98 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold transition-all shadow-xs text-xs active:scale-98 cursor-pointer"
              >
                {editingSupply ? 'Save Changes' : '+ Add Item'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Add / Edit Rack Modal (Responsive Grid Form) */}
      {isAddRackModalOpen && (
        <Modal
          isOpen={isAddRackModalOpen}
          onClose={() => setIsAddRackModalOpen(false)}
          title={editingRack ? 'Edit Studio Rack' : 'Add Studio Rack'}
        >
          <form onSubmit={handleSaveRack} className="space-y-3.5 font-mono text-xs text-zinc-950">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Rack Code *</label>
                <input
                  type="text"
                  required
                  value={rackFormData.rackCode}
                  onChange={e => setRackFormData(prev => ({ ...prev, rackCode: e.target.value }))}
                  placeholder="e.g. RACK-D"
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Category Tag</label>
                <select
                  value={rackFormData.categoryTag}
                  onChange={e => setRackFormData(prev => ({ ...prev, categoryTag: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                >
                  <option value="boxy-tees">Boxy Tees</option>
                  <option value="cropped-hoodies">Cropped Hoodies</option>
                  <option value="parachute-cargos">Parachute &amp; Cargos</option>
                  <option value="techwear-outerwear">Outerwear &amp; Jackets</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-zinc-800">Rack Display Name *</label>
              <input
                type="text"
                required
                value={rackFormData.rackName}
                onChange={e => setRackFormData(prev => ({ ...prev, rackName: e.target.value }))}
                placeholder="e.g. Main Boxy Tees Rack"
                className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Max Capacity (pcs)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={rackFormData.capacity}
                  onChange={e => setRackFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-800">Current Hanging (pcs)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={rackFormData.currentPiecesCount}
                  onChange={e => setRackFormData(prev => ({ ...prev, currentPiecesCount: Number(e.target.value) }))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-zinc-800">Location Notes</label>
              <input
                type="text"
                value={rackFormData.locationNotes}
                onChange={e => setRackFormData(prev => ({ ...prev, locationNotes: e.target.value }))}
                placeholder="e.g. Studio Left Wall"
                className="w-full h-10 px-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-950 bg-white text-xs"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddRackModalOpen(false)}
                className="w-full sm:w-auto h-10 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-bold transition-all text-xs active:scale-98 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold transition-all shadow-xs text-xs active:scale-98 cursor-pointer"
              >
                {editingRack ? 'Save Changes' : '+ Add Rack'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Supply Confirmation Modal */}
      {deletingSupply && (
        <ConfirmModal
          isOpen={Boolean(deletingSupply)}
          onClose={() => setDeletingSupply(null)}
          onConfirm={() => {
            if (deletingSupply) {
              handleDeleteSupply(deletingSupply.id, deletingSupply.name);
              setDeletingSupply(null);
            }
          }}
          title="Delete Supply Item?"
          description="Are you sure you want to remove this supply item from inventory? All stock counts will be purged."
          itemName={`${deletingSupply.name} (${deletingSupply.quantity} ${deletingSupply.unit})`}
          confirmText="Yes, Delete Supply"
          cancelText="Keep Supply"
          variant="danger"
        />
      )}

      {/* Delete Rack Confirmation Modal */}
      {deletingRack && (
        <ConfirmModal
          isOpen={Boolean(deletingRack)}
          onClose={() => setDeletingRack(null)}
          onConfirm={() => {
            if (deletingRack) {
              handleDeleteRack(deletingRack.id, deletingRack.rackName);
              setDeletingRack(null);
            }
          }}
          title="Delete Physical Studio Rack?"
          description="Are you sure you want to remove this clothing rack from your studio floor layout?"
          itemName={`${deletingRack.rackName} [${deletingRack.rackCode}] (${deletingRack.currentPiecesCount}/${deletingRack.capacity} pcs)`}
          confirmText="Yes, Delete Rack"
          cancelText="Keep Rack"
          variant="danger"
        />
      )}

    </div>
  );
};

export default AdminSuppliesSection;
