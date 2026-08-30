import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ConditionReport } from '../../types/index.ts';

interface ConditionGradeCardProps {
  condition: ConditionReport;
}

export const ConditionGradeCard: React.FC<ConditionGradeCardProps> = ({ condition }) => {
  return (
    <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200 space-y-3">
      
      {/* Header: Score & Era */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white border border-zinc-200 text-zinc-900 shadow-sm">
            {condition.grade}
          </span>
          <span className="font-mono font-bold text-sm text-amber-700">
            {condition.ratingValue} / 10
          </span>
        </div>

        {condition.fabricGsm && (
          <span className="text-xs font-mono font-bold text-zinc-600 uppercase tracking-wider">
            Density: <strong className="text-zinc-950">{condition.fabricGsm} GSM</strong>
          </span>
        )}
      </div>

      {/* Honest Curator Breakdown */}
      <div className="text-xs text-zinc-700 leading-relaxed bg-white p-3.5 rounded-xl border border-zinc-200 font-mono shadow-sm">
        <div className="flex items-center gap-1.5 font-bold text-amber-700 mb-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Curator's Transparency Notes:</span>
        </div>
        <p>{condition.defectsSummary}</p>
      </div>

      {/* Sanitation & Authenticity Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
        {condition.isSanitized && (
          <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eco-Steam Sanitized Prior to Packaging</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>100% Verified Streetwear Archive</span>
        </div>
      </div>

    </div>
  );
};
