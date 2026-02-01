<?php

namespace App\Services;

use App\Models\Album;
use App\Models\Review;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReviewService
{
    /**
     * Get reviews for an album
     */
    public function getAlbumReviews(int $albumId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::where('album_id', $albumId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get user's reviews
     */
    public function getUserReviews(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::where('user_id', $userId)
            ->with('album.artist')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Create review
     */
    public function createReview(User $user, Album $album, array $data): Review
    {
        // Check if user has already reviewed this album
        $existingReview = Review::where('user_id', $user->id)
            ->where('album_id', $album->id)
            ->first();

        if ($existingReview) {
            throw new \Exception('You have already reviewed this album.');
        }

        // Check if this is a verified purchase
        $isVerifiedPurchase = $user->orders()
            ->whereHas('items', function ($query) use ($album) {
                $query->where('album_id', $album->id);
            })
            ->where('status', '!=', 'cancelled')
            ->exists();

        return Review::create([
            'user_id' => $user->id,
            'album_id' => $album->id,
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'body' => $data['body'] ?? null,
            'is_verified_purchase' => $isVerifiedPurchase,
        ]);
    }

    /**
     * Update review
     */
    public function updateReview(Review $review, array $data): Review
    {
        $review->update([
            'rating' => $data['rating'] ?? $review->rating,
            'title' => $data['title'] ?? $review->title,
            'body' => $data['body'] ?? $review->body,
        ]);

        return $review->fresh();
    }

    /**
     * Delete review
     */
    public function deleteReview(Review $review): bool
    {
        return $review->delete();
    }

    /**
     * Get user's review for an album
     */
    public function getUserAlbumReview(int $userId, int $albumId): ?Review
    {
        return Review::where('user_id', $userId)
            ->where('album_id', $albumId)
            ->first();
    }
}
