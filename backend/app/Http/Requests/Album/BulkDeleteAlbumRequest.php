<?php

namespace App\Http\Requests\Album;

use App\Http\Requests\BaseRequest;

class BulkDeleteAlbumRequest extends BaseRequest
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
        ];
    }

    public function messages(): array
    {
        return [
            'album_ids.max' => 'You can delete a maximum of 100 albums at once.',
            'album_ids.*.exists' => 'One or more album IDs are invalid.',
        ];
    }
}
