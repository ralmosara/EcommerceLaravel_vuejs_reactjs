import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { useOrders } from '@/hooks/api/useOrders';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { formatPrice, formatDate } from '@/utils/formatters';
import { OrderStatus } from '@/api/types';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

export function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = {
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    page: currentPage,
    per_page: 10,
  };

  const { data: ordersData, isLoading, error } = useOrders(filters);

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
          <p className="text-red-400 mb-4">Failed to load orders</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const isEmpty = !ordersData || ordersData.data.length === 0;

  if (isEmpty && selectedStatus === 'all') {
    return (
      <div className="min-h-screen bg-punk-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-punk-gray border border-punk-black p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-punk-black p-6">
                <Package className="h-16 w-16 text-gray-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">
              No orders yet
            </h2>
            <p className="text-gray-400 mb-6">
              Start shopping and place your first order
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
          <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">My Orders</h1>
          <p className="text-gray-400">
            View and track your order history
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedStatus('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 font-medium uppercase tracking-wider transition-colors ${
              selectedStatus === 'all'
                ? 'bg-punk-orange text-white'
                : 'bg-punk-gray text-gray-300 hover:bg-punk-black hover:text-punk-orange border border-punk-black'
            }`}
          >
            All Orders
          </button>
          {Object.values(OrderStatus).map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 font-medium uppercase tracking-wider transition-colors ${
                selectedStatus === status
                  ? 'bg-punk-orange text-white'
                  : 'bg-punk-gray text-gray-300 hover:bg-punk-black hover:text-punk-orange border border-punk-black'
              }`}
            >
              {ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isEmpty ? (
          <div className="bg-punk-gray border border-punk-black p-12 text-center">
            <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              No orders found with status: {ORDER_STATUS_LABELS[selectedStatus as OrderStatus]}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersData.data.map((order) => (
              <Link
                key={order.uuid}
                to={`/orders/${order.uuid}`}
                className="block bg-punk-gray border border-punk-black hover:border-punk-orange transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          Order #{order.order_number}
                        </h3>
                        <Badge variant={getStatusVariant(order.status)}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                        <div>
                          <span className="font-medium text-gray-300">Date:</span> {formatDate(order.created_at)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Items:</span> {order.items.length}{' '}
                          {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Total:</span>{' '}
                          <span className="text-lg font-bold text-punk-orange">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                        {order.tracking_number && (
                          <div>
                            <span className="font-medium text-gray-300">Tracking:</span> {order.tracking_number}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={item.id}
                            className="w-12 h-12 bg-punk-black border-2 border-punk-gray overflow-hidden"
                            style={{ zIndex: 3 - index }}
                          >
                            {item.album_snapshot.cover_image ? (
                              <img
                                src={item.album_snapshot.cover_image}
                                alt={item.album_snapshot.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <ShoppingBag className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 bg-punk-black border-2 border-punk-gray flex items-center justify-center text-xs font-medium text-gray-400">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-punk-orange" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isEmpty && ordersData && ordersData.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: ordersData.last_page }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and pages around current
                const showPage =
                  page === 1 ||
                  page === ordersData.last_page ||
                  Math.abs(page - currentPage) <= 1;

                if (!showPage) {
                  if (page === 2 || page === ordersData.last_page - 1) {
                    return <span key={page} className="px-2 text-gray-500">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-punk-orange text-white'
                        : 'bg-punk-gray text-gray-300 hover:bg-punk-black hover:text-punk-orange border border-punk-black'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(ordersData.last_page, p + 1))}
              disabled={currentPage === ordersData.last_page}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
