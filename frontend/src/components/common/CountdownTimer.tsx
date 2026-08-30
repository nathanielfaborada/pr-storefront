import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  seconds: number;
  totalDurationSeconds?: number;
  showProgressBar?: boolean;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  seconds,
  totalDurationSeconds = 15 * 60,
  showProgressBar = true,
  compact = false,
}) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const isUrgent = seconds <= 180 && seconds > 0;
  const isExpired = seconds <= 0;
  const percentage = Math.max(0, Math.min(100, (seconds / totalDurationSeconds) * 100));

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
        isUrgent
          ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
          : 'bg-white border-zinc-200 text-amber-700 shadow-sm'
      }`}>
        <Clock className="w-3 h-3" />
        {formattedTime}
      </span>
    );
  }

  return (
    <div className={`p-3.5 rounded-2xl border transition-colors ${
      isUrgent
        ? 'bg-red-50 border-red-200 text-red-900 animate-pulse'
        : isExpired
        ? 'bg-zinc-100 border-zinc-200 text-zinc-500'
        : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider">
          {isUrgent ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{isExpired ? 'Reservation Expired' : '15-Min Bag Lock Active'}</span>
        </div>
        <span className="font-mono font-bold text-sm text-zinc-950 tracking-wider">
          {formattedTime}
        </span>
      </div>

      {showProgressBar && (
        <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden border border-zinc-200">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isUrgent ? 'bg-red-500' : 'bg-brand-gradient'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      
      <p className="text-[11px] text-zinc-500 mt-2 leading-tight">
        {isUrgent 
          ? '⚠️ Exclusive hold expiring soon. Complete purchase to secure this 1-of-1 piece.'
          : 'This piece is locked exclusively in your bag. Other shoppers cannot check it out.'}
      </p>
    </div>
  );
};
