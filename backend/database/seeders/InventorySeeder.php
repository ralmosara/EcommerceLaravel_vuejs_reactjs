<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Inventory;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $albums = Album::all();

        foreach ($albums as $album) {
            // Generate random but realistic inventory levels
            $quantity = match ($album->format->value) {
                'vinyl' => rand(15, 50),      // Vinyl records - moderate stock
                'cd' => rand(30, 100),         // CDs - higher stock
                'cassette' => rand(10, 30),    // Cassettes - limited stock
                'digital' => 999999,           // Digital - unlimited
                default => rand(20, 60),
            };

            // Generate SKU based on artist and album
            $artistCode = strtoupper(substr(str_replace(' ', '', $album->artist->name), 0, 3));
            $formatCode = strtoupper(substr($album->format->value, 0, 2));
            $uniqueId = str_pad($album->id, 4, '0', STR_PAD_LEFT);
            $sku = "{$artistCode}-{$formatCode}-{$uniqueId}";

            Inventory::updateOrCreate(
                ['album_id' => $album->id],
                [
                    'sku' => $sku,
                    'quantity' => $quantity,
                    'reserved_quantity' => 0,
                    'low_stock_threshold' => match ($album->format->value) {
                        'vinyl' => 5,
                        'cd' => 10,
                        'cassette' => 3,
                        'digital' => 0,
                        default => 5,
                    },
                ]
            );
        }
    }
}
