<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'title',
        'track_number',
        'duration_seconds',
        'lyrics',
    ];

    protected $hidden = [
        'id',
        'album_id',
    ];

    protected function casts(): array
    {
        return [
            'track_number' => 'integer',
            'duration_seconds' => 'integer',
        ];
    }

    /**
     * Get formatted duration (MM:SS)
     */
    public function getFormattedDurationAttribute(): ?string
    {
        if (!$this->duration_seconds) {
            return null;
        }

        return gmdate('i:s', $this->duration_seconds);
    }

    /**
     * Relationships
     */
    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
