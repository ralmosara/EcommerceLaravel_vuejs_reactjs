<?php

namespace App\Http\Requests\Album;

use App\Enums\AlbumFormat;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateAlbumRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'artist_id' => ['sometimes', 'exists:artists,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'format' => ['sometimes', Rule::enum(AlbumFormat::class)],
            'price' => ['sometimes', 'numeric', 'min:0', 'max:9999.99'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'max:9999.99', 'lt:price'],
            'description' => ['nullable', 'string', 'max:5000'],
            'release_year' => ['nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'label' => ['nullable', 'string', 'max:100'],
            'catalog_number' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5MB max
            'genres' => ['nullable', 'array'],
            'genres.*' => ['exists:genres,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'sale_price.lt' => 'Sale price must be less than the regular price.',
        ];
    }
}
