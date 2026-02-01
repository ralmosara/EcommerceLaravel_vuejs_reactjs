<?php

namespace Database\Factories;

use App\Models\Album;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(0, 100);

        return [
            'album_id' => Album::factory(),
            'sku' => strtoupper(fake()->bothify('???-??-####')),
            'quantity' => $quantity,
            'reserved_quantity' => 0,
            'low_stock_threshold' => 5,
        ];
    }
}
