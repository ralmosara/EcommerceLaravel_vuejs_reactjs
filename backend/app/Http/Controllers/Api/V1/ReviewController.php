<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Album;
use App\Services\ReviewService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected ReviewService $reviewService
    ) {}

    /**
     * Get reviews for an album
     */
    public function index(Request $request, string $albumSlug): JsonResponse
    {
        $album = Album::where('slug', $albumSlug)->firstOrFail();
        $perPage = min($request->input('per_page', 15), 100);

        $reviews = $this->reviewService->getAlbumReviews($album->id, $perPage);

        return $this->successResponse([
            'data' => ReviewResource::collection($reviews->items()),
            'current_page' => $reviews->currentPage(),
            'from' => $reviews->firstItem(),
            'to' => $reviews->lastItem(),
            'per_page' => $reviews->perPage(),
            'total' => $reviews->total(),
            'last_page' => $reviews->lastPage(),
        ]);
    }

    /**
     * Get user's reviews
     */
    public function myReviews(Request $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 15), 100);
        $reviews = $this->reviewService->getUserReviews($request->user()->id, $perPage);

        return $this->successResponse([
            'data' => ReviewResource::collection($reviews->items()),
            'current_page' => $reviews->currentPage(),
            'from' => $reviews->firstItem(),
            'to' => $reviews->lastItem(),
            'per_page' => $reviews->perPage(),
            'total' => $reviews->total(),
            'last_page' => $reviews->lastPage(),
        ]);
    }

    /**
     * Create a review
     */
    public function store(StoreReviewRequest $request, string $albumSlug): JsonResponse
    {
        $validated = $request->validated();

        $album = Album::where('slug', $albumSlug)->firstOrFail();

        try {
            $review = $this->reviewService->createReview(
                $request->user(),
                $album,
                $validated
            );

            return $this->createdResponse(
                new ReviewResource($review),
                'Review created successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Update a review
     */
    public function update(UpdateReviewRequest $request, string $albumSlug): JsonResponse
    {
        $validated = $request->validated();

        $album = Album::where('slug', $albumSlug)->firstOrFail();
        $review = $this->reviewService->getUserAlbumReview($request->user()->id, $album->id);

        if (!$review) {
            return $this->notFoundResponse('Review not found');
        }

        $updatedReview = $this->reviewService->updateReview($review, $validated);

        return $this->successResponse(
            new ReviewResource($updatedReview),
            'Review updated successfully'
        );
    }

    /**
     * Delete a review
     */
    public function destroy(Request $request, string $albumSlug): JsonResponse
    {
        $album = Album::where('slug', $albumSlug)->firstOrFail();
        $review = $this->reviewService->getUserAlbumReview($request->user()->id, $album->id);

        if (!$review) {
            return $this->notFoundResponse('Review not found');
        }

        $this->reviewService->deleteReview($review);

        return $this->successResponse(null, 'Review deleted successfully');
    }
}
