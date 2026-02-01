<?php

namespace Database\Seeders;

use App\Enums\CouponType;
use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'PUNK10',
                'type' => CouponType::PERCENTAGE,
                'value' => 10.00,
                'description' => '10% off your order',
                'min_order_amount' => null,
                'max_discount_amount' => null,
                'usage_limit' => null,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(6),
            ],
            [
                'code' => 'PUNK20',
                'type' => CouponType::PERCENTAGE,
                'value' => 20.00,
                'description' => '20% off orders over $50',
                'min_order_amount' => 50.00,
                'max_discount_amount' => 30.00,
                'usage_limit' => 100,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(3),
            ],
            [
                'code' => 'FIRSTORDER',
                'type' => CouponType::PERCENTAGE,
                'value' => 15.00,
                'description' => '15% off your first order',
                'min_order_amount' => 25.00,
                'max_discount_amount' => 20.00,
                'usage_limit' => 500,
                'valid_from' => now(),
                'valid_until' => now()->addYear(),
            ],
            [
                'code' => 'SAVE5',
                'type' => CouponType::FIXED,
                'value' => 5.00,
                'description' => '$5 off any order',
                'min_order_amount' => 20.00,
                'max_discount_amount' => null,
                'usage_limit' => null,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(6),
            ],
            [
                'code' => 'SAVE10',
                'type' => CouponType::FIXED,
                'value' => 10.00,
                'description' => '$10 off orders over $40',
                'min_order_amount' => 40.00,
                'max_discount_amount' => null,
                'usage_limit' => 200,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(4),
            ],
            [
                'code' => 'VINYL25',
                'type' => CouponType::PERCENTAGE,
                'value' => 25.00,
                'description' => '25% off vinyl records',
                'min_order_amount' => 30.00,
                'max_discount_amount' => 40.00,
                'usage_limit' => 50,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(2),
            ],
            [
                'code' => 'FREESHIP',
                'type' => CouponType::FIXED,
                'value' => 7.99,
                'description' => 'Free standard shipping',
                'min_order_amount' => 35.00,
                'max_discount_amount' => null,
                'usage_limit' => null,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(12),
            ],
            [
                'code' => 'WELCOME30',
                'type' => CouponType::PERCENTAGE,
                'value' => 30.00,
                'description' => '30% off for new customers',
                'min_order_amount' => 50.00,
                'max_discount_amount' => 50.00,
                'usage_limit' => 1000,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(6),
            ],
            [
                'code' => 'EXPIRED',
                'type' => CouponType::PERCENTAGE,
                'value' => 50.00,
                'description' => 'Expired test coupon',
                'min_order_amount' => null,
                'max_discount_amount' => null,
                'usage_limit' => 10,
                'valid_from' => now()->subMonths(2),
                'valid_until' => now()->subDays(1),
            ],
            [
                'code' => 'FUTURE',
                'type' => CouponType::FIXED,
                'value' => 15.00,
                'description' => 'Future coupon (not yet valid)',
                'min_order_amount' => 30.00,
                'max_discount_amount' => null,
                'usage_limit' => 100,
                'valid_from' => now()->addWeek(),
                'valid_until' => now()->addMonths(3),
            ],
        ];

        foreach ($coupons as $couponData) {
            Coupon::create($couponData);
        }
    }
}
