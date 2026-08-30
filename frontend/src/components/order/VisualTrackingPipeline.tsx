import React from 'react';
import { TrackingStep } from '../../types/index.ts';
import { CheckCircle2, Clock, Truck } from 'lucide-react';

interface VisualTrackingPipelineProps {
  pipeline: TrackingStep[];
}

export const VisualTrackingPipeline: React.FC<VisualTrackingPipelineProps> = ({ pipeline }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-zinc-200 space-y-4 font-mono shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-600" />
          <h4 className="font-heading font-bold text-sm text-zinc-950">
            5-Step Courier Fulfillment Tracker
          </h4>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
          Live Dispatch
        </span>
      </div>

      <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
        {pipeline.map((step) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={step.stepNumber} className="relative flex items-start gap-3 pl-1">
              {/* Step icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isCurrent
                  ? 'bg-amber-500 text-black shadow-md animate-pulse'
                  : 'bg-zinc-100 border border-zinc-200 text-zinc-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span className="text-[10px] font-bold">{step.stepNumber}</span>
                )}
              </div>

              {/* Step text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className={`text-xs font-bold ${
                    isCurrent ? 'text-amber-800' : isCompleted ? 'text-zinc-950' : 'text-zinc-400'
                  }`}>
                    {step.label}
                  </h5>
                  {step.timestamp && (
                    <span className="text-[10px] text-zinc-500 shrink-0">
                      {step.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
