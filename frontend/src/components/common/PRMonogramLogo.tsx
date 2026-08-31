import React from 'react';

interface PRMonogramLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  variant?: 'light' | 'dark';
}

export const PRMonogramLogo: React.FC<PRMonogramLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
  variant = 'light',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  const isDark = variant === 'dark';

  return (
    <div className={`flex flex-col items-center text-center group select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* Official Sunset Peach/Orange Circular Monogram Emblem */}
        <div className={`relative ${iconDimensions} rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-orange-500 to-orange-600 shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all duration-200 shrink-0`}>
          <img
            src="/pr-logo.jpg"
            alt="P&R Thrift and Style Logo"
            className="w-full h-full rounded-full object-cover"
          />
          {/* Pulsating Amber Status Dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
        </div>

        {/* Wordmark Header */}
        <span className={`font-heading font-extrabold tracking-tight ${textSize} ${
          isDark ? 'text-white group-hover:text-amber-400' : 'text-zinc-950 group-hover:text-orange-600'
        } transition-colors`}>
          P&amp;R
        </span>
      </div>

      {/* Crisp Official Subtitle */}
      {showSubtitle && (
        <span className={`tracking-[0.2em] text-[10px] font-mono font-bold uppercase mt-0.5 ${
          isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-900'
        } transition-colors`}>
          THRIFT &amp; STYLE
        </span>
      )}
    </div>
  );
};
