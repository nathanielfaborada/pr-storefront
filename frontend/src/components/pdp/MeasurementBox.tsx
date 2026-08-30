import React from 'react';
import { Ruler, Info } from 'lucide-react';
import { GarmentMeasurements } from '../../types/index.ts';

interface MeasurementBoxProps {
  measurements: GarmentMeasurements;
  category: string;
}

export const MeasurementBox: React.FC<MeasurementBoxProps> = ({ measurements, category }) => {
  const isPants = category === 'parachute-cargos';

  return (
    <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white border border-zinc-200 text-amber-600 shadow-sm">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-zinc-950">Tailoring Blueprint Specs</h4>
            <p className="text-[10px] font-mono text-zinc-500">Hand-measured flat in inches (±0.5" tolerance)</p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-white px-2.5 py-1 rounded-md border border-zinc-200 text-amber-700 font-bold shadow-sm">
          INCHES (")
        </span>
      </div>

      {/* Grid of Measurements */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {!isPants ? (
          <>
            {/* Boxy Width (Chest) */}
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
                Boxy Width (P2P)
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 block mt-0.5">
                {measurements.pitToPitInches > 0 ? `${measurements.pitToPitInches}"` : 'N/A'}
              </span>
              <span className="text-[10px] text-zinc-500">Armpit to armpit</span>
            </div>

            {/* Cropped / Drop-Tail Length */}
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
                Body Length
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 block mt-0.5">
                {measurements.lengthInches > 0 ? `${measurements.lengthInches}"` : 'N/A'}
              </span>
              <span className="text-[10px] text-zinc-500">Collar seam to hem</span>
            </div>

            {/* Shoulder Drop */}
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 block">
                Shoulder Drop
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 block mt-0.5">
                {measurements.shoulderDropInches ? `${measurements.shoulderDropInches}"` : '—'}
              </span>
              <span className="text-[10px] text-zinc-500">Seam to seam</span>
            </div>

            {/* Sleeve Opening */}
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 block">
                Sleeve Length
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 block mt-0.5">
                {measurements.sleeveInches ? `${measurements.sleeveInches}"` : '—'}
              </span>
              <span className="text-[10px] text-zinc-500">Shoulder to cuff</span>
            </div>
          </>
        ) : (
          <>
            {/* Outseam / Length */}
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
                Total Outseam
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 block mt-0.5">
                {measurements.lengthInches}"
              </span>
              <span className="text-[10px] text-zinc-500">Waist to bottom cuff</span>
            </div>

            {/* Leg Opening Hem */}
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
                Leg Opening
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 block mt-0.5">
                {measurements.bottomHemInches}"
              </span>
              <span className="text-[10px] text-zinc-500">Wide-leg opening</span>
            </div>
          </>
        )}
      </div>

      {/* Sizing Advisory */}
      <div className="mt-3 flex items-start gap-2 text-[11px] text-zinc-700 bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-tight font-mono">
          <strong>Streetwear Tip:</strong> Boxy tees feature a wide chest with a cropped hem. Compare the <em>{measurements.pitToPitInches}" Boxy Width</em> with your favorite tee.
        </p>
      </div>
    </div>
  );
};
