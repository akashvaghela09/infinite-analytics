import React from 'react';
import Card from './Card';
import Badge from './Badge';

const StatCard = ({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  className = ''
}) => {
  return (
    <Card className={`${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#81c784] text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-[#e8f5e9]">{value}</p>
          {subValue && (
            <p className="text-[#4caf50] text-sm mt-1">{subValue}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-[#1e3a1e] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#00c853]" />
            </div>
          )}
          {trend !== undefined && (
            <Badge value={trend} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
