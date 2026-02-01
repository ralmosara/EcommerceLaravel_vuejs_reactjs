import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowLeft } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveFromCart, useApplyCoupon } from '@/hooks/api/useCart';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { CartItemSkeletonList } from '@/components/skeleton';
import { Modal } from '@/components/common/Modal';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const applyCoupon = useApplyCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [removeItemId, setRemoveItemId] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Debounced quantity update
  const debouncedUpdate = useCallback(
    debounce((albumId: string, quantity: number) => {
      if (quantity === 0) {
        setRemoveItemId(albumId);
        setShowRemoveModal(true);
        return;
      }

      updateCartItem.mutate(
        { albumId, data: { quantity } },
        {
          onError: (error: any) => {
            toast.error(error.message || 'Failed to update cart');
          },
        }
      );
    }, 500),
    []
  );

  const handleQuantityChange = (albumId: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(0, Math.min(99, currentQuantity + delta));
    debouncedUpdate(albumId, newQuantity);
  };

  const handleRemoveItem = () => {
    if (!removeItemId) return;

    removeFromCart.mutate(removeItemId, {
      onSuccess: () => {
        toast.success('Item removed from cart');
        setShowRemoveModal(false);
        setRemoveItemId(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to remove item');
      },
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    applyCoupon.mutate(
      { code: couponCode },
      {
        onSuccess: () => {
          toast.success('Coupon applied successfully');
          setCouponCode('');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Invalid coupon code');
        },
        onSettled: () => {
          setIsApplyingCoupon(false);
        },
      }
    );
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-punk-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-4 bg-punk-gray rounded w-32 mb-4 animate-pulse" />
            <div className="h-8 bg-punk-gray rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-punk-gray rounded w-20 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemSkeletonList count={3} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-punk-gray border border-punk-black p-6 animate-pulse">
                <div className="h-6 bg-punk-black rounded w-32 mb-6" />
                <div className="space-y-4">
                  <div className="h-10 bg-punk-black rounded" />
                  <div className="h-4 bg-punk-black rounded w-24" />
                  <div className="h-4 bg-punk-black rounded w-32" />
                  <div className="h-8 bg-punk-black rounded w-40 mt-4" />
                  <div className="h-12 bg-punk-black rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load cart</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-punk-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-punk-gray border border-punk-black p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-punk-black p-6">
                <ShoppingBag className="h-16 w-16 text-gray-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Start shopping and add some albums to your cart
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
        <div className="mb-8">
          <Link
            to="/albums"
            className="inline-flex items-center text-punk-orange hover:text-punk-coral mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Shopping Cart</h1>
          <p className="text-gray-400 mt-2">
            {cart.items_count} {cart.items_count === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-punk-gray border border-punk-black overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Album Cover */}
                    <Link
                      to={`/albums/${item.album.slug}`}
                      className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32"
                    >
                      <div className="aspect-square w-full h-full bg-punk-black overflow-hidden">
                        {item.album.cover_image ? (
                          <img
                            src={item.album.cover_image}
                            alt={item.album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <ShoppingBag className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 mr-4">
                          <Link
                            to={`/albums/${item.album.slug}`}
                            className="text-lg font-semibold text-white hover:text-punk-orange block truncate transition-colors"
                          >
                            {item.album.title}
                          </Link>
                          <Link
                            to={`/artists/${item.album.artist.slug}`}
                            className="text-sm text-gray-400 hover:text-punk-orange block truncate transition-colors"
                          >
                            {item.album.artist.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => {
                            setRemoveItemId(item.album_id);
                            setShowRemoveModal(true);
                          }}
                          className="text-red-400 hover:text-red-300 p-2 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mb-3">
                        <Badge variant="primary" size="sm">
                          {item.album.format_label}
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Quantity:</span>
                          <div className="flex items-center border border-punk-black">
                            <button
                              onClick={() => handleQuantityChange(item.album_id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                              className="p-2 text-gray-400 hover:text-white hover:bg-punk-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.album_id, item.quantity, 1)}
                              disabled={item.quantity >= 99}
                              className="p-2 text-gray-400 hover:text-white hover:bg-punk-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {formatPrice(item.unit_price)} each
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-punk-gray border border-punk-black p-6 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={!!cart.coupon}
                    className="flex-1 px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors disabled:opacity-50"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    isLoading={isApplyingCoupon}
                    disabled={!!cart.coupon || !couponCode.trim()}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {cart.coupon && (
                  <p className="mt-2 text-sm text-green-400">
                    Coupon "{cart.coupon.code}" applied
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-punk-black">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(cart.subtotal)}</span>
                </div>

                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discount_amount)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-white uppercase">Total</span>
                <span className="text-2xl font-bold text-punk-orange">
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleProceedToCheckout}
                variant="primary"
                size="lg"
                fullWidth
                className="mb-3"
              >
                Proceed to Checkout
              </Button>

              <Link to="/albums" className="block">
                <Button variant="outline" size="md" fullWidth>
                  Continue Shopping
                </Button>
              </Link>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-punk-black">
                <p className="text-xs text-gray-500 text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        title="Remove Item"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to remove this item from your cart?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowRemoveModal(false)}
              disabled={removeFromCart.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveItem}
              isLoading={removeFromCart.isPending}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
