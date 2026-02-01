import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Music, ArrowLeft, ExternalLink } from 'lucide-react';
import { artistsApi } from '@/api/endpoints/artists';
import { albumsApi } from '@/api/endpoints/albums';
import { AlbumCard } from '@/components/product/AlbumCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { queryKeys } from '@/utils/queryKeys';

export function ArtistPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: artist, isLoading: isLoadingArtist, error: artistError } = useQuery({
    queryKey: queryKeys.artists.detail(slug!),
    queryFn: () => artistsApi.getArtist(slug!),
    enabled: !!slug,
  });

  const { data: albumsData, isLoading: isLoadingAlbums } = useQuery({
    queryKey: queryKeys.albums.list({ artist: slug }),
    queryFn: () => albumsApi.getAlbums({ artist: slug }),
    enabled: !!slug,
  });

  if (isLoadingArtist) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (artistError || !artist) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <User className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Artist Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The artist you're looking for doesn't exist.
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
              {artist.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Artist Header */}
      <div className="bg-gradient-to-b from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link
            to="/albums"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Albums
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Artist Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden bg-white/10 shadow-2xl">
                {artist.image_url ? (
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-24 w-24 md:h-32 md:w-32 text-white/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-white/80">Artist</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {artist.name}
              </h1>

              {artist.bio && (
                <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
                  {artist.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Music className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{totalAlbums}</span>
                  <span className="ml-1">album{totalAlbums !== 1 ? 's' : ''}</span>
                </div>

                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Albums Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Albums by {artist.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalAlbums} album{totalAlbums !== 1 ? 's' : ''} available
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
              This artist doesn't have any albums available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
