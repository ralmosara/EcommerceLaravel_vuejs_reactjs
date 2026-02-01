import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tag, Music, ArrowLeft } from 'lucide-react';
import { genresApi } from '@/api/endpoints/genres';
import { albumsApi } from '@/api/endpoints/albums';
import { AlbumCard } from '@/components/product/AlbumCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { queryKeys } from '@/utils/queryKeys';

export function GenrePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: genre, isLoading: isLoadingGenre, error: genreError } = useQuery({
    queryKey: queryKeys.genres.detail(slug!),
    queryFn: () => genresApi.getGenre(slug!),
    enabled: !!slug,
  });

  const { data: albumsData, isLoading: isLoadingAlbums } = useQuery({
    queryKey: queryKeys.albums.list({ genre: slug }),
    queryFn: () => albumsApi.getAlbums({ genre: slug }),
    enabled: !!slug,
  });

  if (isLoadingGenre) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (genreError || !genre) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Tag className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Genre Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The genre you're looking for doesn't exist.
          </p>
          <Link
            to="/albums"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Albums
          </Link>
        </div>
      </div>
    );
  }

  const albums = albumsData?.data || [];
  const totalAlbums = albumsData?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/albums"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Albums
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {genre.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Genre Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link
            to="/albums"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Albums
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Tag className="h-8 w-8 mr-3" />
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                Genre
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {genre.name}
            </h1>

            {genre.description && (
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl leading-relaxed">
                {genre.description}
              </p>
            )}

            <div className="flex items-center text-white/90">
              <Music className="h-5 w-5 mr-2" />
              <span className="font-semibold">{totalAlbums}</span>
              <span className="ml-1">album{totalAlbums !== 1 ? 's' : ''} in this genre</span>
            </div>

            {/* Parent/Child Genres */}
            {(genre.parent_genre || (genre.child_genres && genre.child_genres.length > 0)) && (
              <div className="mt-8 pt-8 border-t border-white/20">
                {genre.parent_genre && (
                  <div className="mb-4">
                    <span className="text-white/70 text-sm">Parent Genre:</span>
                    <Link
                      to={`/genres/${genre.parent_genre.slug}`}
                      className="ml-2 inline-flex items-center px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                    >
                      {genre.parent_genre.name}
                    </Link>
                  </div>
                )}

                {genre.child_genres && genre.child_genres.length > 0 && (
                  <div>
                    <span className="text-white/70 text-sm block mb-2">Sub-genres:</span>
                    <div className="flex flex-wrap gap-2">
                      {genre.child_genres.map((childGenre) => (
                        <Link
                          key={childGenre.id}
                          to={`/genres/${childGenre.slug}`}
                          className="inline-flex items-center px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                        >
                          {childGenre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Albums Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {genre.name} Albums
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore {totalAlbums} album{totalAlbums !== 1 ? 's' : ''} in this genre
          </p>
        </div>

        {isLoadingAlbums ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Music className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Albums Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              There are no albums in this genre at the moment.
            </p>
            <Link
              to="/albums"
              className="inline-flex items-center px-6 py-3 mt-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Albums
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
