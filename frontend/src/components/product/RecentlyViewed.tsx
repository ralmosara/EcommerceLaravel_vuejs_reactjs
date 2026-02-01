import React from 'react';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Clock, ChevronRight } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { albumsApi } from '@/api/endpoints/albums';
import { queryKeys } from '@/utils/queryKeys';
import { formatPrice } from '@/utils/formatters';
import type { Album } from '@/api/types';

interface RecentlyViewedProps {
  excludeSlug?: string;
  maxItems?: number;
}

export function RecentlyViewed({ excludeSlug, maxItems = 6 }: RecentlyViewedProps) {
  const { slugs, hasItems } = useRecentlyViewed();

  // Filter out the excluded slug and limit items
  const filteredSlugs = slugs
    .filter(slug => slug !== excludeSlug)
    .slice(0, maxItems);

  // Fetch album data for each slug
  const albumQueries = useQueries({
    queries: filteredSlugs.map(slug => ({
      queryKey: queryKeys.albums.detail(slug),
      queryFn: () => albumsApi.getAlbum(slug),
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    })),
  });

  // Get successfully loaded albums
  const albums = albumQueries
    .filter(query => query.isSuccess && query.data)
    .map(query => query.data as Album);

  const isLoading = albumQueries.some(query => query.isLoading);

  // Don't render if no items or still loading initial data
  if (!hasItems || (isLoading && albums.length === 0)) {
    return null;
  }

  // Don't render if no albums loaded after filtering
  if (albums.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recently Viewed
          </h2>
        </div>
        <Link
          to="/albums"
          className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          View All Albums
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {albums.map((album) => (
          <RecentlyViewedCard key={album.uuid} album={album} />
        ))}
      </div>
    </section>
  );
}

function RecentlyViewedCard({ album }: { album: Album }) {
  return (
    <Link
      to={`/albums/${album.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Album Cover */}
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {album.cover_image ? (
          <img
            src={album.cover_image}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
            </svg>
          </div>
        )}
      </div>

      {/* Album Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {album.title}
        </h3>
        {album.artist && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
            {album.artist.name}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
          {album.is_on_sale ? (
            <span className="text-red-600 dark:text-red-400">
              {formatPrice(album.sale_price!)}
            </span>
          ) : (
            formatPrice(album.price)
          )}
        </p>
      </div>
    </Link>
  );
}
