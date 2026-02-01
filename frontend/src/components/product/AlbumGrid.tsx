import React from 'react';
import type { Album } from '@/api/types';
import { AlbumCard } from './AlbumCard';

interface AlbumGridProps {
  albums: Album[];
  isLoading?: boolean;
}

export function AlbumGrid({ albums, isLoading = false }: AlbumGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <AlbumCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No albums found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.uuid} album={album} />
      ))}
    </div>
  );
}

function AlbumCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Format badge */}
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />

        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

        {/* Artist */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Price */}
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />

        {/* Button */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
