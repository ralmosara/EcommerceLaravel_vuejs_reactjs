<?php

namespace App\Services;

use App\Repositories\Contracts\AlbumRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class AlbumService
{
    public function __construct(
        protected AlbumRepositoryInterface $albumRepository,
        protected ImageService $imageService
    ) {}

    public function getAllAlbums(int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getAlbumBySlug(string $slug): ?Model
    {
        return $this->albumRepository
            ->with(['artist', 'genres', 'tracks', 'inventory'])
            ->findBySlug($slug);
    }

    public function getFeaturedAlbums(int $limit = 10): Collection
    {
        return $this->albumRepository->getFeatured($limit);
    }

    public function getOnSaleAlbums(int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository->getOnSale($perPage);
    }

    public function getNewReleases(int $limit = 10): Collection
    {
        return $this->albumRepository->getNewReleases($limit);
    }

    public function searchAlbums(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository->search($query, $perPage);
    }

    public function getAlbumsByArtist(int $artistId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository->getByArtist($artistId, $perPage);
    }

    public function getAlbumsByGenre(int $genreId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository->getByGenre($genreId, $perPage);
    }

    public function getAlbumsByFormat(string $format, int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository->getByFormat($format, $perPage);
    }

    public function getAdminAlbums(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->albumRepository->getWithFilters($filters, $perPage);
    }

    public function createAlbum(array $data): Model
    {
        // Handle cover image upload if provided
        if (isset($data['cover_image']) && $data['cover_image'] instanceof UploadedFile) {
            $data['cover_image'] = $this->imageService->store($data['cover_image'], 'albums');
        }

        $album = $this->albumRepository->create($data);

        if (isset($data['genres'])) {
            $album->genres()->sync($data['genres']);
        }

        return $album->load(['artist', 'genres']);
    }

    public function updateAlbum(int $id, array $data): Model
    {
        // Get the existing album to access old cover image
        $album = $this->albumRepository->find($id);

        // Handle cover image upload if provided
        if (isset($data['cover_image']) && $data['cover_image'] instanceof UploadedFile) {
            $data['cover_image'] = $this->imageService->store(
                $data['cover_image'],
                'albums',
                $album->cover_image
            );
        }

        $album = $this->albumRepository->update($id, $data);

        if (isset($data['genres'])) {
            $album->genres()->sync($data['genres']);
        }

        return $album->load(['artist', 'genres']);
    }

    public function deleteAlbum(int $id): bool
    {
        return $this->albumRepository->delete($id);
    }

    /**
     * Upload cover image for an album
     */
    public function uploadCoverImage(int $albumId, UploadedFile $file): string
    {
        $album = $this->albumRepository->find($albumId);

        $coverImagePath = $this->imageService->store($file, 'albums', $album->cover_image);

        $this->albumRepository->update($albumId, ['cover_image' => $coverImagePath]);

        return $coverImagePath;
    }

    /**
     * Delete cover image for an album
     */
    public function deleteCoverImage(int $albumId): bool
    {
        $album = $this->albumRepository->find($albumId);

        if ($album->cover_image) {
            $this->imageService->delete($album->cover_image);
            $this->albumRepository->update($albumId, ['cover_image' => null]);
            return true;
        }

        return false;
    }

    /**
     * Bulk update albums
     */
    public function bulkUpdate(array $albumIds, array $data): array
    {
        $updatedCount = 0;
        $failedCount = 0;

        DB::beginTransaction();

        try {
            foreach ($albumIds as $albumId) {
                try {
                    $this->albumRepository->update($albumId, $data);
                    $updatedCount++;
                } catch (\Exception $e) {
                    $failedCount++;
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'updated_count' => $updatedCount,
            'failed_count' => $failedCount,
        ];
    }

    /**
     * Bulk delete albums
     */
    public function bulkDelete(array $albumIds): array
    {
        $deletedCount = 0;

        DB::beginTransaction();

        try {
            foreach ($albumIds as $albumId) {
                $this->albumRepository->delete($albumId);
                $deletedCount++;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'deleted_count' => $deletedCount,
        ];
    }

    /**
     * Bulk toggle featured status
     */
    public function bulkToggleFeatured(array $albumIds, bool $isFeatured): array
    {
        $updatedCount = 0;

        DB::beginTransaction();

        try {
            foreach ($albumIds as $albumId) {
                $this->albumRepository->update($albumId, ['is_featured' => $isFeatured]);
                $updatedCount++;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'updated_count' => $updatedCount,
        ];
    }

    /**
     * Get album statistics
     */
    public function getStatistics(): array
    {
        $model = $this->albumRepository->getModel();

        return [
            'total_albums' => $model::count(),
            'featured_count' => $model::where('is_featured', true)->count(),
            'by_format' => [
                'vinyl' => $model::where('format', 'vinyl')->count(),
                'cd' => $model::where('format', 'cd')->count(),
                'cassette' => $model::where('format', 'cassette')->count(),
                'digital' => $model::where('format', 'digital')->count(),
            ],
            'out_of_stock' => $model::whereHas('inventory', function ($query) {
                $query->where('quantity', 0);
            })->count(),
            'on_sale' => $model::whereColumn('sale_price', '<', 'price')->count(),
        ];
    }
}
