import React from 'react';

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg animate-pulse">
      {/* Album Cover */}
      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />

      {/* Item Details */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        {/* Artist */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        {/* Format */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Price */}
      <div className="flex flex-col items-end gap-2">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

interface CartItemSkeletonListProps {
  count?: number;
}

export function CartItemSkeletonList({ count = 3 }: CartItemSkeletonListProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}
