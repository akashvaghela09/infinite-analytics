import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  helperText,
  required = false,
  maxLength,
  className = '',
  icon: Icon
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  const baseClasses = `
    w-full bg-(--bg-secondary) 
    border rounded-lg 
    px-4 py-3 
    text-(--text-primary) 
    placeholder-(--text-muted)
    transition-all duration-200
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const stateClasses = error 
    ? 'border-(--error) focus:border-(--error) focus:ring-2 focus:ring-(--error)/20' 
    : isFocused
      ? 'border-(--accent-500) shadow-[0_0_0_3px_rgba(6,182,212,0.1)]'
      : 'border-(--border-subtle) hover:border-(--border-default)';
  
  const iconPadding = Icon ? 'pl-11' : '';
  const passwordPadding = isPassword ? 'pr-11' : '';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-(--text-secondary) mb-1.5"
        >
          {label}
          {required && <span className="text-(--error) ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)">
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            ${baseClasses} 
            ${stateClasses} 
            ${iconPadding} 
            ${passwordPadding}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary) transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-(--error)">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-(--text-muted)">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
