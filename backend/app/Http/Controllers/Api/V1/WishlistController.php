<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use App\Services\WishlistService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected WishlistService $wishlistService
    ) {}

    /**
     * Get user's wishlist
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $wishlistItems = $user->wishlistItems()
            ->withPivot('id')
            ->with(['artist', 'genres', 'inventory'])
            ->get()
            ->map(function ($album) use ($user) {
                return [
                    'id' => $album->pivot->id ?? $album->id,
                    'user_id' => $user->uuid,
                    'album_id' => $album->uuid,
                    'album' => new AlbumResource($album),
                    'created_at' => $album->pivot->created_at?->toIso8601String(),
                ];
            });

        return $this->successResponse($wishlistItems);
    }

    /**
     * Add album to wishlist
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'album_slug' => ['required', 'string', 'exists:albums,slug'],
        ]);

        $album = Album::where('slug', $request->input('album_slug'))->firstOrFail();

        try {
            $this->wishlistService->addToWishlist($request->user(), $album);

            return $this->successResponse(
                ['total_items' => $this->wishlistService->getWishlistCount($request->user())],
                'Album added to wishlist'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Remove album from wishlist
     */
    public function destroy(Request $request, string $albumSlug): JsonResponse
    {
        $album = Album::where('slug', $albumSlug)->firstOrFail();

        $this->wishlistService->removeFromWishlist($request->user(), $album);

        return $this->successResponse(
            ['total_items' => $this->wishlistService->getWishlistCount($request->user())],
            'Album removed from wishlist'
        );
    }

    /**
     * Clear wishlist
     */
    public function clear(Request $request): JsonResponse
    {
        $this->wishlistService->clearWishlist($request->user());

        return $this->successResponse(
            ['total_items' => 0],
            'Wishlist cleared'
        );
    }

    /**
     * Check if album is in wishlist
     */
    public function check(Request $request, string $albumSlug): JsonResponse
    {
        $album = Album::where('slug', $albumSlug)->firstOrFail();

        $isInWishlist = $this->wishlistService->isInWishlist($request->user(), $album->id);

        return $this->successResponse([
            'in_wishlist' => $isInWishlist,
        ]);
    }
}
