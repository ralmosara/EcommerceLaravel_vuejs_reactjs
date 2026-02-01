<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'album_id',
        'rating',
        'title',
        'body',
        'is_verified_purchase',
    ];

    protected $hidden = [
        'id',
        'user_id',
        'album_id',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_verified_purchase' => 'boolean',
        ];
    }

    /**
     * Boot model
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($review) {
            $review->updateAlbumRating();
        });

        static::updated(function ($review) {
            $review->updateAlbumRating();
        });

        static::deleted(function ($review) {
            $review->updateAlbumRating();
        });
    }

    /**
     * Update album's average rating
     */
    protected function updateAlbumRating(): void
    {
        $album = $this->album;

        if ($album) {
            $avgRating = $album->reviews()->avg('rating');
            $reviewsCount = $album->reviews()->count();

            $album->update([
                'avg_rating' => $avgRating ? round($avgRating, 2) : 0,
                'reviews_count' => $reviewsCount,
            ]);
        }
    }

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * Scopes
     */
    public function scopeVerifiedPurchase($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    public function scopeByRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }
}
