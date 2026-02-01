<?php

namespace App\Exceptions;

class CartEmptyException extends ApiException
{
    public function __construct()
    {
        parent::__construct('Cannot checkout with an empty cart', 400);
    }
}
