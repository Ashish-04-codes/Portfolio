/**
 * Button Component
 * Reusable button with newspaper styling
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = React.memo(({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-mono uppercase tracking-wide transition-colors border-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-ink text-newsprint border-ink hover:bg-ink/90',
    secondary: 'bg-newsprint text-ink border-ink hover:bg-surface',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
    ghost: 'bg-transparent text-ink border-transparent hover:border-ink',
    outline: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-newsprint',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

