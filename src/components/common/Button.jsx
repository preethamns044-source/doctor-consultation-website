import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none tracking-tight';

  const variants = {
    primary: 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs hover:shadow-md hover:shadow-teal-900/10 focus:ring-teal-700 active:translate-y-0.5',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus:ring-slate-800 active:translate-y-0.5',
    outline: 'border border-slate-300 hover:border-slate-400 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-400 active:translate-y-0.5',
    tealOutline: 'border border-teal-700/80 text-teal-800 bg-teal-50/40 hover:bg-teal-50 focus:ring-teal-700 active:translate-y-0.5',
    subtle: 'bg-teal-50 text-teal-800 hover:bg-teal-100 focus:ring-teal-600',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-400',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-600',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-sm sm:text-base gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
