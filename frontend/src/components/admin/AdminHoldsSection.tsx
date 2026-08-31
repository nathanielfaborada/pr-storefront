import React from 'react';
import { Item } from '../../types/index.ts';
import { Button } from '../common/Button.tsx';
import { Clock } from 'lucide-react';

interface AdminHoldsSectionProps {
  activeHolds: Item[];
  onReleaseLock: (id: string) => void;
}

export const AdminHoldsSection: React.FC<AdminHoldsSectionProps> = ({
  activeHolds,
  onReleaseLock,
}) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-zinc-200 space-y-4 shadow-xs font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-sm sm:text-base text-zinc-950">Active Bag Hold Radar</h3>
          <p className="text-xs text-zinc-500">Real-time locks placed by buyers browsing the live drop.</p>
        </div>
      </div>

      {activeHolds.length === 0 ? (
        <div className="py-10 sm:py-12 text-center text-zinc-500">
          <Clock className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
          <p className="text-sm font-medium">No active 15-minute locks right now.</p>
          <p className="text-xs text-zinc-400">All available pieces are open on digital racks.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {activeHolds.map(item => (
            <div key={item.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-10 h-12 object-cover rounded-lg bg-zinc-100 shrink-0"
                />
                <div>
                  <p className="font-bold text-xs text-zinc-950 line-clamp-1">{item.title}</p>
                  <span className="text-[10px] text-orange-700 font-bold">15-Min Reservation Active</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReleaseLock(item.id)}
                className="text-xs text-red-600 hover:bg-red-50 shrink-0"
              >
                Release Lock
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
