import React from 'react';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Badge } from '../common/Badge.tsx';
import { Zap, Eye, Ruler } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';

interface HeroBannerProps {
  featuredProduct?: Item;
  onSelectProduct?: (item: Item) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredProduct,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();

  if (!featuredProduct) return null;

  const handleMine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!featuredProduct.isSoldOut) {
      addToCart(featuredProduct);
    }
  };

  const handleInspect = () => {
    if (onSelectProduct) {
      onSelectProduct(featuredProduct);
    }
  };

  return (
    <section className="bg-white border-b border-zinc-200 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div
          onClick={handleInspect}
          className="relative bg-zinc-50 hover:bg-zinc-100/70 transition-all duration-200 rounded-3xl border border-zinc-200 p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 lg:gap-10 cursor-pointer group shadow-sm hover:shadow-md"
        >
          {/* Visual Product Image Showcase */}
          <div className="relative w-full md:w-1/2 aspect-[4/5] sm:aspect-square md:aspect-[4/5] max-h-[460px] rounded-2xl overflow-hidden bg-white border border-zinc-200 shrink-0">
            <img
              src={featuredProduct.images[0]}
              alt={featuredProduct.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Top Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <Badge variant="gold">1-of-1 Featured Drop</Badge>
              {featuredProduct.isSoldOut && <Badge variant="sold">Claimed</Badge>}
            </div>

            {featuredProduct.condition.fabricGsm && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black text-white shadow-sm">
                  {featuredProduct.condition.fabricGsm} GSM
                </span>
              </div>
            )}
          </div>

          {/* Visual Product Info & Quick Action */}
          <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 uppercase tracking-widest">
                <span>{featuredProduct.brand}</span>
                <span className="text-zinc-300">/</span>
                <span className="text-zinc-500">{featuredProduct.dropNumber}</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 mt-1 leading-tight group-hover:text-amber-700 transition-colors">
                {featuredProduct.title}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 font-mono mt-2 line-clamp-2 leading-relaxed">
                {featuredProduct.description}
              </p>

              {/* Hand-Measured Blueprint Pills */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-sm">
                  <span className="text-[10px] text-zinc-500 block uppercase">Tag Size</span>
                  <strong className="text-zinc-950 font-bold text-sm">{featuredProduct.tagSize}</strong>
                </div>

                {featuredProduct.measurements.pitToPitInches > 0 && (
                  <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-sm">
                    <span className="text-[10px] text-amber-700 block uppercase font-semibold">Boxy Width</span>
                    <strong className="text-zinc-950 font-bold text-sm flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-zinc-400" />
                      {featuredProduct.measurements.pitToPitInches}" P2P
                    </strong>
                  </div>
                )}

                {featuredProduct.measurements.lengthInches > 0 && (
                  <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-sm">
                    <span className="text-[10px] text-zinc-500 block uppercase">Body Length</span>
                    <strong className="text-zinc-950 font-bold text-sm">{featuredProduct.measurements.lengthInches}"</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">
                  Curated Archive Price
                </span>
                <span className="font-mono font-extrabold text-2xl sm:text-3xl text-zinc-950">
                  {formatPhp(featuredProduct.pricePhp)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInspect}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-mono font-semibold transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4 text-zinc-600" />
                  <span>Inspect</span>
                </button>

                {!featuredProduct.isSoldOut && (
                  <button
                    type="button"
                    onClick={handleMine}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-gradient text-black text-xs font-heading font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    <span>Mine Piece</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
