import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAlbums } from '@/hooks/api/useAlbums';
import { useAllGenres } from '@/hooks/api/useGenres';
import { AlbumCard } from '@/components/product/AlbumCard';
import { AlbumCardSkeleton } from '@/components/skeleton';
import { AlbumFilters, type FilterState } from '@/components/product/AlbumFilters';
import { AlbumFormat } from '@/api/types';

export function AlbumsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  // Fetch genres for filter sidebar
  const { data: genresData } = useAllGenres();
  const genres = genresData?.data ?? [];

  // Parse URL params into FilterState for the filter component
  const filterState: FilterState = useMemo(() => {
    const formatParam = searchParams.get('format');
    const genreParam = searchParams.get('genre');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sortBy = searchParams.get('sort_by') as FilterState['sortBy'] | null;
    const sortOrder = searchParams.get('sort_order') as 'asc' | 'desc' | null;

    return {
      formats: formatParam ? [formatParam as AlbumFormat] : [],
      genres: genreParam ? [genreParam] : [],
      priceRange: [
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 100,
      ] as [number, number],
      sortBy: sortBy || 'title',
      sortOrder: sortOrder || 'asc',
    };
  }, [searchParams]);

  // Build API filter params from URL
  const apiFilters = useMemo(() => ({
    format: (searchParams.get('format') as AlbumFormat) || undefined,
    genre: searchParams.get('genre') || undefined,
    sort_by: (searchParams.get('sort_by') as 'price' | 'release_year' | 'rating' | 'title') || 'title',
    sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'asc',
    on_sale: searchParams.get('on_sale') === 'true' ? true : undefined,
    search: searchParams.get('search') || undefined,
  }), [searchParams]);

  const { data: albums, isLoading, error, refetch } = useAlbums({
    ...apiFilters,
    page,
    per_page: 24,
  });

  // Handle filter changes from AlbumFilters component
  const handleFilterChange = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    // Format - take first if array has items
    if (newFilters.formats.length > 0) {
      params.set('format', newFilters.formats[0]);
    }

    // Genre - take first if array has items
    if (newFilters.genres.length > 0) {
      params.set('genre', newFilters.genres[0]);
    }

    // Sort
    if (newFilters.sortBy !== 'title') {
      params.set('sort_by', newFilters.sortBy);
    }
    if (newFilters.sortOrder !== 'asc') {
      params.set('sort_order', newFilters.sortOrder);
    }

    // Preserve other params
    if (searchParams.get('on_sale') === 'true') {
      params.set('on_sale', 'true');
    }
    if (searchParams.get('search')) {
      params.set('search', searchParams.get('search')!);
    }

    // Reset to first page on filter change
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-punk-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            ALL ALBUMS
          </h1>
          <div className="w-20 h-1 bg-punk-orange" />
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Filter Component */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <AlbumFilters
              filters={filterState}
              onFilterChange={handleFilterChange}
              genres={genres}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Results header */}
            {!isLoading && !error && albums && (
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400">
                  Showing {albums.from ?? 0}-{albums.to ?? 0} of {albums.total} albums
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <AlbumCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 bg-punk-gray">
                <p className="text-red-400 mb-4">
                  Failed to load albums. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-punk-orange text-white font-bold uppercase tracking-wider hover:bg-punk-coral transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && albums?.data.length === 0 && (
              <div className="text-center py-12 bg-punk-gray">
                <p className="text-gray-400 text-lg mb-4">
                  No albums found. Try adjusting your filters.
                </p>
              </div>
            )}

            {/* Album Grid */}
            {!isLoading && !error && albums && albums.data.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.data.map((album) => (
                    <AlbumCard key={album.uuid} album={album} />
                  ))}
                </div>

                {/* Pagination */}
                {albums.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="p-2 border border-punk-gray text-gray-400 hover:border-punk-orange hover:text-punk-orange disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, albums.last_page) }, (_, i) => {
                        let pageNum;
                        if (albums.last_page <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= albums.last_page - 2) {
                          pageNum = albums.last_page - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 font-bold transition-colors ${
                              page === pageNum
                                ? 'bg-punk-orange text-white'
                                : 'border border-punk-gray text-gray-400 hover:border-punk-orange hover:text-punk-orange'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= albums.last_page}
                      className="p-2 border border-punk-gray text-gray-400 hover:border-punk-orange hover:text-punk-orange disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
