import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { useAdminInventory, useUpdateStock } from '@/hooks/api/admin/useAdminInventory';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import type { Album } from '@/api/types';
import clsx from 'clsx';

export function AdminInventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);

  const page = Number(searchParams.get('page')) || 1;
  const filter = searchParams.get('filter') || '';
  const search = searchParams.get('search') || undefined;

  const { data: inventory, isLoading } = useAdminInventory({
    page,
    per_page: 20,
    low_stock: filter === 'low-stock' ? true : undefined,
    out_of_stock: filter === 'out-of-stock' ? true : undefined,
    search,
  });

  const updateStockMutation = useUpdateStock();

  const handleFilterChange = (newFilter: string) => {
    const params = new URLSearchParams(searchParams);
    if (newFilter) {
      params.set('filter', newFilter);
    } else {
      params.delete('filter');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleOpenUpdateModal = (album: Album) => {
    setSelectedAlbum(album);
    setNewQuantity(album.inventory?.quantity || 0);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedAlbum) return;

    await updateStockMutation.mutateAsync({
      albumSlug: selectedAlbum.slug,
      data: { quantity: newQuantity },
    });

    setIsUpdateModalOpen(false);
    setSelectedAlbum(null);
  };

  const getStockStatus = (album: Album) => {
    if (!album.inventory?.is_in_stock) {
      return { label: 'Out of Stock', variant: 'danger' as const };
    }
    if (album.inventory?.is_low_stock) {
      return { label: 'Low Stock', variant: 'warning' as const };
    }
    return { label: 'In Stock', variant: 'success' as const };
  };

  if (isLoading && !inventory) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filterTabs = [
    { label: 'All', value: '' },
    { label: 'Low Stock', value: 'low-stock' },
    { label: 'Out of Stock', value: 'out-of-stock' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage album stock levels
        </p>
      </div>

      <div className="flex space-x-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              filter === tab.value
                ? 'bg-punk-orange text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <input
          type="text"
          placeholder="Search albums..."
          value={search || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Album
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Reserved
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory?.data.map((album) => {
                const stockStatus = getStockStatus(album);
                return (
                  <tr key={album.uuid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {album.cover_image && (
                          <img
                            src={album.cover_image}
                            alt={album.title}
                            className="h-10 w-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {album.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {album.artist?.name || 'Unknown Artist'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {album.format_label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {album.inventory?.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {album.inventory?.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {album.inventory?.reserved_quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {album.inventory?.available_quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        'px-2 py-1 text-xs font-bold rounded-full',
                        stockStatus.variant === 'success' && 'bg-green-100 text-green-700',
                        stockStatus.variant === 'warning' && 'bg-yellow-100 text-yellow-700',
                        stockStatus.variant === 'danger' && 'bg-red-100 text-red-700'
                      )}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenUpdateModal(album)}
                      >
                        Update Stock
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {inventory?.data.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No inventory items found</p>
          </div>
        )}
      </div>

      {inventory && inventory.last_page > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing {inventory.from} to {inventory.to} of {inventory.total} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === inventory.last_page}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Stock"
        size="md"
      >
        {selectedAlbum && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {selectedAlbum.cover_image && (
                <img
                  src={selectedAlbum.cover_image}
                  alt={selectedAlbum.title}
                  className="h-16 w-16 object-cover rounded"
                />
              )}
              <div>
                <p className="text-lg font-medium text-white">
                  {selectedAlbum.title}
                </p>
                <p className="text-sm text-gray-400">
                  {selectedAlbum.artist?.name || 'Unknown Artist'} - {selectedAlbum.format_label}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-punk-black p-4">
              <div>
                <p className="text-xs text-gray-500">Current Stock</p>
                <p className="text-lg font-bold text-white">
                  {selectedAlbum.inventory?.quantity || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reserved</p>
                <p className="text-lg font-bold text-white">
                  {selectedAlbum.inventory?.reserved_quantity || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-lg font-bold text-white">
                  {selectedAlbum.inventory?.available_quantity || 0}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">New Quantity</label>
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 bg-punk-black border border-punk-gray text-white focus:outline-none focus:border-punk-orange transition-colors"
              />
            </div>

            {newQuantity < (selectedAlbum.inventory?.reserved_quantity || 0) && (
              <div className="flex items-start space-x-2 text-sm text-punk-orange bg-punk-orange/10 p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Warning: New quantity is less than reserved quantity. This may cause issues with
                  pending orders.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStock} isLoading={updateStockMutation.isPending}>
                Update Stock
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
