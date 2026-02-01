import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Plus, Minus, Play } from 'lucide-react';
import clsx from 'clsx';
import type { Album } from '@/api/types';
import { formatPrice } from '@/utils/formatters';
import { useAddToCart } from '@/hooks/api/useCart';
import { useToggleWishlist, useCheckInWishlist } from '@/hooks/api/useWishlist';
import toast from 'react-hot-toast';

interface AlbumCardProps {
  album: Album;
  compact?: boolean;
}

export function AlbumCard({ album, compact = false }: AlbumCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const isInStock = album.inventory?.is_in_stock ?? false;
  const isLowStock = album.inventory?.is_low_stock ?? false;

  // API hooks
  const { data: isInWishlist } = useCheckInWishlist(album.slug);
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;

    addToCart.mutate(
      { album_id: album.uuid, quantity },
      {
        onSuccess: () => {
          toast.success(`Added "${album.title}" to cart`);
          setQuantity(1);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to add to cart');
        },
      }
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist.mutate(
      { albumSlug: album.slug, isInWishlist: isInWishlist ?? false },
      {
        onSuccess: () => {
          toast.success(
            isInWishlist
              ? `Removed "${album.title}" from wishlist`
              : `Added "${album.title}" to wishlist`
          );
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update wishlist');
        },
      }
    );
  };

  // Compact version for horizontal scroll sections
  if (compact) {
    return (
      <Link
        to={`/albums/${album.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Album Cover */}
        <div className="relative aspect-square overflow-hidden bg-punk-gray mb-3">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={`${album.title} cover`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-punk-gray to-punk-black">
              <span className="text-4xl font-display font-bold text-punk-orange opacity-30">
                {album.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className={clsx(
            'absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="w-12 h-12 rounded-full bg-punk-orange flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-1" />
            </div>
          </div>

          {/* Sale Badge */}
          {album.is_on_sale && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-punk-orange text-white text-xs font-bold uppercase">
                Sale
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={toggleWishlist.isPending}
            className={clsx(
              'absolute top-2 right-2 p-1.5 bg-punk-black/80 transition-all',
              isInWishlist ? 'text-punk-orange' : 'text-white hover:text-punk-orange',
              toggleWishlist.isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Heart className={clsx('h-4 w-4', isInWishlist && 'fill-current')} />
          </button>
        </div>

        {/* Info */}
        <h3 className="font-medium text-white group-hover:text-punk-orange transition-colors line-clamp-1 text-sm">
          {album.title}
        </h3>
        <p className="text-gray-400 text-xs mb-1 line-clamp-1">
          {album.artist?.name}
        </p>
        <div className="flex items-baseline gap-2">
          {album.is_on_sale ? (
            <>
              <span className="text-punk-orange font-bold text-sm">
                {formatPrice(album.sale_price!)}
              </span>
              <span className="text-gray-500 text-xs line-through">
                {formatPrice(album.price)}
              </span>
            </>
          ) : (
            <span className="text-white font-bold text-sm">
              {formatPrice(album.price)}
            </span>
          )}
        </div>
      </Link>
    );
  }

  // Full version for grid layouts
  return (
    <div
      className="group card-punk"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Out of Stock Overlay */}
      {!isInStock && (
        <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
          <span className="px-4 py-2 bg-punk-black border-2 border-punk-orange text-punk-orange font-bold uppercase tracking-wider">
            Sold Out
          </span>
        </div>
      )}

      {/* Album Cover */}
      <Link to={`/albums/${album.slug}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-punk-gray">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={`${album.title} cover`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-punk-gray to-punk-black">
              <span className="text-6xl font-display font-bold text-punk-orange opacity-30">
                {album.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className={clsx(
          'absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}>
          {isInStock && (
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="w-full py-2 bg-punk-orange text-white font-bold uppercase tracking-wider hover:bg-punk-coral transition-colors disabled:opacity-50"
            >
              {addToCart.isPending ? 'Adding...' : 'Quick Add'}
            </button>
          )}
        </div>

        {/* Sale Badge */}
        {album.is_on_sale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 bg-punk-orange text-white text-xs font-bold uppercase tracking-wider">
              Sale
            </span>
          </div>
        )}

        {/* Format Badge */}
        <div className="absolute top-3 right-12 z-10">
          <span className="px-2 py-1 bg-punk-black/80 text-gray-300 text-xs font-medium uppercase">
            {album.format_label}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={toggleWishlist.isPending}
          className={clsx(
            'absolute top-3 right-3 z-10 p-2 bg-punk-black/80 transition-all',
            isInWishlist ? 'text-punk-orange' : 'text-white hover:text-punk-orange',
            toggleWishlist.isPending && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Heart className={clsx('h-5 w-5', isInWishlist && 'fill-current')} />
        </button>
      </Link>

      {/* Card Content */}
      <div className="p-4 bg-punk-gray">
        {/* Album Title */}
        <Link
          to={`/albums/${album.slug}`}
          className="block mb-1 font-bold text-white hover:text-punk-orange transition-colors line-clamp-1"
        >
          {album.title}
        </Link>

        {/* Artist Name */}
        {album.artist && (
          <Link
            to={`/artists/${album.artist.slug}`}
            className="block mb-3 text-sm text-gray-400 hover:text-punk-orange transition-colors line-clamp-1"
          >
            {album.artist.name}
          </Link>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-between mb-3">
          {album.is_on_sale ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-punk-orange">
                {formatPrice(album.sale_price!)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(album.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-white">
              {formatPrice(album.price)}
            </span>
          )}

          {/* Low Stock Warning */}
          {isInStock && isLowStock && (
            <span className="text-xs text-punk-orange font-medium">
              Low Stock
            </span>
          )}
        </div>

        {/* Quantity and Add to Cart */}
        {isInStock && (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-punk-black">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-2 text-gray-400 hover:text-white hover:bg-punk-black disabled:opacity-30 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-3 py-1 text-white font-medium min-w-[2.5rem] text-center text-sm">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= 99}
                className="p-2 text-gray-400 hover:text-white hover:bg-punk-black disabled:opacity-30 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="flex-1 py-2 bg-punk-orange text-white font-bold text-sm uppercase tracking-wider hover:bg-punk-coral transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {addToCart.isPending ? '...' : 'Add'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
