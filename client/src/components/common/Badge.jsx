import React from 'react';

const Badge = ({ value, type = 'neutral', className = '' }) => {
  // Auto-determine type from numeric value if not explicitly set
  const determineType = () => {
    if (type !== 'neutral') return type;
    if (typeof value === 'number') {
      return value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
    }
    return 'neutral';
  };

  const finalType = determineType();

  const typeClasses = {
    positive: 'bg-[#00c853]/20 text-[#00c853] border-[#00c853]/30',
    negative: 'bg-[#ef5350]/20 text-[#ef5350] border-[#ef5350]/30',
    neutral: 'bg-[#1e3a1e] text-[#81c784] border-[#1e3a1e]'
  };

  const formatValue = () => {
    if (typeof value === 'number') {
      const prefix = value > 0 ? '+' : '';
      return `${prefix}${value}%`;
    }
    return value;
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeClasses[finalType]} ${className}`}>
      {typeof value === 'number' && value !== 0 && (
        <span className="mr-1">
          {value > 0 ? '↑' : '↓'}
        </span>
      )}
      {formatValue()}
    </span>
  );
};

export default Badge;
