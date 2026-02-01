<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Ensure items are loaded with album relationships
        $this->load(['items.album.artist', 'items.album.genres', 'items.album.inventory', 'coupon']);

        return [
            'items' => CartItemResource::collection($this->items),
            'items_count' => $this->getTotalItems(),
            'coupon' => new CouponResource($this->whenLoaded('coupon')),
            'subtotal' => $this->getSubtotal(),
            'discount_amount' => $this->getDiscountAmount(),
            'total' => $this->getTotal(),
            'total_items' => $this->getTotalItems(),
            'is_empty' => $this->isEmpty(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
