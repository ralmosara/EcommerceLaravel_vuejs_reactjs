<?php

use App\Models\Album;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Generate slugs for albums that don't have one
        Album::whereNull('slug')->orWhere('slug', '')->each(function ($album) {
            $baseSlug = Str::slug($album->title . '-' . ($album->artist?->name ?? 'unknown'));
            $slug = $baseSlug;
            $counter = 1;

            // Ensure unique slug
            while (Album::where('slug', $slug)->where('id', '!=', $album->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $album->update(['slug' => $slug]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reversal needed
    }
};
