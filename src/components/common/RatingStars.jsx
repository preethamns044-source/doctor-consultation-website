import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5.0, count, showCount = true, size = 'sm' }) {
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size] || starSizes.sm} fill-current ${
              star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-800">
        {rating.toFixed(1)}
      </span>
      {showCount && count && (
        <span className="text-xs text-slate-400 font-normal">
          ({count})
        </span>
      )}
    </div>
  );
}
