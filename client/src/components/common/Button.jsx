import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  fullWidth = false,
  type = 'button',
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg 
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--bg-primary)
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;
  
  const variantClasses = {
    primary: `
      bg-linear-to-r from-(--accent-500) to-(--accent-600)
      text-white
      shadow-[0_0_20px_rgba(6,182,212,0.3)]
      hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]
      hover:from-(--accent-400) hover:to-(--accent-500)
      focus:ring-(--accent-500)
    `,
    secondary: `
      bg-(--bg-tertiary)
      border border-(--border-default)
      text-(--text-secondary)
      hover:bg-(--bg-elevated)
      hover:border-(--border-hover)
      hover:text-(--text-primary)
      focus:ring-(--border-default)
    `,
    ghost: `
      bg-transparent
      text-(--text-secondary)
      hover:bg-(--bg-elevated)
      hover:text-(--text-primary)
      focus:ring-(--bg-elevated)
    `,
    danger: `
      bg-(--error)
      text-white
      hover:bg-(--error-dark)
      shadow-[0_0_20px_rgba(239,68,68,0.3)]
      hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]
      focus:ring-(--error)
    `,
    outline: `
      bg-transparent
      border border-(--accent-500)
      text-(--accent-400)
      hover:bg-(--accent-500)/10
      focus:ring-(--accent-500)
    `
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${widthClass} 
        ${className}
      `}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && LeftIcon && (
        <LeftIcon className="w-4 h-4" strokeWidth={2} />
      )}
      {children}
      {!loading && RightIcon && (
        <RightIcon className="w-4 h-4" strokeWidth={2} />
      )}
    </button>
  );
};

export default Button;
