<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackResource extends JsonResource
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
            'title' => $this->title,
            'track_number' => $this->track_number,
            'duration_seconds' => $this->duration_seconds,
            'duration_formatted' => $this->duration_seconds ? gmdate('i:s', $this->duration_seconds) : null,
            'lyrics' => $this->when($request->input('include_lyrics'), $this->lyrics),
        ];
    }
}
