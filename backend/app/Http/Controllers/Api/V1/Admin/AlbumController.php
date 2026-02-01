<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Album\AdminIndexAlbumRequest;
use App\Http\Requests\Album\BulkDeleteAlbumRequest;
use App\Http\Requests\Album\BulkToggleFeaturedRequest;
use App\Http\Requests\Album\BulkUpdateAlbumRequest;
use App\Http\Requests\Album\StoreAlbumRequest;
use App\Http\Requests\Album\UpdateAlbumRequest;
use App\Http\Resources\AlbumResource;
use App\Services\AlbumService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected AlbumService $albumService
    ) {}

    /**
     * Display a listing of albums with admin filters
     */
    public function index(AdminIndexAlbumRequest $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 15), 100);
        $filters = $request->validated();

        $albums = $this->albumService->getAdminAlbums($filters, $perPage);

        return $this->successResponse([
            'data' => AlbumResource::collection($albums->items()),
            'current_page' => $albums->currentPage(),
            'from' => $albums->firstItem(),
            'to' => $albums->lastItem(),
            'per_page' => $albums->perPage(),
            'total' => $albums->total(),
            'last_page' => $albums->lastPage(),
        ]);
    }

    /**
     * Display the specified album
     */
    public function show(string $slug): JsonResponse
    {
        $album = $this->albumService->getAlbumBySlug($slug);

        if (!$album) {
            return $this->notFoundResponse('Album not found');
        }

        return $this->successResponse(
            new AlbumResource($album)
        );
    }

    /**
     * Store a newly created album
     */
    public function store(StoreAlbumRequest $request): JsonResponse
    {
        $album = $this->albumService->createAlbum($request->validated());

        return $this->createdResponse(
            new AlbumResource($album),
            'Album created successfully'
        );
    }

    /**
     * Update the specified album
     */
    public function update(UpdateAlbumRequest $request, string $slug): JsonResponse
    {
        $album = $this->albumService->getAlbumBySlug($slug);

        if (!$album) {
            return $this->notFoundResponse('Album not found');
        }

        $updatedAlbum = $this->albumService->updateAlbum($album->id, $request->validated());

        return $this->successResponse(
            new AlbumResource($updatedAlbum),
            'Album updated successfully'
        );
    }

    /**
     * Remove the specified album
     */
    public function destroy(string $slug): JsonResponse
    {
        $album = $this->albumService->getAlbumBySlug($slug);

        if (!$album) {
            return $this->notFoundResponse('Album not found');
        }

        $this->albumService->deleteAlbum($album->id);

        return $this->successResponse(null, 'Album deleted successfully');
    }

    /**
     * Upload album cover image
     */
    public function uploadCover(Request $request, string $slug): JsonResponse
    {
        $request->validate([
            'cover_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $album = $this->albumService->getAlbumBySlug($slug);

        if (!$album) {
            return $this->notFoundResponse('Album not found');
        }

        $coverImagePath = $this->albumService->uploadCoverImage($album->id, $request->file('cover_image'));

        return $this->successResponse([
            'cover_image' => asset('storage/' . $coverImagePath),
        ], 'Cover image uploaded successfully');
    }

    /**
     * Delete album cover image
     */
    public function deleteCover(string $slug): JsonResponse
    {
        $album = $this->albumService->getAlbumBySlug($slug);

        if (!$album) {
            return $this->notFoundResponse('Album not found');
        }

        $this->albumService->deleteCoverImage($album->id);

        return $this->successResponse(null, 'Cover image deleted successfully');
    }

    /**
     * Bulk update albums
     */
    public function bulkUpdate(BulkUpdateAlbumRequest $request): JsonResponse
    {
        $result = $this->albumService->bulkUpdate(
            $request->input('album_ids'),
            $request->input('data')
        );

        return $this->successResponse([
            'updated_count' => $result['updated_count'],
            'failed_count' => $result['failed_count'],
        ], "{$result['updated_count']} albums updated successfully");
    }

    /**
     * Bulk delete albums
     */
    public function bulkDelete(BulkDeleteAlbumRequest $request): JsonResponse
    {
        $result = $this->albumService->bulkDelete($request->input('album_ids'));

        return $this->successResponse([
            'deleted_count' => $result['deleted_count'],
        ], "{$result['deleted_count']} albums deleted successfully");
    }

    /**
     * Bulk toggle featured status
     */
    public function bulkToggleFeatured(BulkToggleFeaturedRequest $request): JsonResponse
    {
        $result = $this->albumService->bulkToggleFeatured(
            $request->input('album_ids'),
            $request->boolean('is_featured')
        );

        return $this->successResponse([
            'updated_count' => $result['updated_count'],
        ], "{$result['updated_count']} albums featured status updated successfully");
    }

    /**
     * Get album statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->albumService->getStatistics();

        return $this->successResponse($stats);
    }
}
