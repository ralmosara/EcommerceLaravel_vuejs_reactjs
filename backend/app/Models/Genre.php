<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Genre extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'parent_id',
        'sort_order',
    ];

    protected $hidden = [
        'id',
    ];

    protected function casts(): array
    {
        return [
            'parent_id' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(100);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Relationships
     */
    public function parent()
    {
        return $this->belongsTo(Genre::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Genre::class, 'parent_id')->orderBy('sort_order');
    }

    public function albums()
    {
        return $this->belongsToMany(Album::class, 'album_genre');
    }

    /**
     * Scopes
     */
    public function scopeRootOnly($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
