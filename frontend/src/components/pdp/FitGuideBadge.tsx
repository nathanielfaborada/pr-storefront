import React from 'react';
import { ArrowRight, Tag, UserCheck } from 'lucide-react';

interface FitGuideBadgeProps {
  tagSize: string;
  recommendedFit: string;
}

export const FitGuideBadge: React.FC<FitGuideBadgeProps> = ({ tagSize, recommendedFit }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
      
      {/* Tag Size */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-mono text-zinc-600 shadow-sm">
        <Tag className="w-3.5 h-3.5 text-zinc-400" />
        <span>Tag Size:</span>
        <strong className="text-zinc-950 font-mono text-sm">{tagSize}</strong>
      </div>

      <div className="hidden sm:flex items-center justify-center text-zinc-400">
        <ArrowRight className="w-4 h-4" />
      </div>

      {/* Recommended Silhouette Fit */}
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-xs font-mono text-amber-900 shadow-sm">
        <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Recommended Fit:</span>
        <strong className="text-amber-900 font-bold">{recommendedFit}</strong>
      </div>

    </div>
  );
};
