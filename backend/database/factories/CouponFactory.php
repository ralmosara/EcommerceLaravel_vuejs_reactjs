<?php

namespace Database\Factories;

use App\Enums\CouponType;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement([CouponType::PERCENTAGE, CouponType::FIXED]);

        return [
            'code' => strtoupper(fake()->bothify('???###')),
            'description' => fake()->sentence(),
            'type' => $type,
            'value' => $type === CouponType::PERCENTAGE
                ? fake()->numberBetween(5, 50)
                : fake()->randomFloat(2, 5, 25),
            'min_order_amount' => fake()->boolean(50) ? fake()->randomFloat(2, 20, 100) : null,
            'max_discount_amount' => $type === CouponType::PERCENTAGE
                ? fake()->randomFloat(2, 10, 50)
                : null,
            'usage_limit' => fake()->boolean(70) ? fake()->numberBetween(10, 1000) : null,
            'times_used' => 0,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(3),
        ];
    }
}
