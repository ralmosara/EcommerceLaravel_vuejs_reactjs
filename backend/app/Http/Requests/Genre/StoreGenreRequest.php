<?php

namespace App\Http\Requests\Genre;

use App\Http\Requests\BaseRequest;

class StoreGenreRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:genres,name'],
            'parent_id' => ['nullable', 'exists:genres,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
