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
    primary: 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:via-orange-400 hover:to-orange-500 text-white font-bold shadow-md shadow-orange-500/20 active:scale-[0.98]',
    secondary: 'bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-800 shadow-sm',
    outline: 'border border-zinc-200 hover:border-orange-500 bg-white text-zinc-800 hover:text-orange-600 hover:bg-orange-50/50 shadow-sm',
    ghost: 'bg-transparent hover:bg-orange-50/70 text-zinc-600 hover:text-orange-600',
    danger: 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white',
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
