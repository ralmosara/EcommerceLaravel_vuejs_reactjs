import React from 'react';

export function AlbumCardSkeleton() {
  return (
    <div className="bg-punk-gray overflow-hidden animate-pulse">
      {/* Cover Image */}
      <div className="aspect-square bg-punk-black" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-punk-black w-3/4" />

        {/* Artist */}
        <div className="h-4 bg-punk-black w-1/2" />

        {/* Price */}
        <div className="h-6 bg-punk-black w-1/3" />

        {/* Add to Cart Button */}
        <div className="h-10 bg-punk-black" />
      </div>
    </div>
  );
}

interface AlbumCardSkeletonGridProps {
  count?: number;
}

export function AlbumCardSkeletonGrid({ count = 8 }: AlbumCardSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </div>
  );
}
