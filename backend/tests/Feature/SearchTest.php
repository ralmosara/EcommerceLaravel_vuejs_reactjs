<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\Artist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $ramones = Artist::create([
            'name' => 'The Ramones',
            'bio' => 'American punk rock band',
            'formed_year' => 1974,
            'origin' => 'New York City, USA',
        ]);

        $clash = Artist::create([
            'name' => 'The Clash',
            'bio' => 'English punk rock band',
            'formed_year' => 1976,
            'origin' => 'London, England',
        ]);

        Album::create([
            'artist_id' => $ramones->id,
            'title' => 'Ramones',
            'description' => 'Debut album',
            'format' => 'vinyl',
            'price' => 29.99,
            'release_year' => 1976,
        ]);

        Album::create([
            'artist_id' => $clash->id,
            'title' => 'London Calling',
            'description' => 'Third studio album',
            'format' => 'vinyl',
            'price' => 39.99,
            'release_year' => 1979,
        ]);
    }

    public function test_can_search_all_content(): void
    {
        $response = $this->getJson('/api/v1/search?q=punk');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'artists',
                    'albums',
                ],
            ]);
    }

    public function test_can_search_artists_only(): void
    {
        $response = $this->getJson('/api/v1/search?q=Ramones&type=artists');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'artists',
                ],
            ])
            ->assertJsonMissing(['albums']);

        $this->assertNotEmpty($response->json('data.artists'));
    }

    public function test_can_search_albums_only(): void
    {
        $response = $this->getJson('/api/v1/search?q=London&type=albums');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'albums',
                ],
            ])
            ->assertJsonMissing(['artists']);

        $this->assertNotEmpty($response->json('data.albums'));
    }

    public function test_search_requires_minimum_query_length(): void
    {
        $response = $this->getJson('/api/v1/search?q=a');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['q']);
    }

    public function test_can_get_search_suggestions(): void
    {
        $response = $this->getJson('/api/v1/search/suggestions?q=Ram');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'suggestions' => [
                        '*' => ['type', 'slug', 'name'],
                    ],
                ],
            ]);
    }

    public function test_search_suggestions_include_both_artists_and_albums(): void
    {
        $response = $this->getJson('/api/v1/search/suggestions?q=punk');

        $response->assertStatus(200);

        $suggestions = $response->json('data.suggestions');
        $types = array_column($suggestions, 'type');

        // Should have both artist and album suggestions
        $this->assertContains('artist', $types);
        $this->assertContains('album', $types);
    }

    public function test_can_search_artists_with_pagination(): void
    {
        // Create more artists
        Artist::factory()->count(15)->create();

        $response = $this->getJson('/api/v1/search/artists?q=punk&per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'artists',
                    'pagination' => ['current_page', 'per_page', 'total', 'last_page'],
                ],
            ]);

        $this->assertEquals(10, $response->json('data.pagination.per_page'));
    }

    public function test_can_search_albums_with_filters(): void
    {
        $response = $this->getJson('/api/v1/search/albums?q=album&format=vinyl&min_price=30');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'albums',
                    'pagination',
                ],
            ]);

        // All results should be vinyl and price >= 30
        $albums = $response->json('data.albums');
        foreach ($albums as $album) {
            $this->assertEquals('vinyl', $album['format']);
            $this->assertGreaterThanOrEqual(30, $album['price']);
        }
    }

    public function test_search_returns_empty_results_for_no_matches(): void
    {
        $response = $this->getJson('/api/v1/search?q=nonexistentbandname123');

        $response->assertStatus(200);
        $this->assertEmpty($response->json('data.artists'));
        $this->assertEmpty($response->json('data.albums'));
    }
}
