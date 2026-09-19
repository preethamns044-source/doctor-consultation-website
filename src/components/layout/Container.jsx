import React from 'react';

export default function Container({ children, className = '', size = 'default' }) {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-8xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizes[size] || sizes.default} ${className}`}>
      {children}
    </div>
  );
}
