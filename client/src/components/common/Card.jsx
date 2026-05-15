import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'normal',
  variant = 'default'
}) => {
  const baseClasses = `
    rounded-xl transition-all duration-200
    border
  `;

  const variantClasses = {
    default: `
      bg-(--bg-tertiary)
      border-(--border-subtle)
    `,
    elevated: `
      bg-linear-to-br from-(--bg-tertiary) to-(--bg-secondary)
      border-(--border-subtle)
      shadow-lg
    `,
    glass: `
      bg-(--bg-tertiary)/80
      backdrop-blur-xl
      border-(--border-subtle)
    `
  };
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };
  
  const hoverClasses = hoverable 
    ? `
      cursor-pointer 
      hover:border-(--border-hover)
      hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
      hover:-translate-y-0.5
    ` 
    : '';
    
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]}
        ${paddingClasses[padding]} 
        ${hoverClasses} 
        ${clickClasses} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
