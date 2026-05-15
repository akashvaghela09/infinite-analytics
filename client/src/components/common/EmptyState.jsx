import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel = 'Get Started'
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      {icon && (
        <div className="w-16 h-16 mb-4 rounded-full bg-[#1e3a1e] flex items-center justify-center">
          {typeof icon === 'string' ? (
            <span className="text-3xl">{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold text-[#e8f5e9] mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-[#81c784] max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
