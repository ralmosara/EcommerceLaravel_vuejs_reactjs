<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Genre\StoreGenreRequest;
use App\Http\Requests\Genre\UpdateGenreRequest;
use App\Http\Resources\GenreResource;
use App\Services\GenreService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;

class GenreController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected GenreService $genreService
    ) {}

    /**
     * Get hierarchical genre tree
     */
    public function index(): JsonResponse
    {
        $genres = $this->genreService->getGenreTree();

        return $this->successResponse([
            'data' => GenreResource::collection($genres),
        ]);
    }

    /**
     * Display the specified genre
     */
    public function show(string $slug): JsonResponse
    {
        $genre = $this->genreService->getGenreBySlug($slug);

        if (!$genre) {
            return $this->notFoundResponse('Genre not found');
        }

        return $this->successResponse(
            new GenreResource($genre)
        );
    }

    /**
     * Store a newly created genre
     */
    public function store(StoreGenreRequest $request): JsonResponse
    {
        $genre = $this->genreService->createGenre($request->validated());

        return $this->createdResponse(
            new GenreResource($genre),
            'Genre created successfully'
        );
    }

    /**
     * Update the specified genre
     */
    public function update(UpdateGenreRequest $request, string $slug): JsonResponse
    {
        $genre = $this->genreService->getGenreBySlug($slug);

        if (!$genre) {
            return $this->notFoundResponse('Genre not found');
        }

        $updatedGenre = $this->genreService->updateGenre($genre->id, $request->validated());

        return $this->successResponse(
            new GenreResource($updatedGenre),
            'Genre updated successfully'
        );
    }

    /**
     * Remove the specified genre
     */
    public function destroy(string $slug): JsonResponse
    {
        $genre = $this->genreService->getGenreBySlug($slug);

        if (!$genre) {
            return $this->notFoundResponse('Genre not found');
        }

        $this->genreService->deleteGenre($genre->id);

        return $this->successResponse(null, 'Genre deleted successfully');
    }
}
