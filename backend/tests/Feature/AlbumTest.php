<?php

namespace Tests\Feature;

use App\Enums\AlbumFormat;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AlbumTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artist = Artist::factory()->create();
        $this->genre = Genre::factory()->create();
    }

    public function test_can_list_albums(): void
    {
        Album::factory()->count(3)->create(['artist_id' => $this->artist->id]);

        $response = $this->getJson('/api/v1/albums');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'albums' => [
                        '*' => ['uuid', 'slug', 'title', 'price', 'artist'],
                    ],
                    'pagination',
                ],
            ]);
    }

    public function test_can_get_single_album(): void
    {
        $album = Album::factory()->create(['artist_id' => $this->artist->id]);
        Inventory::factory()->create(['album_id' => $album->id]);

        $response = $this->getJson("/api/v1/albums/{$album->slug}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['uuid', 'slug', 'title', 'price', 'artist', 'inventory'],
            ])
            ->assertJson([
                'data' => [
                    'slug' => $album->slug,
                    'title' => $album->title,
                ],
            ]);
    }

    public function test_can_get_featured_albums(): void
    {
        Album::factory()->count(2)->create([
            'artist_id' => $this->artist->id,
            'is_featured' => true,
        ]);
        Album::factory()->create([
            'artist_id' => $this->artist->id,
            'is_featured' => false,
        ]);

        $response = $this->getJson('/api/v1/albums/featured');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data.albums'));
    }

    public function test_can_get_albums_on_sale(): void
    {
        Album::factory()->create([
            'artist_id' => $this->artist->id,
            'price' => 20.00,
            'sale_price' => 15.00,
        ]);
        Album::factory()->create([
            'artist_id' => $this->artist->id,
            'price' => 20.00,
            'sale_price' => null,
        ]);

        $response = $this->getJson('/api/v1/albums/on-sale');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.albums'));
    }

    public function test_admin_can_create_album(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->postJson('/api/v1/admin/albums', [
            'artist_id' => $this->artist->id,
            'title' => 'New Album',
            'format' => 'vinyl',
            'price' => 29.99,
            'release_year' => 2024,
            'description' => 'A new punk rock album',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('albums', [
            'title' => 'New Album',
            'artist_id' => $this->artist->id,
        ]);
    }

    public function test_customer_cannot_create_album(): void
    {
        $customer = User::factory()->create();
        $token = $customer->createToken('test-token')->plainTextToken;

        $response = $this->postJson('/api/v1/admin/albums', [
            'artist_id' => $this->artist->id,
            'title' => 'New Album',
            'format' => 'vinyl',
            'price' => 29.99,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_album(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test-token')->plainTextToken;
        $album = Album::factory()->create(['artist_id' => $this->artist->id]);

        $response = $this->putJson("/api/v1/admin/albums/{$album->slug}", [
            'title' => 'Updated Title',
            'price' => 35.00,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('albums', [
            'id' => $album->id,
            'title' => 'Updated Title',
            'price' => 35.00,
        ]);
    }

    public function test_admin_can_delete_album(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test-token')->plainTextToken;
        $album = Album::factory()->create(['artist_id' => $this->artist->id]);

        $response = $this->deleteJson("/api/v1/admin/albums/{$album->slug}", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);

        $this->assertSoftDeleted('albums', ['id' => $album->id]);
    }

    public function test_album_shows_correct_effective_price(): void
    {
        $album = Album::factory()->create([
            'artist_id' => $this->artist->id,
            'price' => 30.00,
            'sale_price' => 20.00,
        ]);

        $this->assertEquals(20.00, $album->getEffectivePrice());
        $this->assertTrue($album->isOnSale());
    }

    public function test_album_without_sale_shows_regular_price(): void
    {
        $album = Album::factory()->create([
            'artist_id' => $this->artist->id,
            'price' => 30.00,
            'sale_price' => null,
        ]);

        $this->assertEquals(30.00, $album->getEffectivePrice());
        $this->assertFalse($album->isOnSale());
    }

    public function test_album_sanitizes_html_in_description(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->postJson('/api/v1/admin/albums', [
            'artist_id' => $this->artist->id,
            'title' => 'Test Album',
            'description' => 'Great album <script>alert("XSS")</script>',
            'format' => 'vinyl',
            'price' => 29.99,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $album = Album::latest()->first();
        $this->assertEquals('Great album', $album->description);
        $this->assertStringNotContainsString('<script>', $album->description);
    }

    public function test_album_sanitizes_html_in_title(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->postJson('/api/v1/admin/albums', [
            'artist_id' => $this->artist->id,
            'title' => 'Punk <b>Rock</b> Album',
            'format' => 'cd',
            'price' => 19.99,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $album = Album::latest()->first();
        $this->assertEquals('Punk Rock Album', $album->title);
        $this->assertStringNotContainsString('<b>', $album->title);
    }
}
