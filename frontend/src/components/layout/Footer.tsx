import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-zinc-500 py-6 sm:py-8 border-t border-zinc-200 mt-12 font-mono text-[11px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p>© 2026 P&amp;R Thrift &amp; Style Collection. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-zinc-600">
          <span className="text-orange-600 font-semibold">GCash / Maya Merchant Verified</span>
          <span className="hidden sm:inline text-zinc-300">·</span>
          <span>J&amp;T Express / Same-Day Courier</span>
        </div>
      </div>
    </footer>
  );
};
