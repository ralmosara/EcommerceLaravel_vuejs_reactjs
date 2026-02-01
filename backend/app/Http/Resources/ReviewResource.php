<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'rating' => $this->rating,
            'title' => $this->title,
            'body' => $this->body,
            'is_verified_purchase' => $this->is_verified_purchase,
            'user' => [
                'name' => $this->user->name,
            ],
            'album' => $this->when($this->relationLoaded('album'), function () {
                return [
                    'uuid' => $this->album->uuid,
                    'slug' => $this->album->slug,
                    'title' => $this->album->title,
                    'artist_name' => $this->album->artist->name,
                ];
            }),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
