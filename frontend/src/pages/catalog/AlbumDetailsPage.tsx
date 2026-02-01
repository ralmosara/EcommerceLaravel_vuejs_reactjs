import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Plus, Minus, Play, Pause, SkipBack, SkipForward, Volume2, Share2, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { useAlbums } from '@/hooks/api/useAlbums';
import { useAlbumReviews } from '@/hooks/api/useReviews';
import { useAddToCart } from '@/hooks/api/useCart';
import { useToggleWishlist, useCheckInWishlist } from '@/hooks/api/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ReviewForm } from '@/components/product/ReviewForm';
import { ReviewList } from '@/components/product/ReviewList';
import { AlbumCard } from '@/components/product/AlbumCard';
import { RatingStars } from '@/components/product/RatingStars';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

// Track Listing Component
function TrackListing({ tracks, onPlayTrack, currentTrack, isPlaying }: {
  tracks: Array<{ id: number; track_number: number; title: string; duration?: string }>;
  onPlayTrack: (trackNumber: number) => void;
  currentTrack: number | null;
  isPlaying: boolean;
}) {
  return (
    <div className="bg-punk-gray">
      <div className="p-6 border-b border-punk-black">
        <h2 className="text-xl font-display font-bold text-white uppercase">
          Track Listing
        </h2>
      </div>
      <div className="divide-y divide-punk-black">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => onPlayTrack(track.track_number)}
            className={clsx(
              'w-full flex items-center gap-4 px-6 py-4 hover:bg-punk-black/50 transition-colors text-left',
              currentTrack === track.track_number && 'bg-punk-black/50'
            )}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {currentTrack === track.track_number && isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-4 bg-punk-orange animate-pulse" />
                  <span className="w-1 h-6 bg-punk-orange animate-pulse delay-75" />
                  <span className="w-1 h-3 bg-punk-orange animate-pulse delay-150" />
                </div>
              ) : (
                <span className="text-gray-500 font-medium">{track.track_number}</span>
              )}
            </div>
            <div className="flex-1">
              <span className={clsx(
                'font-medium',
                currentTrack === track.track_number ? 'text-punk-orange' : 'text-white'
              )}>
                {track.title}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              {track.duration || '3:45'}
            </span>
            <Play className={clsx(
              'h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity',
              currentTrack === track.track_number ? 'text-punk-orange' : 'text-gray-400'
            )} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Audio Player Bar Component
