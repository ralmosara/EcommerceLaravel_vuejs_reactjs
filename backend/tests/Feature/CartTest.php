<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Coupon;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artist = Artist::factory()->create();
        $this->album = Album::factory()->create(['artist_id' => $this->artist->id, 'price' => 20.00]);
        $this->inventory = Inventory::factory()->create([
            'album_id' => $this->album->id,
            'quantity' => 100,
        ]);
    }

    public function test_can_add_item_to_cart(): void
    {
        $response = $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 2,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['items', 'subtotal', 'total'],
            ]);

        $this->assertEquals(2, $response->json('data.items.0.quantity'));
    }

    public function test_cannot_add_out_of_stock_item(): void
    {
        $this->inventory->update(['quantity' => 0]);

        $response = $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_cannot_add_more_than_available_stock(): void
    {
        $this->inventory->update(['quantity' => 5]);

        $response = $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 10,
        ]);

        $response->assertStatus(422);
    }

    public function test_can_update_cart_item_quantity(): void
    {
        // Add item first
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 2,
        ]);

        // Update quantity
        $response = $this->putJson("/api/v1/cart/items/{$this->album->id}", [
            'quantity' => 3,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(3, $response->json('data.items.0.quantity'));
    }

    public function test_can_remove_item_from_cart(): void
    {
        // Add item first
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 2,
        ]);

        // Remove item
        $response = $this->deleteJson("/api/v1/cart/items/{$this->album->id}");

        $response->assertStatus(200);
        $this->assertEmpty($response->json('data.items'));
    }

    public function test_can_clear_cart(): void
    {
        // Add items
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 2,
        ]);

        // Clear cart
        $response = $this->deleteJson('/api/v1/cart');

        $response->assertStatus(200);
        $this->assertEmpty($response->json('data.items'));
    }

    public function test_can_apply_valid_coupon(): void
    {
        $coupon = Coupon::factory()->create([
            'code' => 'SAVE10',
            'type' => 'percentage',
            'value' => 10,
        ]);

        // Add item to cart
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 1,
        ]);

        // Apply coupon
        $response = $this->postJson('/api/v1/cart/coupon', [
            'code' => 'SAVE10',
        ]);

        $response->assertStatus(200);
        $this->assertEquals(2.00, $response->json('data.discount_amount')); // 10% of 20.00
        $this->assertEquals(18.00, $response->json('data.total')); // 20.00 - 2.00
    }

    public function test_cannot_apply_invalid_coupon(): void
    {
        // Add item to cart
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 1,
        ]);

        // Try to apply invalid coupon
        $response = $this->postJson('/api/v1/cart/coupon', [
            'code' => 'INVALID',
        ]);

        $response->assertStatus(404);
    }

    public function test_cannot_apply_expired_coupon(): void
    {
        $coupon = Coupon::factory()->create([
            'code' => 'EXPIRED',
            'type' => 'percentage',
            'value' => 10,
            'valid_until' => now()->subDay(),
        ]);

        // Add item to cart
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 1,
        ]);

        // Try to apply expired coupon
        $response = $this->postJson('/api/v1/cart/coupon', [
            'code' => 'EXPIRED',
        ]);

        $response->assertStatus(422);
    }

    public function test_can_remove_coupon(): void
    {
        $coupon = Coupon::factory()->create([
            'code' => 'SAVE10',
            'type' => 'percentage',
            'value' => 10,
        ]);

        // Add item and apply coupon
        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 1,
        ]);
        $this->postJson('/api/v1/cart/coupon', ['code' => 'SAVE10']);

        // Remove coupon
        $response = $this->deleteJson('/api/v1/cart/coupon');

        $response->assertStatus(200);
        $this->assertNull($response->json('data.coupon'));
        $this->assertEquals(0, $response->json('data.discount_amount'));
    }

    public function test_cart_calculates_total_correctly(): void
    {
        $album2 = Album::factory()->create(['artist_id' => $this->artist->id, 'price' => 15.00]);
        Inventory::factory()->create(['album_id' => $album2->id, 'quantity' => 100]);

        $this->postJson('/api/v1/cart/items', [
            'album_id' => $this->album->id,
            'quantity' => 2,
        ]);
        $response = $this->postJson('/api/v1/cart/items', [
            'album_id' => $album2->id,
            'quantity' => 1,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(55.00, $response->json('data.subtotal')); // (20 * 2) + (15 * 1)
    }
}
