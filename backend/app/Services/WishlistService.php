<?php

namespace App\Services;

use App\Models\Album;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WishlistService
{
    /**
     * Get user's wishlist
     */
    public function getUserWishlist(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $user->wishlistItems()
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    /**
     * Add album to wishlist
     */
    public function addToWishlist(User $user, Album $album): bool
    {
        // Check if already in wishlist
        if ($user->wishlistItems()->where('album_id', $album->id)->exists()) {
            throw new \Exception('Album is already in your wishlist.');
        }

        $user->wishlistItems()->attach($album->id);
        return true;
    }

    /**
     * Remove album from wishlist
     */
    public function removeFromWishlist(User $user, Album $album): bool
    {
        $user->wishlistItems()->detach($album->id);
        return true;
    }

    /**
     * Check if album is in user's wishlist
     */
    public function isInWishlist(User $user, int $albumId): bool
    {
        return $user->wishlistItems()->where('album_id', $albumId)->exists();
    }

    /**
     * Clear wishlist
     */
    public function clearWishlist(User $user): bool
    {
        $user->wishlistItems()->detach();
        return true;
    }

    /**
     * Get wishlist count
     */
    public function getWishlistCount(User $user): int
    {
        return $user->wishlistItems()->count();
    }
}
