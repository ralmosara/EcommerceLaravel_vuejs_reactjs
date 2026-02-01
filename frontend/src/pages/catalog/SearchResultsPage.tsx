import { useSearchParams, Link } from 'react-router-dom';
import { Search, Music, User, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchApi } from '@/api/endpoints/search';
import type { SearchResults } from '@/api/endpoints/search';
import { AlbumCard } from '@/components/product/AlbumCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'albums' | 'artists'>('all');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchApi.search(query);
        setResults(data);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Search className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Search for Albums and Artists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search query to find your favorite music
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Search Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const totalResults = results.albums.length + results.artists.length;
  const albumsCount = results.albums.length;
  const artistsCount = results.artists.length;

  const filteredAlbums = activeTab === 'artists' ? [] : results.albums;
  const filteredArtists = activeTab === 'albums' ? [] : results.artists;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="max-w-2xl mx-auto text-center py-16">
          <Search className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Results Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find anything matching "{query}". Try searching with different keywords.
          </p>
          <Link
            to="/albums"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Albums
          </Link>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-primary-600 text-primary-600 dark:text-primary-500'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                All Results ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab('albums')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'albums'
                    ? 'border-primary-600 text-primary-600 dark:text-primary-500'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Music className="h-4 w-4 mr-1.5" />
                Albums ({albumsCount})
              </button>
              <button
                onClick={() => setActiveTab('artists')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'artists'
                    ? 'border-primary-600 text-primary-600 dark:text-primary-500'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <User className="h-4 w-4 mr-1.5" />
                Artists ({artistsCount})
              </button>
            </nav>
          </div>

          {/* Albums Section */}
          {filteredAlbums.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Music className="h-6 w-6 mr-2" />
                Albums ({albumsCount})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}

          {/* Artists Section */}
          {filteredArtists.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="h-6 w-6 mr-2" />
                Artists ({artistsCount})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artists/${artist.slug}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {artist.image_url ? (
                          <img
                            src={artist.image_url}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors truncate">
                          {artist.name}
                        </h3>
                        {artist.albums_count !== undefined && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {artist.albums_count} album{artist.albums_count !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
