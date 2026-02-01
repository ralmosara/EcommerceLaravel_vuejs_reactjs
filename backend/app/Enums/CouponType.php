<?php

namespace App\Enums;

enum CouponType: string
{
    case PERCENTAGE = 'percentage';
    case FIXED = 'fixed';

    public function label(): string
    {
        return match($this) {
            self::PERCENTAGE => 'Percentage Discount',
            self::FIXED => 'Fixed Amount Discount',
        };
    }

    public function calculateDiscount(float $subtotal, float $value, ?float $maxDiscount = null): float
    {
        $discount = match($this) {
            self::PERCENTAGE => ($subtotal * $value / 100),
            self::FIXED => $value,
        };

        if ($maxDiscount && $discount > $maxDiscount) {
            return $maxDiscount;
        }

        return min($discount, $subtotal);
    }
}
