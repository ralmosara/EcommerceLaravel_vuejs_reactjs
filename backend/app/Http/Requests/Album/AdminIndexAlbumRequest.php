<?php

namespace App\Http\Requests\Album;

use App\Http\Requests\BaseRequest;

class AdminIndexAlbumRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'format' => ['nullable', 'in:vinyl,cd,cassette,digital'],
            'price_min' => ['nullable', 'numeric', 'min:0'],
            'price_max' => ['nullable', 'numeric', 'min:0', 'gte:price_min'],
            'is_featured' => ['nullable', 'boolean'],
            'stock_status' => ['nullable', 'in:in_stock,low_stock,out_of_stock'],
            'artist_id' => ['nullable', 'exists:artists,id'],
            'genre_id' => ['nullable', 'exists:genres,id'],
            'on_sale' => ['nullable', 'boolean'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'in:price,created_at,title,avg_rating'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'price_max.gte' => 'Maximum price must be greater than or equal to minimum price.',
        ];
    }
}
