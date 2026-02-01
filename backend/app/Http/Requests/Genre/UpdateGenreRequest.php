<?php

namespace App\Http\Requests\Genre;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateGenreRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $genre = $this->route('genre');

        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('genres', 'name')->ignore($genre->id ?? null),
            ],
            'parent_id' => ['nullable', 'exists:genres,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
