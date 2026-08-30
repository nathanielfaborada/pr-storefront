import React from 'react';
import { ShieldCheck, Ruler, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext.tsx';

export const Footer: React.FC = () => {
  const { setIsChatOpen } = useChat();

  return (
    <footer className="bg-zinc-50 text-zinc-600 pt-16 pb-24 md:pb-16 border-t border-zinc-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-zinc-200">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-zinc-950 text-sm">1-of-1 Curated Drops</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Exclusive boxy silhouettes &amp; heavyweight 240+ GSM garments. Once claimed, it's permanently archived.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-zinc-950 text-sm">Tailoring Blueprint Specs</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Hand-measured boxy pit-to-pit, cropped length, and shoulder drop in inches to guarantee exact drape.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-zinc-950 text-sm">Sanitized &amp; Steam Treated</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Deep eco-sanitization and high-temp steam finishing applied to all garments prior to vault packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-zinc-950 text-sm">15-Min Bag Lock Protection</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Real-time inventory hold engines prevent cart sniping while you complete your GCash/Maya checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Streetwear Ethos & Sizing Guide */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-zinc-600 border-b border-zinc-200">
          <div>
            <span className="font-heading text-lg font-bold text-zinc-950 block mb-2 tracking-tight">P&amp;R Streetwear Studio</span>
            <p className="leading-relaxed">
              Curated contemporary streetwear, boxy drop-shoulder tees, heavy fleece, and parachute cargo cuts. Based in Quezon City, Metro Manila, Philippines.
            </p>
          </div>

          <div>
            <h5 className="font-mono font-bold text-zinc-900 uppercase tracking-wider mb-2">Modern Tailoring Guide</h5>
            <p className="leading-relaxed">
              Our boxy silhouettes are cut wider across the chest with a tailored cropped length. Always compare our <strong>Boxy Width (Pit-to-Pit)</strong> with your favorite streetwear tee.
            </p>
          </div>

          <div>
            <h5 className="font-mono font-bold text-zinc-900 uppercase tracking-wider mb-2">Live Sizing Concierge</h5>
            <p className="leading-relaxed mb-3">
              Need on-body fitpics, height/weight advice, or custom courier bundling? Reach out directly via our live DM.
            </p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-colors font-mono font-semibold shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              Chat Stylist DM
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-4">
          <p>© 2026 P&amp;R Streetwear &amp; Style Collection. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>GCash / Maya Merchant Verified</span>
            <span>J&amp;T Express / Same-Day Courier</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
