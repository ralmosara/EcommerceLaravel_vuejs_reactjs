<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GenreFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word() . ' Punk',
            'description' => fake()->sentence(),
            'parent_id' => null,
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }
}