function AudioPlayerBar({ album, currentTrack, isPlaying, onPlayPause, onNext, onPrev }: {
  album: { title: string; artist?: { name: string }; cover_image?: string };
  currentTrack: { number: number; title: string } | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(80);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-punk-black border-t border-punk-gray z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 w-1/4">
            <div className="w-12 h-12 bg-punk-gray flex-shrink-0">
              {album.cover_image ? (
                <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-punk-orange font-bold">{album.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentTrack?.title || album.title}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {album.artist?.name}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center gap-6 mb-2">
              <button
                onClick={onPrev}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={onPlayPause}
                className="w-10 h-10 rounded-full bg-punk-orange flex items-center justify-center hover:bg-punk-coral transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white ml-0.5" />
                )}
              </button>
              <button
                onClick={onNext}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <span className="text-xs text-gray-400 w-10 text-right">1:23</span>
              <div className="flex-1 h-1 bg-punk-gray rounded-full overflow-hidden">
                <div
                  className="h-full bg-punk-orange rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-10">3:45</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-1/4 justify-end">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <div className="w-24 h-1 bg-punk-gray rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function AlbumDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-punk-dark pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-24 bg-punk-gray mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-punk-gray" />
            <div className="space-y-6">
              <div className="h-8 w-48 bg-punk-gray" />
              <div className="h-12 w-3/4 bg-punk-gray" />
              <div className="h-6 w-32 bg-punk-gray" />
              <div className="h-24 w-full bg-punk-gray" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export function AlbumDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Recently viewed tracking
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();

  // Fetch album details
  const { data: album, isLoading, error } = useAlbums({
    search: slug,
    per_page: 1,
  });

  const albumData = album?.data?.[0];

  // Track album view
  useEffect(() => {
    if (slug && albumData) {
      addToRecentlyViewed(slug);
    }
  }, [slug, albumData, addToRecentlyViewed]);

  // Fetch reviews
  const { data: reviews } = useAlbumReviews(slug!, reviewsPage);

  // Fetch related albums
  const { data: relatedAlbums } = useAlbums({
    artist: albumData?.artist?.slug,
    per_page: 7,
  });

  // Wishlist hooks
  const { data: isInWishlist } = useCheckInWishlist(slug!);
  const toggleWishlist = useToggleWishlist();

  // Cart hooks
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!albumData?.inventory?.is_in_stock) return;

    addToCart.mutate(
      { album_id: albumData.uuid, quantity },
      {
        onSuccess: () => {
          toast.success(`Added "${albumData.title}" to cart`);
          setQuantity(1);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to add to cart');
        },
      }
    );
  };

  const handleWishlistToggle = () => {
    toggleWishlist.mutate(
      { albumSlug: slug!, isInWishlist: isInWishlist ?? false },
      {
        onSuccess: () => {
          toast.success(
            isInWishlist ? 'Removed from wishlist' : 'Added to wishlist'
          );
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update wishlist');
        },
      }
    );
  };

  const handlePlayTrack = (trackNumber: number) => {
    if (currentTrack === trackNumber) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(trackNumber);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (!currentTrack && albumData?.tracks?.[0]) {
      setCurrentTrack(albumData.tracks[0].track_number);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (!albumData?.tracks) return;
    const currentIndex = albumData.tracks.findIndex(t => t.track_number === currentTrack);
    if (currentIndex < albumData.tracks.length - 1) {
      setCurrentTrack(albumData.tracks[currentIndex + 1].track_number);
    }
  };

  const handlePrev = () => {
    if (!albumData?.tracks) return;
    const currentIndex = albumData.tracks.findIndex(t => t.track_number === currentTrack);
    if (currentIndex > 0) {
      setCurrentTrack(albumData.tracks[currentIndex - 1].track_number);
    }
  };

  if (isLoading) {
    return <AlbumDetailsSkeleton />;
  }

  if (error || !albumData) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Album Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            The album you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/albums" className="btn-punk">
            Browse Albums
          </Link>
        </div>
      </div>
    );
  }

  const currentTrackData = albumData.tracks?.find(t => t.track_number === currentTrack);

  return (
    <div className="min-h-screen bg-punk-dark pb-24">
      {/* Back Navigation */}
      <div className="bg-punk-black border-b border-punk-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/albums"
            className="inline-flex items-center text-gray-400 hover:text-punk-orange transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Albums
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Album Cover with Vinyl */}
          <div className="relative">
            <div className="sticky top-24">
              {/* Vinyl Record Visual */}
              <div className="relative mx-auto" style={{ maxWidth: '500px' }}>
                {/* Vinyl Disc */}
                <div className={clsx(
                  'absolute right-0 top-1/2 -translate-y-1/2 w-[85%] aspect-square rounded-full z-0',
                  isPlaying && 'animate-spin-slow'
                )}>
                  <div className="w-full h-full vinyl-record" />
                  {/* Album cover in vinyl center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] aspect-square rounded-full overflow-hidden border-4 border-punk-black">
                    {albumData.cover_image ? (
                      <img
                        src={albumData.cover_image}
                        alt={albumData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-punk-orange flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {albumData.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Album Cover */}
                <div className="relative z-10 w-[75%] aspect-square bg-punk-gray shadow-2xl">
                  {albumData.cover_image ? (
                    <img
                      src={albumData.cover_image}
                      alt={albumData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-punk-gray to-punk-black">
                      <span className="text-8xl font-display font-bold text-punk-orange opacity-30">
                        {albumData.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Album Info */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-punk-gray text-gray-300 text-xs font-bold uppercase tracking-wider">
                {albumData.format_label}
              </span>
              {albumData.is_on_sale && (
                <span className="px-3 py-1 bg-punk-orange text-white text-xs font-bold uppercase tracking-wider">
                  On Sale
                </span>
              )}
              {albumData.release_year && (
                <span className="text-gray-400 text-sm">{albumData.release_year}</span>
              )}
            </div>

            {/* Title & Artist */}
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2">
              {albumData.title}
            </h1>
            <Link
              to={`/artists/${albumData.artist?.slug}`}
              className="text-xl text-punk-orange hover:text-punk-coral transition-colors font-medium"
            >
              {albumData.artist?.name}
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4 mb-6">
              <RatingStars value={albumData.avg_rating} readonly size="lg" />
              <span className="text-gray-400">
                {albumData.reviews_count} {albumData.reviews_count === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {albumData.is_on_sale ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-punk-orange">
                    {formatPrice(albumData.sale_price!)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(albumData.price)}
                  </span>
                  <span className="px-2 py-1 bg-punk-orange/20 text-punk-orange text-sm font-bold">
                    Save {Math.round((1 - albumData.sale_price! / albumData.price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-white">
                  {formatPrice(albumData.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {albumData.inventory?.is_in_stock ? (
                <span className="inline-flex items-center text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  In Stock
                  {albumData.inventory.is_low_stock && (
                    <span className="ml-2 text-punk-orange">
                      (Only {albumData.inventory.available_quantity} left)
                    </span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {albumData.inventory?.is_in_stock && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border-2 border-punk-gray">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-400 hover:text-white hover:bg-punk-gray transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 text-white font-bold min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="px-4 py-3 text-gray-400 hover:text-white hover:bg-punk-gray transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="flex-1 py-4 bg-punk-orange text-white font-bold uppercase tracking-wider hover:bg-punk-coral transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleWishlistToggle}
                disabled={toggleWishlist.isPending}
                className={clsx(
                  'flex-1 py-3 border-2 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2',
                  isInWishlist
                    ? 'border-punk-orange bg-punk-orange/10 text-punk-orange'
                    : 'border-punk-gray text-gray-400 hover:border-punk-orange hover:text-punk-orange'
                )}
              >
                <Heart className={clsx('h-5 w-5', isInWishlist && 'fill-current')} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
              <button className="p-3 border-2 border-punk-gray text-gray-400 hover:border-punk-orange hover:text-punk-orange transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            {albumData.description && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-2">About this album</h3>
                <p className="text-gray-400 leading-relaxed">{albumData.description}</p>
              </div>
            )}

            {/* Genres */}
            {albumData.genres && albumData.genres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {albumData.genres.map((genre) => (
                    <Link
                      key={genre.uuid}
                      to={`/genres/${genre.slug}`}
                      className="px-3 py-1 bg-punk-gray text-gray-300 hover:bg-punk-orange hover:text-white transition-colors text-sm"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-punk-gray">
              {albumData.label && (
                <div>
                  <span className="text-gray-500 text-sm">Label</span>
                  <p className="text-white font-medium">{albumData.label}</p>
                </div>
              )}
              {albumData.catalog_number && (
                <div>
                  <span className="text-gray-500 text-sm">Catalog #</span>
                  <p className="text-white font-medium">{albumData.catalog_number}</p>
                </div>
              )}
              {albumData.release_year && (
                <div>
                  <span className="text-gray-500 text-sm">Release Year</span>
                  <p className="text-white font-medium">{albumData.release_year}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500 text-sm">Format</span>
                <p className="text-white font-medium">{albumData.format_label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Track Listing */}
        {albumData.tracks && albumData.tracks.length > 0 && (
          <div className="mt-12">
            <TrackListing
              tracks={albumData.tracks}
              onPlayTrack={handlePlayTrack}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          </div>
        )}

        {/* Reviews Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white">
              Customer Reviews
            </h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-punk-outline text-sm py-2"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Rating Summary */}
          <div className="bg-punk-gray p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="text-5xl font-bold text-white">
                {Number(albumData.avg_rating || 0).toFixed(1)}
              </div>
              <div>
                <RatingStars value={Number(albumData.avg_rating || 0)} size="lg" readonly />
                <p className="text-gray-400 mt-1">
                  Based on {albumData.reviews_count} {albumData.reviews_count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {showReviewForm && (
            <div className="mb-8 bg-punk-gray p-6">
              <ReviewForm
                albumSlug={slug!}
                onSuccess={() => {
                  setShowReviewForm(false);
                  setReviewsPage(1);
                  toast.success('Review submitted successfully!');
                }}
              />
            </div>
          )}

          <ReviewList
            reviews={reviews?.data || []}
            pagination={reviews}
            onPageChange={setReviewsPage}
          />
        </section>

        {/* Related Albums */}
        {relatedAlbums && relatedAlbums.data.length > 1 && (
          <section className="mt-12">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              More from {albumData.artist?.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedAlbums.data
                .filter((a) => a.slug !== albumData.slug)
                .slice(0, 6)
                .map((relatedAlbum) => (
                  <AlbumCard key={relatedAlbum.uuid} album={relatedAlbum} compact />
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Audio Player Bar */}
      {(currentTrack || isPlaying) && (
        <AudioPlayerBar
          album={albumData}
          currentTrack={currentTrackData ? { number: currentTrackData.track_number, title: currentTrackData.title } : null}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
