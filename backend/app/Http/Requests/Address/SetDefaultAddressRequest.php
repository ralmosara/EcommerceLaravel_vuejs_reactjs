<?php

namespace App\Http\Requests\Address;

use App\Http\Requests\BaseRequest;

class SetDefaultAddressRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:shipping,billing'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'type.required' => 'The address type is required.',
            'type.in' => 'The address type must be either shipping or billing.',
        ];
    }
}
