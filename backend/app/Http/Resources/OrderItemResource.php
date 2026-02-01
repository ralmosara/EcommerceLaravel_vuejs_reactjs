<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'album_id' => $this->album_id,
            'album' => [
                'id' => $this->album_id,
                'title' => $this->album_title,
                'artist' => [
                    'name' => $this->artist_name,
                ],
                'format' => $this->format,
                'cover_image' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            ],
            'quantity' => $this->quantity,
            'price' => $this->unit_price,
            'unit_price' => $this->unit_price,
            'subtotal' => $this->line_total,
        ];
    }
}
