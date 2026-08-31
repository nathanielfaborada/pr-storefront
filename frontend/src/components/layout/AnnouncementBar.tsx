import React from 'react';
import { ShieldCheck, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/90 text-zinc-700 py-2.5 px-4 overflow-hidden border-b border-orange-200/60 text-[11px] font-mono shadow-sm">
      <div className="flex items-center justify-center gap-6 animate-marquee whitespace-nowrap md:animate-none md:justify-center">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-950">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span><strong className="text-orange-600 font-bold">DROP 08 ARCHIVE:</strong> Heavy Boxy Tees &amp; Parachute Cargos</span>
        </div>
        <span className="text-orange-200 hidden md:inline">/</span>
        <div className="flex items-center gap-1.5 text-zinc-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>1-of-1 Curated · 240+ GSM Fabrics</span>
        </div>
        <span className="text-orange-200 hidden md:inline">/</span>
        <div className="flex items-center gap-1.5 text-zinc-700">
          <Truck className="w-3.5 h-3.5 text-orange-600" />
          <span>Metro Manila Same-Day &amp; Free PH Shipping over ₱2,500</span>
        </div>
      </div>
    </div>
  );
};
