<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Album $album;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $artist = Artist::factory()->create();
        $this->album = Album::factory()->create(['artist_id' => $artist->id]);
    }

    public function test_review_sanitizes_html_in_body(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        $response = $this->postJson("/api/v1/albums/{$this->album->slug}/reviews", [
            'rating' => 5,
            'title' => 'Great Album',
            'body' => 'Awesome album <script>malicious()</script>',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        $this->assertEquals('Awesome album', $review->body);
        $this->assertStringNotContainsString('<script>', $review->body);
    }

    public function test_review_sanitizes_html_in_title(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        $response = $this->postJson("/api/v1/albums/{$this->album->slug}/reviews", [
            'rating' => 5,
            'title' => 'Great <img src=x onerror=alert(1)>',
            'body' => 'Nice album',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        $this->assertEquals('Great', $review->title);
        $this->assertStringNotContainsString('<img', $review->title);
        $this->assertStringNotContainsString('onerror', $review->title);
    }

    public function test_review_sanitizes_multiple_html_tags(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        $response = $this->postJson("/api/v1/albums/{$this->album->slug}/reviews", [
            'rating' => 4,
            'title' => '<b>Bold</b> <i>Italic</i> Title',
            'body' => '<p>Paragraph with <a href="#">link</a> and <strong>bold</strong> text</p>',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        $this->assertEquals('Bold Italic Title', $review->title);
        $this->assertEquals('Paragraph with link and bold text', $review->body);
    }

    public function test_updated_review_sanitizes_html(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        // First create a review
        $this->postJson("/api/v1/albums/{$this->album->slug}/reviews", [
            'rating' => 5,
            'title' => 'Original Title',
            'body' => 'Original body',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        // Then update it with malicious content
        $response = $this->putJson("/api/v1/albums/{$this->album->slug}/reviews", [
            'title' => 'Updated <script>alert("XSS")</script>',
            'body' => 'Updated <iframe src="evil.com"></iframe>',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);

        $review = Review::latest()->first();
        $this->assertEquals('Updated', $review->title);
        $this->assertEquals('Updated', $review->body);
        $this->assertStringNotContainsString('<script>', $review->title);
        $this->assertStringNotContainsString('<iframe>', $review->body);
    }

    public function test_review_trims_whitespace(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        $response = $this->postJson("/api/v1/albums/{$this->album->slug}/reviews", [
            'rating' => 5,
            'title' => '  Whitespace Title  ',
            'body' => "\n\nBody with newlines\t\t",
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        $this->assertEquals('Whitespace Title', $review->title);
        $this->assertEquals('Body with newlines', $review->body);
    }
}
