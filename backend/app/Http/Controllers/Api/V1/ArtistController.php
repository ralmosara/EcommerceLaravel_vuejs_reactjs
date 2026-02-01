<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Artist\StoreArtistRequest;
use App\Http\Requests\Artist\UpdateArtistRequest;
use App\Http\Resources\ArtistResource;
use App\Services\ArtistService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected ArtistService $artistService
    ) {}

    /**
     * Display a listing of artists
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 15), 100);
        $artists = $this->artistService->getAllArtists($perPage);

        return $this->successResponse([
            'data' => ArtistResource::collection($artists->items()),
            'current_page' => $artists->currentPage(),
            'from' => $artists->firstItem(),
            'to' => $artists->lastItem(),
            'per_page' => $artists->perPage(),
            'total' => $artists->total(),
            'last_page' => $artists->lastPage(),
        ]);
    }

    /**
     * Display the specified artist
     */
    public function show(string $slug): JsonResponse
    {
        $artist = $this->artistService->getArtistBySlug($slug);

        if (!$artist) {
            return $this->notFoundResponse('Artist not found');
        }

        return $this->successResponse(
            new ArtistResource($artist)
        );
    }

    /**
     * Store a newly created artist
     */
    public function store(StoreArtistRequest $request): JsonResponse
    {
        $artist = $this->artistService->createArtist($request->validated());

        return $this->createdResponse(
            new ArtistResource($artist),
            'Artist created successfully'
        );
    }

    /**
     * Update the specified artist
     */
    public function update(UpdateArtistRequest $request, string $slug): JsonResponse
    {
        $artist = $this->artistService->getArtistBySlug($slug);

        if (!$artist) {
            return $this->notFoundResponse('Artist not found');
        }

        $updatedArtist = $this->artistService->updateArtist($artist->id, $request->validated());

        return $this->successResponse(
            new ArtistResource($updatedArtist),
            'Artist updated successfully'
        );
    }

    /**
     * Remove the specified artist
     */
    public function destroy(string $slug): JsonResponse
    {
        $artist = $this->artistService->getArtistBySlug($slug);

        if (!$artist) {
            return $this->notFoundResponse('Artist not found');
        }

        $this->artistService->deleteArtist($artist->id);

        return $this->successResponse(null, 'Artist deleted successfully');
    }
}
