<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
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
     * Display a listing of albums
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 15), 100);
        $albums = $this->albumService->getAllAlbums($perPage);

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
     * Get featured albums
     */
    public function featured(): JsonResponse
    {
        $albums = $this->albumService->getFeaturedAlbums();

        return $this->successResponse(
            AlbumResource::collection($albums)
        );
    }

    /**
     * Get albums on sale
     */
    public function onSale(Request $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 15), 100);
        $albums = $this->albumService->getOnSaleAlbums($perPage);

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
     * Get new releases
     */
    public function newReleases(): JsonResponse
    {
        $albums = $this->albumService->getNewReleases();

        return $this->successResponse(
            AlbumResource::collection($albums)
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
}
