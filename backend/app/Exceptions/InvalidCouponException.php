<?php

namespace App\Exceptions;

class InvalidCouponException extends ApiException
{
    public function __construct(string $message = 'Invalid or expired coupon code')
    {
        parent::__construct($message, 400);
    }
}
