import React, { useEffect, useRef } from 'react';
import { Search, X, Tag, ArrowRight } from 'lucide-react';
import { useFilter } from '../../context/FilterContext.tsx';
import { Item } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { Badge } from '../common/Badge.tsx';

interface SearchModalProps {
  products: Item[];
  onSelectProduct: (item: Item) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ products, onSelectProduct }) => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useFilter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = searchQuery.trim() === '' ? [] : products.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.tagSize.toLowerCase().includes(q) ||
      item.recommendedFit.toLowerCase().includes(q) ||
      item.silhouette.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const popularSearches = ['Boxy Tee', '450 GSM Hoodie', 'Parachute Pants', 'Drop Shoulder', 'Cropped Bomber'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search Dialog Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 bg-white">
          <Search className="w-4 h-4 text-amber-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search silhouettes, GSM weight, boxy cuts, cargos..."
            className="w-full bg-transparent text-zinc-950 placeholder:text-zinc-400 text-sm focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-zinc-400 hover:text-black rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {searchQuery.trim() === '' ? (
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-2 mb-3">
                Trending Silhouettes &amp; Filters
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {popularSearches.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors font-mono"
                  >
                    <Tag className="w-3 h-3 text-amber-600" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p className="text-sm font-medium">No 1-of-1 piece matching "{searchQuery}"</p>
              <p className="text-xs text-zinc-400 mt-1 font-mono">Try searching by silhouette (e.g. "Boxy", "260 GSM", "Parachute")</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-2 mb-2">
                Found {filtered.length} Archive Drops
              </p>
              {filtered.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer group border border-transparent hover:border-zinc-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">
                          {item.brand}
                        </span>
                        {item.isSoldOut && <Badge variant="sold">Claimed</Badge>}
                        {item.isReserved && !item.isSoldOut && <Badge variant="hold">Reserved</Badge>}
                      </div>
                      <h4 className="text-xs font-heading font-semibold text-zinc-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        Tag: <strong className="text-zinc-800">{item.tagSize}</strong> · P2P: <strong>{item.measurements.pitToPitInches > 0 ? `${item.measurements.pitToPitInches}"` : 'Wide'}</strong> · {item.silhouette}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-sm text-zinc-950">
                      {formatPhp(item.pricePhp)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-zinc-300 rounded text-zinc-700 shadow-sm">ESC</kbd> to close</span>
          <span>1-of-1 Curated Streetwear Vault</span>
        </div>

      </div>
    </div>
  );
};
