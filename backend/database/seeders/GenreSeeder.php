<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        // Root genres
        $punk = Genre::create(['name' => 'Punk Rock', 'sort_order' => 1]);
        $hardcore = Genre::create(['name' => 'Hardcore', 'sort_order' => 2]);
        $alternative = Genre::create(['name' => 'Alternative', 'sort_order' => 3]);

        // Punk subgenres
        Genre::create(['name' => 'Classic Punk', 'parent_id' => $punk->id, 'sort_order' => 1]);
        Genre::create(['name' => 'Pop Punk', 'parent_id' => $punk->id, 'sort_order' => 2]);
        Genre::create(['name' => 'Ska Punk', 'parent_id' => $punk->id, 'sort_order' => 3]);
        Genre::create(['name' => 'Post-Punk', 'parent_id' => $punk->id, 'sort_order' => 4]);
        Genre::create(['name' => 'Anarcho-Punk', 'parent_id' => $punk->id, 'sort_order' => 5]);

        // Hardcore subgenres
        Genre::create(['name' => 'Straight Edge', 'parent_id' => $hardcore->id, 'sort_order' => 1]);
        Genre::create(['name' => 'Melodic Hardcore', 'parent_id' => $hardcore->id, 'sort_order' => 2]);
        Genre::create(['name' => 'Metalcore', 'parent_id' => $hardcore->id, 'sort_order' => 3]);

        // Alternative subgenres
        Genre::create(['name' => 'Grunge', 'parent_id' => $alternative->id, 'sort_order' => 1]);
        Genre::create(['name' => 'Indie Rock', 'parent_id' => $alternative->id, 'sort_order' => 2]);
    }
}
