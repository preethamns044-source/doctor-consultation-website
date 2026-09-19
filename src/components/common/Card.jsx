import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  padding = 'default',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4 sm:p-5',
    default: 'p-6 sm:p-7',
    lg: 'p-7 sm:p-9',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] ${
        hoverEffect ? 'premium-card' : ''
      } ${paddings[padding] || paddings.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
