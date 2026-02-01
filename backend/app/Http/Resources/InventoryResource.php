<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->album->uuid,
            'title' => $this->album->title,
            'slug' => $this->album->slug,
            'cover_image' => $this->album->cover_image,
            'format_label' => $this->album->format_label,
            'artist' => [
                'uuid' => $this->album->artist->uuid ?? null,
                'name' => $this->album->artist->name ?? 'Unknown Artist',
                'slug' => $this->album->artist->slug ?? null,
            ],
            'inventory' => [
                'sku' => $this->sku,
                'quantity' => $this->quantity,
                'reserved_quantity' => $this->reserved_quantity,
                'available_quantity' => $this->getAvailableQuantity(),
                'low_stock_threshold' => $this->low_stock_threshold,
                'is_in_stock' => $this->quantity > 0,
                'is_low_stock' => $this->quantity > 0 && $this->quantity <= $this->low_stock_threshold,
            ],
        ];
    }
}
