import React from 'react';

interface BadgeProps {
  variant?: 'gold' | 'sold' | 'hold' | 'silhouette' | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  if (variant === 'gold') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/25 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        {children}
      </span>
    );
  }

  if (variant === 'sold') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-red-600 text-white shadow-sm ${className}`}>
        {children}
      </span>
    );
  }

  if (variant === 'hold') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase bg-orange-50 border border-orange-300 text-orange-900 animate-pulse shadow-sm ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        {children}
      </span>
    );
  }

  if (variant === 'silhouette') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold bg-zinc-100 border border-zinc-200 text-zinc-800 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono bg-zinc-100 border border-zinc-200 text-zinc-700 ${className}`}>
      {children}
    </span>
  );
};
