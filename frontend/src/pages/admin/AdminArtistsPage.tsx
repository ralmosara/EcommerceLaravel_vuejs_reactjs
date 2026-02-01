import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artistsApi } from '@/api/endpoints/artists';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import type { Artist, ArtistInput } from '@/api/types';
import toast from 'react-hot-toast';

export function AdminArtistsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState<ArtistInput>({
    name: '',
    bio: '',
    origin: '',
    formed_year: undefined,
    image: '',
  });

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;

  const { data: artists, isLoading } = useQuery({
    queryKey: ['artists', { page, search, per_page: 20 }],
    queryFn: () => artistsApi.getArtists({ page, search, per_page: 20 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: ArtistInput) => artistsApi.createArtist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist created successfully');
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create artist');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ArtistInput }) =>
      artistsApi.updateArtist(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist updated successfully');
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update artist');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => artistsApi.deleteArtist(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedArtist(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete artist');
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      origin: '',
      formed_year: undefined,
      image: '',
    });
    setSelectedArtist(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (artist: Artist) => {
    setSelectedArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio,
      origin: artist.origin,
      formed_year: artist.formed_year,
      image: artist.image,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArtist) {
      await updateMutation.mutateAsync({ slug: selectedArtist.slug, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteArtist = async () => {
    if (selectedArtist) {
      await deleteMutation.mutateAsync(selectedArtist.slug);
    }
  };

  if (isLoading && !artists) {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Artists</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage music artists</p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Artist
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <Input
          placeholder="Search artists..."
          value={search || ''}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artists?.data.map((artist) => (
          <div
            key={artist.uuid}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {artist.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {artist.name}
              </h3>
              {artist.origin && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {artist.origin}
                  {artist.formed_year && ` • ${artist.formed_year}`}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {artist.albums_count || 0} album{artist.albums_count !== 1 ? 's' : ''}
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditModal(artist)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(artist)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {artists?.data.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No artists found</p>
        </div>
      )}

      {artists && artists.last_page > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {artists.from} to {artists.to} of {artists.total} results
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
              disabled={page === artists.last_page}
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
        title={selectedArtist ? 'Edit Artist' : 'Add Artist'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Origin (Optional)"
            value={formData.origin || ''}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            placeholder="e.g., Liverpool, England"
          />

          <Input
            type="number"
            label="Formed Year (Optional)"
            value={formData.formed_year || ''}
            onChange={(e) => setFormData({ ...formData, formed_year: e.target.value ? Number(e.target.value) : undefined })}
            min="1900"
            max={new Date().getFullYear()}
          />

          <Input
            label="Image URL (Optional)"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio (Optional)
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Artist biography..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {selectedArtist ? 'Update' : 'Create'} Artist
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Artist"
        size="md"
      >
        {selectedArtist && (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <strong>{selectedArtist.name}</strong>?
              {selectedArtist.albums_count && selectedArtist.albums_count > 0 && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400">
                  Warning: This artist has {selectedArtist.albums_count} album
                  {selectedArtist.albums_count !== 1 ? 's' : ''}. This action cannot be undone.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteArtist}
                isLoading={deleteMutation.isPending}
              >
                Delete Artist
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
