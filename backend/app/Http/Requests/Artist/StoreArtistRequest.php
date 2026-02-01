<?php

namespace App\Http\Requests\Artist;

use App\Http\Requests\BaseRequest;

class StoreArtistRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Prepare the data for validation by sanitizing input
     */
    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        if ($this->has('links')) {
            $this->merge([
                'links' => collect($this->links)->map(function ($url) {
                    return filter_var($url, FILTER_SANITIZE_URL);
                })->toArray(),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:artists,name'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'formed_year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            'origin' => ['nullable', 'string', 'max:100'],
            'links' => ['nullable', 'array'],
            'links.*' => ['url'],
        ];
    }
}
