import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} loading-spinner`}></div>
      {text && (
        <div className="text-center">
          <p className="text-text-secondary text-sm font-medium">{text}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;