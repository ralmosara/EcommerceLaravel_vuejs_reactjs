import { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genresApi } from '@/api/endpoints/genres';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import type { Genre, GenreInput } from '@/api/types';
import toast from 'react-hot-toast';

export function AdminGenresPage() {
  const queryClient = useQueryClient();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState<GenreInput>({
    name: '',
    description: '',
    parent_id: undefined,
  });

  const { data: genres, isLoading } = useQuery({
    queryKey: ['genres', { per_page: 100 }],
    queryFn: () => genresApi.getGenres({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: GenreInput) => genresApi.createGenre(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre created successfully');
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create genre');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: GenreInput }) =>
      genresApi.updateGenre(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre updated successfully');
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update genre');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => genresApi.deleteGenre(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedGenre(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete genre');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent_id: undefined,
    });
    setSelectedGenre(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (genre: Genre) => {
    setSelectedGenre(genre);
    setFormData({
      name: genre.name,
      description: genre.description,
      parent_id: genre.parent_id,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGenre) {
      await updateMutation.mutateAsync({ slug: selectedGenre.slug, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteGenre = async () => {
    if (selectedGenre) {
      await deleteMutation.mutateAsync(selectedGenre.slug);
    }
  };

  // Organize genres hierarchically
  const parentGenres = genres?.data?.filter((g) => !g.parent_id) || [];
  const getChildren = (parentId: string) => genres?.data?.filter((g) => g.parent_id === parentId) || [];

  if (isLoading && !genres) {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Genres</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage music genres and categories</p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Genre
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Parent Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Albums
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {parentGenres.map((genre) => {
                const children = getChildren(genre.uuid);
                return (
                  <>
                    <tr key={genre.uuid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FolderTree className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {genre.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                          {genre.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" size="sm">
                          {genre.albums_count || 0}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(genre)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(genre)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                    {children.map((child) => (
                      <tr key={child.uuid} className="hover:bg-gray-50 dark:hover:bg-gray-700 bg-gray-25 dark:bg-gray-850">
                        <td className="px-6 py-4 whitespace-nowrap pl-16">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {child.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                            {child.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {genre.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" size="sm">
                            {child.albums_count || 0}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(child)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          >
                            <Edit className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(child)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {genres?.data?.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No genres found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedGenre ? 'Edit Genre' : 'Add Genre'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
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
              placeholder="Genre description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parent Genre (Optional)
            </label>
            <select
              value={formData.parent_id || ''}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || undefined })}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">No Parent (Top Level)</option>
              {genres?.data
                ?.filter((g) => !g.parent_id && (!selectedGenre || g.uuid !== selectedGenre.uuid))
                .map((genre) => (
                  <option key={genre.uuid} value={genre.uuid}>
                    {genre.name}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select a parent genre to create a sub-genre
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {selectedGenre ? 'Update' : 'Create'} Genre
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Genre"
        size="md"
      >
        {selectedGenre && (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <strong>{selectedGenre.name}</strong>?
              {selectedGenre.albums_count && selectedGenre.albums_count > 0 && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400">
                  Warning: This genre has {selectedGenre.albums_count} album
                  {selectedGenre.albums_count !== 1 ? 's' : ''}. This action cannot be undone.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteGenre}
                isLoading={deleteMutation.isPending}
              >
                Delete Genre
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
