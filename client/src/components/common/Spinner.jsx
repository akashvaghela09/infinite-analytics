import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const spinner = (
    <Loader2 
      className={`${sizeClasses[size]} text-(--accent-500) animate-spin`} 
      strokeWidth={1.5}
    />
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-(--bg-primary)/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {spinner}
            <div className="absolute inset-0 blur-xl opacity-50">
              <Loader2 
                className={`${sizeClasses[size]} text-(--accent-500) animate-spin`} 
                strokeWidth={1.5}
              />
            </div>
          </div>
          <p className="text-(--text-secondary) text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return spinner;
};

export default Spinner;
