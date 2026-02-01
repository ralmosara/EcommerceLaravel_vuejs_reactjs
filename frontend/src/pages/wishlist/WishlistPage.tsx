import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '@/hooks/api/useWishlist';
import { useAddToCart } from '@/hooks/api/useCart';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

export function WishlistPage() {
  const { data: wishlist, isLoading, error } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const clearWishlist = useClearWishlist();
  const addToCart = useAddToCart();

  const [showClearModal, setShowClearModal] = useState(false);

  const handleRemove = (albumSlug: string) => {
    removeFromWishlist.mutate(albumSlug, {
      onSuccess: () => {
        toast.success('Removed from wishlist');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to remove from wishlist');
      },
    });
  };

  const handleClearWishlist = () => {
    clearWishlist.mutate(undefined, {
      onSuccess: () => {
        toast.success('Wishlist cleared');
        setShowClearModal(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to clear wishlist');
      },
    });
  };

  const handleAddToCart = (albumId: string, albumTitle: string) => {
    addToCart.mutate(
      { album_id: albumId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`Added "${albumTitle}" to cart`);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to add to cart');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load wishlist</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const isEmpty = !wishlist || wishlist.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-punk-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-punk-gray border border-punk-black p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-punk-black p-6">
                <Heart className="h-16 w-16 text-gray-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Save your favorite albums to your wishlist
            </p>
            <Link to="/albums">
              <Button variant="primary" size="lg">
                Browse Albums
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-punk-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-wider">My Wishlist</h1>
            <p className="text-gray-400 mt-2">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {wishlist.length > 0 && (
            <Button variant="outline" onClick={() => setShowClearModal(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Wishlist
            </Button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group bg-punk-gray border border-punk-black overflow-hidden hover:border-punk-orange transition-all duration-300"
            >
              {/* Album Cover */}
              <Link to={`/albums/${item.album.slug}`} className="block relative">
                <div className="aspect-square bg-punk-black overflow-hidden">
                  {item.album.cover_image ? (
                    <img
                      src={item.album.cover_image}
                      alt={item.album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <Heart className="h-20 w-20" />
                    </div>
                  )}
                </div>

                {/* Sale Badge */}
                {item.album.is_on_sale && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-punk-orange text-white text-xs font-bold uppercase">Sale</span>
                  </div>
                )}

                {/* Stock Status */}
                {!item.album.inventory?.is_in_stock && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <span className="border-2 border-punk-orange text-punk-orange px-4 py-2 font-bold uppercase">
                      Sold Out
                    </span>
                  </div>
                )}
              </Link>

              {/* Card Content */}
              <div className="p-4">
                {/* Format Badge */}
                <div className="mb-2">
                  <Badge variant="primary" size="sm">
                    {item.album.format_label}
                  </Badge>
                </div>

                {/* Album Title */}
                <Link
                  to={`/albums/${item.album.slug}`}
                  className="block mb-1 text-lg font-semibold text-white hover:text-punk-orange line-clamp-2 transition-colors"
                >
                  {item.album.title}
                </Link>

                {/* Artist Name */}
                <Link
                  to={`/artists/${item.album.artist.slug}`}
                  className="block mb-3 text-sm text-gray-400 hover:text-punk-orange line-clamp-1 transition-colors"
                >
                  {item.album.artist.name}
                </Link>

                {/* Price */}
                <div className="mb-4">
                  {item.album.is_on_sale ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-punk-orange">
                        {formatPrice(item.album.sale_price!)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.album.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {formatPrice(item.album.price)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {item.album.inventory?.is_in_stock ? (
                    <Button
                      onClick={() => handleAddToCart(item.album.uuid, item.album.title)}
                      variant="primary"
                      size="sm"
                      fullWidth
                      isLoading={addToCart.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" fullWidth disabled>
                      Out of Stock
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRemove(item.album.slug)}
                    variant="outline"
                    size="sm"
                    fullWidth
                    isLoading={removeFromWishlist.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Wishlist Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Wishlist"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to clear your entire wishlist? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowClearModal(false)}
              disabled={clearWishlist.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearWishlist}
              isLoading={clearWishlist.isPending}
            >
              Clear Wishlist
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
