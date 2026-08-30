import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Item } from '../types/index.ts';
import { productService } from '../services/productService.ts';
import { formatPhp } from '../utils/index.ts';
import { Badge } from '../components/common/Badge.tsx';
import { ShieldCheck, LogOut, PackageCheck, RefreshCw, Lock } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Item[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  const filtered = products.filter(p => {
    if (filter === 'available') return !p.isSoldOut;
    if (filter === 'sold') return p.isSoldOut;
    return true;
  });

  const totalVaultValue = products.reduce((sum, p) => sum + p.pricePhp, 0);
  const totalSoldValue = products.filter(p => p.isSoldOut).reduce((sum, p) => sum + p.pricePhp, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-mono text-zinc-950">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-zinc-950 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-950">
                P&amp;R Vault Console
              </h1>
              <p className="text-xs text-zinc-500">
                Logged in as: <strong className="text-zinc-900">{user?.name}</strong> ({user?.role})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            <span>Curator Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">
            Total 1-of-1 Vault Archive
          </span>
          <span className="font-bold text-2xl text-zinc-950 mt-1 block">
            {products.length} Pieces
          </span>
          <span className="text-[11px] text-zinc-400">Val: {formatPhp(totalVaultValue)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <span className="text-[10px] text-emerald-700 uppercase font-bold block">
            Claimed / Sold Out
          </span>
          <span className="font-bold text-2xl text-emerald-950 mt-1 block">
            {products.filter(p => p.isSoldOut).length} Pieces
          </span>
          <span className="text-[11px] text-emerald-700">Gross: {formatPhp(totalSoldValue)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
          <span className="text-[10px] text-amber-800 uppercase font-bold block">
            Live Available Drops
          </span>
          <span className="font-bold text-2xl text-amber-950 mt-1 block">
            {products.filter(p => !p.isSoldOut).length} Pieces
          </span>
          <span className="text-[11px] text-amber-700">Active on Digital Racks</span>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-zinc-950">
            Curated Garment Inventory Manifest
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'available', 'sold'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  filter === f
                    ? 'bg-zinc-950 text-white shadow-sm font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Piece</th>
                  <th className="p-3.5">Silhouette</th>
                  <th className="p-3.5">Specs (Tag / P2P)</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-10 h-12 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-zinc-950 block">{item.title}</span>
                        <span className="text-[10px] text-zinc-400">{item.id} · {item.dropNumber}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-zinc-700">{item.silhouette}</td>
                    <td className="p-3.5 text-zinc-700">
                      Tag: <strong>{item.tagSize}</strong> · {item.measurements.pitToPitInches > 0 ? `${item.measurements.pitToPitInches}"` : 'Wide'}
                    </td>
                    <td className="p-3.5 text-zinc-700">{item.condition.grade}</td>
                    <td className="p-3.5 font-bold text-zinc-950">{formatPhp(item.pricePhp)}</td>
                    <td className="p-3.5">
                      {item.isSoldOut ? (
                        <Badge variant="sold">Claimed</Badge>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Drop
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
