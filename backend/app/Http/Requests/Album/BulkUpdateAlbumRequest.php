<?php

namespace App\Http\Requests\Album;

use App\Enums\AlbumFormat;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class BulkUpdateAlbumRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'album_ids' => ['required', 'array', 'min:1', 'max:100'],
            'album_ids.*' => ['required', 'exists:albums,id'],
            'data' => ['required', 'array'],
            'data.price' => ['sometimes', 'numeric', 'min:0', 'max:9999.99'],
            'data.sale_price' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:9999.99'],
            'data.format' => ['sometimes', Rule::enum(AlbumFormat::class)],
            'data.is_featured' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'album_ids.max' => 'You can update a maximum of 100 albums at once.',
            'album_ids.*.exists' => 'One or more album IDs are invalid.',
        ];
    }
}
