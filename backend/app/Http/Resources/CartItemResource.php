<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'album_id' => $this->album->uuid,
            'album' => new AlbumResource($this->album),
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'line_total' => round($this->getLineTotal(), 2),
            'subtotal' => round($this->getLineTotal(), 2),
        ];
    }
}
