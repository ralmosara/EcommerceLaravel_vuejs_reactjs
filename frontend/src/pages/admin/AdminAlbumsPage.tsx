import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Disc } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { albumsApi } from '@/api/endpoints/albums';
import { artistsApi } from '@/api/endpoints/artists';
import { genresApi } from '@/api/endpoints/genres';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import type { Album, AlbumInput } from '@/api/types';
import { AlbumFormat } from '@/api/types';
import toast from 'react-hot-toast';

export function AdminAlbumsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState<AlbumInput>({
    artist_id: '',
    title: '',
    format: AlbumFormat.VINYL,
    price: 0,
    sale_price: undefined,
    description: '',
    release_year: undefined,
    label: '',
    catalog_number: '',
    cover_image: '',
    genres: [],
    is_featured: false,
  });

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;
  const format = (searchParams.get('format') as AlbumFormat) || undefined;

  const { data: albums, isLoading } = useQuery({
    queryKey: ['albums', { page, search, format, per_page: 20 }],
    queryFn: () => albumsApi.getAlbums({ page, search, format, per_page: 20 }),
  });

  const { data: artists } = useQuery({
    queryKey: ['artists', { per_page: 100 }],
    queryFn: () => artistsApi.getArtists({ per_page: 100 }),
  });

  const { data: genres } = useQuery({
    queryKey: ['genres', { per_page: 100 }],
    queryFn: () => genresApi.getGenres({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: AlbumInput) => albumsApi.createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast.success('Album created successfully');
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create album');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: AlbumInput }) =>
      albumsApi.updateAlbum(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast.success('Album updated successfully');
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update album');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => albumsApi.deleteAlbum(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast.success('Album deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedAlbum(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete album');
    },
  });

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

  const handleFormatFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('format', value);
    } else {
      params.delete('format');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const resetForm = () => {
    setFormData({
      artist_id: '',
      title: '',
      format: AlbumFormat.VINYL,
      price: 0,
      sale_price: undefined,
      description: '',
      release_year: undefined,
      label: '',
      catalog_number: '',
      cover_image: '',
      genres: [],
      is_featured: false,
    });
    setSelectedAlbum(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (album: Album) => {
    setSelectedAlbum(album);
    setFormData({
      artist_id: album.artist?.id?.toString() || '',
      title: album.title,
      format: album.format,
      price: album.price,
      sale_price: album.sale_price,
      description: album.description,
      release_year: album.release_year,
      label: album.label,
      catalog_number: album.catalog_number,
      cover_image: album.cover_image,
      genres: album.genres.map((g) => g.id),
      is_featured: album.is_featured,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (album: Album) => {
    setSelectedAlbum(album);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlbum) {
      await updateMutation.mutateAsync({ slug: selectedAlbum.slug, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteAlbum = async () => {
    if (selectedAlbum) {
      await deleteMutation.mutateAsync(selectedAlbum.slug);
    }
  };

  if (isLoading && !albums) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Albums</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your music catalog</p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Album
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search albums..."
            value={search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select
            value={format || ''}
            onChange={(e) => handleFormatFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Formats</option>
            <option value={AlbumFormat.VINYL}>Vinyl</option>
            <option value={AlbumFormat.CD}>CD</option>
            <option value={AlbumFormat.CASSETTE}>Cassette</option>
            <option value={AlbumFormat.DIGITAL}>Digital</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums?.data?.map((album) => (
          <div
            key={album.uuid}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {album.cover_image && (
              <img
                src={album.cover_image}
                alt={album.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {album.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {album.artist?.name || 'Unknown Artist'}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" size="sm">
                  {album.format_label}
                </Badge>
                {album.is_featured && (
                  <Badge variant="primary" size="sm">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ${album.effective_price}
                  </span>
                  {album.is_on_sale && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${album.price}
                    </span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(album)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(album)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {albums?.data?.length === 0 && (
        <div className="text-center py-12">
          <Disc className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No albums found</p>
        </div>
      )}

      {albums && albums.last_page > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {albums.from} to {albums.to} of {albums.total} results
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
              disabled={page === albums.last_page}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedAlbum ? 'Edit Album' : 'Add Album'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Artist
              </label>
              <select
                value={formData.artist_id}
                onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Artist</option>
                {artists?.data?.map((artist) => (
                  <option key={artist.uuid} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format
              </label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as AlbumFormat })}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={AlbumFormat.VINYL}>Vinyl</option>
                <option value={AlbumFormat.CD}>CD</option>
                <option value={AlbumFormat.CASSETTE}>Cassette</option>
                <option value={AlbumFormat.DIGITAL}>Digital</option>
              </select>
            </div>

            <Input
              type="number"
              label="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
            />

            <Input
              type="number"
              label="Sale Price (Optional)"
              value={formData.sale_price || ''}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? Number(e.target.value) : undefined })}
              min="0"
              step="0.01"
            />

            <Input
              type="number"
              label="Release Year (Optional)"
              value={formData.release_year || ''}
              onChange={(e) => setFormData({ ...formData, release_year: e.target.value ? Number(e.target.value) : undefined })}
              min="1900"
              max={new Date().getFullYear() + 1}
            />

            <Input
              label="Label (Optional)"
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            />

            <Input
              label="Catalog Number (Optional)"
              value={formData.catalog_number || ''}
              onChange={(e) => setFormData({ ...formData, catalog_number: e.target.value })}
            />
          </div>

          <Input
            label="Cover Image URL (Optional)"
            value={formData.cover_image || ''}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genres
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {genres?.data?.map((genre) => (
                <label key={genre.uuid} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.genres?.includes(genre.id)}
                    onChange={(e) => {
                      const newGenres = e.target.checked
                        ? [...(formData.genres || []), genre.id]
                        : formData.genres?.filter((id) => id !== genre.id) || [];
                      setFormData({ ...formData, genres: newGenres });
                    }}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Album
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {selectedAlbum ? 'Update' : 'Create'} Album
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Album"
        size="md"
      >
        {selectedAlbum && (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <strong>{selectedAlbum.title}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAlbum}
                isLoading={deleteMutation.isPending}
              >
                Delete Album
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
