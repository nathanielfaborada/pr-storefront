import React from 'react';
import { OrderPayload } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Printer, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface WaybillCardProps {
  order: OrderPayload;
}

export const WaybillCard: React.FC<WaybillCardProps> = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-300 p-5 sm:p-6 space-y-5 print:bg-white print:text-black print:border-solid font-mono shadow-sm">
      
      {/* Waybill Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-2xl text-zinc-950">P&amp;R</span>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500 text-black px-2 py-0.5 rounded font-mono">
              EXPRESS WAYBILL
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Contemporary Streetwear &amp; Curated Vault Consignment
          </p>
        </div>

        {/* Barcode & Tracking Number */}
        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase text-zinc-500 block">Tracking Number</span>
          <span className="font-bold text-sm text-zinc-950 tracking-wider">
            {order.waybillNumber}
          </span>
          <div className="h-6 w-36 sm:ml-auto mt-1 flex items-center gap-0.5 opacity-80 bg-zinc-900 p-1 rounded">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 2, 1].map((w, i) => (
              <div key={i} className="bg-white h-full" style={{ width: `${w * 1.5}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Shipper & Consignee 2-Column Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Sender Info */}
        <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            From (Shipper Vault):
          </span>
          <p className="font-bold text-zinc-950">P&amp;R Streetwear Studio — Hub 01</p>
          <p className="text-zinc-600">Scout Chuatoco St., Quezon City, Metro Manila</p>
          <p className="text-zinc-500">Tel: +63 917 884 9124</p>
        </div>

        {/* Recipient Info */}
        <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            To (Consignee):
          </span>
          <p className="font-bold text-zinc-950">{order.shippingAddress.fullName}</p>
          <p className="text-zinc-600">
            {order.shippingAddress.streetAddress}, {order.shippingAddress.barangay}, {order.shippingAddress.city}, {order.shippingAddress.region}
          </p>
          {order.shippingAddress.landmarkNotes && (
            <p className="text-[10px] text-zinc-500 italic">Note: {order.shippingAddress.landmarkNotes}</p>
          )}
          <p className="text-amber-800 font-bold">Tel: {order.shippingAddress.phoneNumber}</p>
        </div>
      </div>

      {/* Itemized Manifest */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
          Item Manifest (1-of-1 Curated Streetwear)
        </span>
        <div className="border border-zinc-200 rounded-2xl overflow-hidden text-xs">
          <div className="bg-zinc-50 px-3 py-2 grid grid-cols-12 font-bold text-zinc-700 text-[10px]">
            <span className="col-span-6">Garment Title / SKU</span>
            <span className="col-span-3 text-center">Specs (Tag / P2P)</span>
            <span className="col-span-3 text-right">Declared Value</span>
          </div>
          {order.items.map((item, idx) => (
            <div key={idx} className="px-3 py-2.5 grid grid-cols-12 border-t border-zinc-200 items-center">
              <div className="col-span-6 pr-2">
                <p className="font-semibold text-zinc-950 truncate">{item.title}</p>
                <span className="text-[10px] text-zinc-500">{item.id}</span>
              </div>
              <div className="col-span-3 text-center text-zinc-600">
                {item.tagSize} / {item.measurements.pitToPitInches > 0 ? `${item.measurements.pitToPitInches}"` : 'OSFA'}
              </div>
              <div className="col-span-3 text-right font-bold text-zinc-950">
                {formatPhp(item.pricePhp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Compliance Summary */}
      <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-zinc-600">
            Payment: <strong className="uppercase text-zinc-950">{order.paymentDetails.method}</strong> ({formatPhp(order.totalAmountPhp)})
          </span>
        </div>

        {/* Print Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="print:hidden text-xs"
        >
          <Printer className="w-3.5 h-3.5 mr-1.5" />
          Print / Save Digital Waybill
        </Button>
      </div>

    </div>
  );
};
