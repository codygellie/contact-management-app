import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-3 flex items-center gap-x-2">
          {Icon && <Icon className="w-4 h-4 text-accent-green" />}
          <span>{label}</span>
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon className="w-5 h-5 text-text-muted" />
          </div>
        )}
        <input
          {...props}
          className={`input ${Icon ? 'pl-12' : ''} ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-500' : ''}`}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-left font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input; 