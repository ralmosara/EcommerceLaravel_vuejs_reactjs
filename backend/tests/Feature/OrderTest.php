<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Address;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Album $album;
    protected Cart $cart;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $artist = Artist::factory()->create();
        $this->album = Album::factory()->create([
            'artist_id' => $artist->id,
            'price' => 20.00,
        ]);
        Inventory::factory()->create([
            'album_id' => $this->album->id,
            'quantity' => 100,
        ]);

        // Create cart with items
        $this->cart = Cart::factory()->create(['user_id' => $this->user->id]);
        CartItem::create([
            'cart_id' => $this->cart->id,
            'album_id' => $this->album->id,
            'quantity' => 2,
            'price' => 20.00,
        ]);

        // Create addresses
        Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default_shipping' => true,
        ]);
        Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default_billing' => true,
        ]);
    }

    public function test_authenticated_user_can_create_order(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->postJson('/api/v1/orders', [
            'shipping_address_id' => $this->user->addresses()->where('is_default_shipping', true)->first()->id,
            'billing_address_id' => $this->user->addresses()->where('is_default_billing', true)->first()->id,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => ['uuid', 'order_number', 'status', 'total'],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'status' => OrderStatus::PENDING->value,
        ]);
    }

    public function test_creating_order_reserves_inventory(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $inventory = $this->album->inventory;
        $initialQuantity = $inventory->quantity;
        $initialReserved = $inventory->reserved_quantity;

        $this->postJson('/api/v1/orders', [
            'shipping_address_id' => $this->user->addresses()->where('is_default_shipping', true)->first()->id,
            'billing_address_id' => $this->user->addresses()->where('is_default_billing', true)->first()->id,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $inventory->refresh();
        $this->assertEquals($initialReserved + 2, $inventory->reserved_quantity);
    }

    public function test_user_can_view_their_orders(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        Order::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/orders', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'orders' => [
                        '*' => ['uuid', 'order_number', 'status', 'total'],
                    ],
                ],
            ]);

        $this->assertCount(3, $response->json('data.orders'));
    }

    public function test_user_can_view_single_order(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $order = Order::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/orders/{$order->uuid}", [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'uuid' => $order->uuid,
                    'order_number' => $order->order_number,
                ],
            ]);
    }

    public function test_user_cannot_view_other_users_order(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $otherUser = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/v1/orders/{$order->uuid}", [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_cancel_pending_order(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $response = $this->postJson("/api/v1/orders/{$order->uuid}/cancel", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => OrderStatus::CANCELLED->value,
        ]);
    }

    public function test_user_cannot_cancel_shipped_order(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status' => OrderStatus::SHIPPED,
        ]);

        $response = $this->postJson("/api/v1/orders/{$order->uuid}/cancel", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(422);
    }

    public function test_order_number_is_generated_correctly(): void
    {
        $order = Order::factory()->create();

        $this->assertStringStartsWith('PUNK-', $order->order_number);
        $this->assertMatchesRegularExpression('/^PUNK-\d{8}-\d{4}$/', $order->order_number);
    }

    public function test_cannot_create_order_with_empty_cart(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $this->cart->items()->delete();

        $response = $this->postJson('/api/v1/orders', [
            'shipping_address_id' => $this->user->addresses()->where('is_default_shipping', true)->first()->id,
            'billing_address_id' => $this->user->addresses()->where('is_default_billing', true)->first()->id,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(422);
    }

    public function test_cannot_create_order_with_insufficient_stock(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;
        $this->album->inventory->update(['quantity' => 1]);

        $response = $this->postJson('/api/v1/orders', [
            'shipping_address_id' => $this->user->addresses()->where('is_default_shipping', true)->first()->id,
            'billing_address_id' => $this->user->addresses()->where('is_default_billing', true)->first()->id,
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(422);
    }
}
