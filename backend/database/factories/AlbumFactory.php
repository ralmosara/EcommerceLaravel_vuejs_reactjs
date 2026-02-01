<?php

namespace Database\Factories;

use App\Enums\AlbumFormat;
use App\Models\Artist;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlbumFactory extends Factory
{
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 10, 50);

        return [
            'artist_id' => Artist::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'format' => fake()->randomElement([
                AlbumFormat::VINYL,
                AlbumFormat::CD,
                AlbumFormat::CASSETTE,
                AlbumFormat::DIGITAL,
            ]),
            'price' => $price,
            'sale_price' => fake()->boolean(30) ? $price * 0.8 : null,
            'release_year' => fake()->numberBetween(1970, 2024),
            'label' => fake()->company() . ' Records',
            'catalog_number' => strtoupper(fake()->bothify('???-####')),
            'cover_image' => fake()->imageUrl(500, 500, 'album'),
            'is_featured' => fake()->boolean(20),
        ];
    }
}
