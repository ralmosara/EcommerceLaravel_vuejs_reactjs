<?php

namespace App\Exceptions;

class InsufficientStockException extends ApiException
{
    public function __construct(string $message = 'Insufficient stock', ?int $requested = null, ?int $available = null)
    {
        if ($requested !== null && $available !== null) {
            $message = "{$message}. Requested: {$requested}, Available: {$available}";
        }

        parent::__construct($message, 400);
    }
}
