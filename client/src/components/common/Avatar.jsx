import React, { useState } from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, name = '', size = 'md', className = '', fallbackClassName = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-2xl'
  };
  
  const getInitials = (name) => {
    if (!name) return <User className="w-1/2 h-1/2" strokeWidth={2} />;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const showFallback = !src || imageError;
  
  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        font-semibold 
        overflow-hidden
        shrink-0
        ring-2 ring-(--border-subtle)
        ${className}
      `}
    >
      {showFallback ? (
        <div className={`
          w-full h-full 
          bg-linear-to-br from-(--accent-500) to-(--accent-700) 
          text-white 
          flex items-center justify-center
          ${fallbackClassName}
        `}>
          {getInitials(name)}
        </div>
      ) : (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

export default Avatar;
