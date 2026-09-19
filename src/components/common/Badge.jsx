import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = ''
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-tight';

  const variants = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/90',
    teal: 'bg-teal-50/80 text-teal-800 border border-teal-200/80',
    gold: 'bg-amber-50/80 text-amber-900 border border-amber-200/80',
    info: 'bg-sky-50 text-sky-800 border border-sky-200/80',
    neutral: 'bg-slate-100/90 text-slate-700 border border-slate-200',
    dark: 'bg-slate-900 text-white border border-slate-800',
  };

  const sizes = {
    xs: 'px-2.5 py-0.5 text-[11px] gap-1',
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}>
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="pulse-emerald absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {children}
    </span>
  );
}
