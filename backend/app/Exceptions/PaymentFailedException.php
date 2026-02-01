<?php

namespace App\Exceptions;

class PaymentFailedException extends ApiException
{
    public function __construct(string $message = 'Payment processing failed')
    {
        parent::__construct($message, 402);
    }
}
