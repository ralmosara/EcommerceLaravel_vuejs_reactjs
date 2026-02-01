import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import clsx from 'clsx';

interface RatingStarsProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function RatingStars({ value, onChange, size = 'md', readonly = false }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const displayRating = hoverRating || value;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly && onChange) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly && onChange) {
      setHoverRating(0);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isHalf = displayRating >= starValue - 0.5 && displayRating < starValue;
    const isFilled = displayRating >= starValue;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        className={clsx(
          'relative',
          !readonly && onChange && 'cursor-pointer hover:scale-110 transition-transform',
          readonly && 'cursor-default'
        )}
        aria-label={`Rate ${starValue} stars`}
      >
        {isHalf ? (
          <div className="relative">
            <Star className={clsx(sizeStyles[size], 'text-gray-300 dark:text-gray-600')} />
            <StarHalf
              className={clsx(
                sizeStyles[size],
                'absolute top-0 left-0 text-yellow-400 fill-yellow-400'
              )}
            />
          </div>
        ) : (
          <Star
            className={clsx(
              sizeStyles[size],
              isFilled
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${value} out of 5 stars`}>
      {[...Array(5)].map((_, index) => renderStar(index))}
    </div>
  );
}
