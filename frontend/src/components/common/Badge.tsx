import React from 'react';

interface BadgeProps {
  variant?: 'gold' | 'sold' | 'hold' | 'silhouette' | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  if (variant === 'gold') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-black badge-curated shadow-cyber-sm ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        {children}
      </span>
    );
  }

  if (variant === 'sold') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-red-950/80 border border-red-800/80 text-red-400 ${className}`}>
        {children}
      </span>
    );
  }

  if (variant === 'hold') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide uppercase bg-orange-950/90 border border-orange-600/80 text-orange-400 animate-pulse ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        {children}
      </span>
    );
  }

  if (variant === 'silhouette') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 ${className}`}>
      {children}
    </span>
  );
};
