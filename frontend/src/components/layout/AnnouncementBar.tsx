import React from 'react';
import { ShieldCheck, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-white text-zinc-700 py-2.5 px-4 overflow-hidden border-b border-zinc-200 text-[11px] font-mono shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-center gap-6 animate-marquee whitespace-nowrap md:animate-none md:justify-center">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span><strong className="text-amber-600 font-bold">DROP 08 ARCHIVE:</strong> Heavy Boxy Tees &amp; Parachute Cargos</span>
        </div>
        <span className="text-zinc-300 hidden md:inline">/</span>
        <div className="flex items-center gap-1.5 text-zinc-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>1-of-1 Curated · 240+ GSM Fabrics</span>
        </div>
        <span className="text-zinc-300 hidden md:inline">/</span>
        <div className="flex items-center gap-1.5 text-zinc-600">
          <Truck className="w-3.5 h-3.5 text-amber-600" />
          <span>Metro Manila Same-Day &amp; Free PH Shipping over ₱2,500</span>
        </div>
      </div>
    </div>
  );
};
