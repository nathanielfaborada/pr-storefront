import React, { useState } from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Printer, CheckCircle2, Truck, MapPin, Package, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface WaybillCardProps {
  order: OrderPayload;
}

export const WaybillCard: React.FC<WaybillCardProps> = ({ order }) => {
  const [isPhoneUnmasked, setIsPhoneUnmasked] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.length >= 10) {
      const first4 = cleaned.slice(0, 4);
      const last4 = cleaned.slice(-4);
      return `${first4}-***-${last4}`;
    }
    return phone.replace(/\d(?=\d{3})/g, '*');
  };

  const halfPaymentDeposit = Math.round(order.totalAmountPhp / 2);
  const remainingBalanceCod = order.totalAmountPhp - halfPaymentDeposit;

  return (
    <div className="space-y-3 sm:space-y-4 font-mono text-zinc-950">
      
      {/* 1. WAYBILL MASTHEAD (Fluid & Breathable) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-zinc-950 tracking-tight">
              P&amp;R
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-orange-600 text-white px-2 py-0.5 rounded font-mono">
              EXPRESS WAYBILL
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200">
            J&amp;T LOGISTICS
          </span>
        </div>

        {/* Tracking Code & Barcode Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">
              Tracking Number
            </span>
            <strong className="text-sm sm:text-base font-mono font-bold text-zinc-950 block mt-0.5">
              {order.waybillNumber || 'WB-JNT-8841-MNL'}
            </strong>
          </div>

          {/* Clean Barcode */}
          <div className="h-7 w-full sm:w-48 bg-white border border-zinc-300 px-2 py-1 rounded-lg flex items-center justify-between shrink-0">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 3, 1, 2].map((w, i) => (
              <div key={i} className="bg-zinc-950 h-full shrink-0" style={{ width: `${w * 1.2}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. ROUTE & CONSIGNEE DETAILS (Airy & Uncluttered with Privacy Masking) */}
      <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-3.5 space-y-3 shadow-2xs">
        
        {/* Origin to Destination Route Pill */}
        <div className="flex items-center justify-between text-[10px] text-zinc-600 pb-2 border-b border-zinc-200">
          <span className="font-bold flex items-center gap-1 text-zinc-900">
            <Truck className="w-3 h-3 text-orange-600" />
            <span>Pandi Hub 01 (Bulacan)</span>
          </span>
          <ArrowRight className="w-3 h-3 text-zinc-400" />
          <span className="font-bold text-zinc-900 truncate">
            {order.shippingAddress.city}, {order.shippingAddress.region}
          </span>
        </div>

        {/* Recipient Full Information with Phone Masking Toggle */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <strong className="text-zinc-950 text-sm">{order.shippingAddress.fullName}</strong>
            </div>

            {/* Masked Phone with Toggle */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-orange-800 font-mono text-xs">
                {/* On screen: masked unless toggled. In print: always unmasked for courier */}
                <span className="print:hidden">
                  📞 {isPhoneUnmasked ? order.shippingAddress.phoneNumber : maskPhoneNumber(order.shippingAddress.phoneNumber)}
                </span>
                <span className="hidden print:inline">
                  📞 {order.shippingAddress.phoneNumber}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsPhoneUnmasked(!isPhoneUnmasked)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 transition-colors print:hidden cursor-pointer"
                title={isPhoneUnmasked ? 'Hide Phone' : 'Reveal Phone'}
              >
                {isPhoneUnmasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <p className="text-zinc-700 leading-relaxed text-[11px] sm:text-xs pl-5">
            {order.shippingAddress.streetAddress}, {order.shippingAddress.barangay}, {order.shippingAddress.city}, {order.shippingAddress.region}
          </p>

          {order.shippingAddress.landmarkNotes && (
            <p className="text-[10px] text-zinc-600 italic bg-white p-2 rounded-xl border border-zinc-200 ml-5 mt-1">
              <strong>Landmark:</strong> {order.shippingAddress.landmarkNotes}
            </p>
          )}
        </div>
      </div>

      {/* 3. ITEM MANIFEST (Clean Itemized List) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 pb-1 border-b border-zinc-100">
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3 text-zinc-400" />
            <span>Garment Manifest</span>
          </span>
          <span>{order.items.length} Curated Piece(s)</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-zinc-950 truncate leading-tight">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                  <span className="font-mono">{item.id}</span>
                  <span>·</span>
                  <span className="font-bold text-zinc-800">Size {item.tagSize}</span>
                  {item.condition.fabricGsm && (
                    <>
                      <span>·</span>
                      <span className="text-zinc-600 font-mono">{item.condition.fabricGsm} GSM</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <strong className="text-zinc-950 font-mono text-xs block">
                  {formatPhp(item.pricePhp)}
                </strong>
                <span className="text-[9px] text-zinc-400 uppercase font-mono">Declared</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. COD COLLECTION & 50% POLICY SUMMARY (Clean Light Courier Manifest Box) */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-3 shadow-2xs">
        
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Total Order Valuation:</span>
          <strong className="text-zinc-950">{formatPhp(order.totalAmountPhp)}</strong>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-700 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>50% Deposit Paid ({order.paymentDetails.method.toUpperCase()}):</span>
          </span>
          <strong className="text-emerald-700">{formatPhp(halfPaymentDeposit)}</strong>
        </div>

        {/* HERO COD TO COLLECT BOX */}
        <div className="bg-white p-3 rounded-xl border-2 border-orange-500 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] sm:text-[11px] text-orange-950 uppercase font-bold tracking-wider block">
              COURIER RIDER TO COLLECT (COD):
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
              Collect upon parcel handover
            </span>
          </div>

          <strong className="text-lg sm:text-2xl font-mono font-extrabold text-orange-600">
            {formatPhp(remainingBalanceCod)}
          </strong>
        </div>
      </div>

      {/* 5. PRINT & DIGITAL ACTIONS */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <span className="text-[10px] text-zinc-400 font-mono text-center sm:text-left flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
          <span>NPC Data Privacy Protected (Phone auto-unmasks upon physical print)</span>
        </span>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto h-11 sm:h-10 px-6 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2 text-xs active:scale-98 cursor-pointer print:hidden"
        >
          <Printer className="w-4 h-4 text-orange-400" />
          <span>Print Manifest / Save PDF</span>
        </button>
      </div>

    </div>
  );
};

export default WaybillCard;
