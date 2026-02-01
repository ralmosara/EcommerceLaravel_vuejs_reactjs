import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  XCircle,
  ShoppingBag,
} from 'lucide-react';
import { useOrder, useCancelOrder } from '@/hooks/api/useOrders';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatPrice, formatDate, formatDateTime } from '@/utils/formatters';
import { OrderStatus, PaymentStatus } from '@/api/types';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/utils/constants';
import { toast } from 'react-hot-toast';

export function OrderDetailsPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(uuid || '');
  const cancelOrder = useCancelOrder();

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelOrder = () => {
    if (!uuid) return;

    cancelOrder.mutate(uuid, {
      onSuccess: () => {
        toast.success('Order cancelled successfully');
        setShowCancelModal(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to cancel order');
      },
    });
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.PROCESSING:
        return 'info';
      case OrderStatus.SHIPPED:
        return 'secondary';
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'secondary';
      case OrderStatus.REFUNDED:
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCEEDED:
        return 'success';
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return 'warning';
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
        return 'danger';
      case PaymentStatus.REFUNDED:
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load order details</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Link to="/orders">
              <Button variant="outline">Back to Orders</Button>
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
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center text-punk-orange hover:text-punk-coral mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-400 mt-2">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(order.status)} size="md">
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
              {order.can_be_cancelled && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowCancelModal(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-punk-gray border border-punk-black p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-punk-black"
                  >
                    <div className="w-20 h-20 bg-punk-dark overflow-hidden flex-shrink-0">
                      {item.album_snapshot.cover_image ? (
                        <img
                          src={item.album_snapshot.cover_image}
                          alt={item.album_snapshot.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white mb-1">
                        {item.album_snapshot.title}
                      </p>
                      <p className="text-sm text-gray-400 mb-1">
                        {item.album_snapshot.artist}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.album_snapshot.format}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-400 mb-1">
                        {formatPrice(item.unit_price)} each
                      </p>
                      <p className="font-semibold text-white">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-6 border-t border-punk-black space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                    <span>-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_amount)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax_amount)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-punk-black">
                  <span>Total</span>
                  <span className="text-punk-orange">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-punk-gray border border-punk-black p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </h2>
              <div className="text-gray-400">
                <p className="font-medium text-white">
                  {order.shipping_address.full_name}
                </p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                <p className="mt-2">{order.shipping_address.phone}</p>
              </div>
            </div>

            {/* Billing Address */}
            {order.billing_address && (
              <div className="bg-punk-gray border border-punk-black p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Billing Address
                </h2>
                <div className="text-gray-400">
                  <p className="font-medium text-white">
                    {order.billing_address.full_name}
                  </p>
                  <p>{order.billing_address.address_line1}</p>
                  {order.billing_address.address_line2 && (
                    <p>{order.billing_address.address_line2}</p>
                  )}
                  <p>
                    {order.billing_address.city}, {order.billing_address.state}{' '}
                    {order.billing_address.postal_code}
                  </p>
                  <p>{order.billing_address.country}</p>
                  <p className="mt-2">{order.billing_address.phone}</p>
                </div>
              </div>
            )}

            {/* Customer Notes */}
            {order.customer_notes && (
              <div className="bg-punk-gray border border-punk-black p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Order Notes
                </h2>
                <p className="text-gray-400">{order.customer_notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Information */}
            <div className="bg-punk-gray border border-punk-black p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment
              </h2>
              {order.payment ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <Badge variant={getPaymentStatusVariant(order.payment.status)}>
                      {PAYMENT_STATUS_LABELS[order.payment.status]}
                    </Badge>
                  </div>
                  {order.payment.card_brand && order.payment.card_last4 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Payment Method
                      </p>
                      <p className="text-white">
                        {order.payment.card_brand} ending in {order.payment.card_last4}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Amount</p>
                    <p className="text-lg font-bold text-white">
                      {formatPrice(order.payment.amount)}
                    </p>
                  </div>
                  {order.payment.paid_at && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Paid On</p>
                      <p className="text-white">
                        {formatDateTime(order.payment.paid_at)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No payment information</p>
              )}
            </div>

            {/* Shipping Information */}
            {(order.tracking_number || order.shipped_at || order.delivered_at) && (
              <div className="bg-punk-gray border border-punk-black p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping
                </h2>
                <div className="space-y-3">
                  {order.tracking_number && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Tracking Number
                      </p>
                      <p className="text-white font-mono">
                        {order.tracking_number}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" fullWidth>
                        Track Package
                      </Button>
                    </div>
                  )}
                  {order.shipped_at && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Shipped On</p>
                      <p className="text-white">
                        {formatDateTime(order.shipped_at)}
                      </p>
                    </div>
                  )}
                  {order.delivered_at && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Delivered On
                      </p>
                      <p className="text-white">
                        {formatDateTime(order.delivered_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-punk-gray border border-punk-black p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-punk-orange rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      Order Placed
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>
                </div>
                {order.shipped_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-punk-orange rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Shipped
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(order.shipped_at)}
                      </p>
                    </div>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Delivered
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(order.delivered_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelOrder.isPending}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelOrder}
              isLoading={cancelOrder.isPending}
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
