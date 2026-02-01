<?php

namespace App\Http\Requests\Album;

use App\Http\Requests\BaseRequest;

class BulkToggleFeaturedRequest extends BaseRequest
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
            'is_featured' => ['required', 'boolean'],
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
