import React from 'react';

export function AlbumDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            {i < 3 && <span className="text-gray-300 dark:text-gray-600">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Album Cover */}
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>

          {/* Badges */}
          <div className="flex items-center space-x-3">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Price */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />

          {/* Stock Status */}
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Track List Skeleton */}
      <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
