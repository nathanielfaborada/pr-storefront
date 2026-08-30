import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-heading font-semibold tracking-tight transition-all duration-150 ease-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-sm sm:text-base rounded-xl gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-brand-gradient text-black hover:brightness-110 active:brightness-90 shadow-amber-glow font-bold',
    secondary: 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 shadow-cyber-sm',
    outline: 'border border-zinc-800 hover:border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-900/60',
    ghost: 'bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100',
    danger: 'bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
