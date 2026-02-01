<?php

namespace App\Models;

use App\Enums\AlbumFormat;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Album extends Model
{
    use HasFactory, HasUuids, SoftDeletes, HasSlug, Searchable;

    protected $fillable = [
        'artist_id',
        'title',
        'format',
        'price',
        'sale_price',
        'description',
        'release_year',
        'label',
        'catalog_number',
        'cover_image',
        'avg_rating',
        'reviews_count',
        'is_featured',
    ];

    protected $hidden = [
        'id',
        'artist_id',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'avg_rating' => 'decimal:2',
            'reviews_count' => 'integer',
            'release_year' => 'integer',
            'is_featured' => 'boolean',
            'format' => AlbumFormat::class,
        ];
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleting(function (Album $album) {
            // Delete cover image when album is deleted
            if ($album->cover_image) {
                Storage::disk('public')->delete($album->cover_image);
            }
        });
    }

    /**
     * Get the columns that should receive a unique identifier.
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['title', 'artist.name'])
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(150);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Check if album is on sale
     */
    public function isOnSale(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    /**
     * Get the effective price (sale price if available, otherwise regular price)
     */
    public function getEffectivePrice(): float
    {
        return $this->isOnSale() ? (float) $this->sale_price : (float) $this->price;
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing('artist', 'genres');

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'artist_name' => $this->artist?->name,
            'artist_origin' => $this->artist?->origin,
            'genres' => $this->genres->pluck('name')->toArray(),
            'format' => $this->format->value,
            'release_year' => $this->release_year,
            'label' => $this->label,
            'price' => $this->price,
            'is_featured' => $this->is_featured,
            'avg_rating' => $this->avg_rating,
        ];
    }

    /**
     * Relationships
     */
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'album_genre');
    }

    public function tracks()
    {
        return $this->hasMany(Track::class)->orderBy('track_number');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scopes
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOnSale($query)
    {
        return $query->whereNotNull('sale_price')->whereColumn('sale_price', '<', 'price');
    }

    public function scopeByFormat($query, string $format)
    {
        return $query->where('format', $format);
    }

    public function scopeInStock($query)
    {
        return $query->whereHas('inventory', function ($q) {
            $q->where('quantity', '>', 0);
        });
    }
}
