<?php

namespace App\Traits;

trait SanitizesInput
{
    /**
     * Sanitize all input data
     */
    protected function sanitizeInput(array $data): array
    {
        return collect($data)->map(function ($value, $key) {
            return $this->sanitizeField($key, $value);
        })->all();
    }

    /**
     * Sanitize a single field
     */
    protected function sanitizeField(string $key, mixed $value): mixed
    {
        if (is_null($value)) {
            return null;
        }

        if (is_array($value)) {
            return $this->sanitizeArray($value);
        }

        if (!is_string($value)) {
            return $value;
        }

        // Fields that should NOT be sanitized
        if (in_array($key, $this->excludeFromSanitization ?? [])) {
            return trim($value);
        }

        // Strip all HTML tags and trim whitespace
        return trim(strip_tags($value));
    }

    /**
     * Sanitize an array recursively
     */
    protected function sanitizeArray(array $array): array
    {
        return collect($array)->map(function ($value, $key) {
            return $this->sanitizeField($key, $value);
        })->all();
    }
}
