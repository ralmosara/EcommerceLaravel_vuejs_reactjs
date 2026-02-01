<?php

namespace App\Http\Requests;

use App\Traits\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;

abstract class BaseRequest extends FormRequest
{
    use SanitizesInput;

    /**
     * Fields that should be excluded from sanitization
     */
    protected array $excludeFromSanitization = ['password', 'password_confirmation'];

    /**
     * Prepare the data for validation by sanitizing input
     */
    protected function prepareForValidation(): void
    {
        $this->merge($this->sanitizeInput($this->all()));
    }
}
