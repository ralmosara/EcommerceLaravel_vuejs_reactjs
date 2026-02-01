<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ArtistFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Band',
            'bio' => fake()->paragraph(),
            'formed_year' => fake()->numberBetween(1970, 2020),
            'origin' => fake()->city() . ', ' . fake()->country(),
            'links' => [fake()->url()],
        ];
    }
}
