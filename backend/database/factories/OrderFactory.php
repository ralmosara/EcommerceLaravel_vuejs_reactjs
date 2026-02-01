<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 20, 200);
        $tax = $subtotal * 0.08;
        $shipping = 7.99;
        $discount = fake()->boolean(30) ? fake()->randomFloat(2, 5, 20) : 0;
        $total = $subtotal + $tax + $shipping - $discount;

        return [
            'user_id' => User::factory(),
            'status' => fake()->randomElement([
                OrderStatus::PENDING,
                OrderStatus::PROCESSING,
                OrderStatus::SHIPPED,
                OrderStatus::DELIVERED,
            ]),
            'subtotal' => $subtotal,
            'tax_amount' => $tax,
            'shipping_amount' => $shipping,
            'discount_amount' => $discount,
            'total' => $total,
            'coupon_code' => $discount > 0 ? 'TESTCOUPON' : null,
            'coupon_discount' => $discount,
            'shipping_address' => [
                'name' => fake()->name(),
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country' => fake()->country(),
            ],
            'billing_address' => [
                'name' => fake()->name(),
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country' => fake()->country(),
            ],
        ];
    }
}
