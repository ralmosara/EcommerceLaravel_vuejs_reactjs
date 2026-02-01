<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'format' => $this->format->value,
            'format_label' => $this->format->label(),
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'effective_price' => $this->getEffectivePrice(),
            'is_on_sale' => $this->isOnSale(),
            'description' => $this->description,
            'release_year' => $this->release_year,
            'label' => $this->label,
            'catalog_number' => $this->catalog_number,
            'cover_image' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'avg_rating' => $this->avg_rating,
            'reviews_count' => $this->reviews_count,
            'is_featured' => $this->is_featured,
            'artist' => new ArtistResource($this->whenLoaded('artist')),
            'genres' => GenreResource::collection($this->whenLoaded('genres')),
            'tracks' => TrackResource::collection($this->whenLoaded('tracks')),
            'inventory' => $this->whenLoaded('inventory', function () {
                return [
                    'sku' => $this->inventory->sku,
                    'quantity' => $this->inventory->quantity,
                    'reserved_quantity' => $this->inventory->reserved_quantity,
                    'available_quantity' => $this->inventory->getAvailableQuantity(),
                    'low_stock_threshold' => $this->inventory->low_stock_threshold,
                    'is_in_stock' => $this->inventory->quantity > 0,
                    'is_low_stock' => $this->inventory->quantity > 0 && $this->inventory->quantity <= $this->inventory->low_stock_threshold,
                ];
            }),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
