<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $customer;
    protected string $adminToken;
    protected string $customerToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        $this->customer = User::factory()->create();

        $this->adminToken = $this->admin->createToken('admin-token')->plainTextToken;
        $this->customerToken = $this->customer->createToken('customer-token')->plainTextToken;
    }

    public function test_admin_can_access_dashboard_stats(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard/stats', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'users',
                    'catalog',
                    'orders',
                    'revenue',
                    'inventory',
                    'reviews',
                ],
            ]);
    }

    public function test_customer_cannot_access_dashboard_stats(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard/stats', [
            'Authorization' => "Bearer {$this->customerToken}",
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_all_orders(): void
    {
        Order::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/admin/orders', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'orders',
                    'pagination',
                ],
            ]);

        $this->assertCount(5, $response->json('data.orders'));
    }

    public function test_admin_can_filter_orders_by_status(): void
    {
        Order::factory()->count(3)->create(['status' => OrderStatus::PENDING]);
        Order::factory()->count(2)->create(['status' => OrderStatus::SHIPPED]);

        $response = $this->getJson('/api/v1/admin/orders?status=pending', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data.orders'));
    }

    public function test_admin_can_update_order_status(): void
    {
        $order = Order::factory()->create(['status' => OrderStatus::PENDING]);

        $response = $this->putJson("/api/v1/admin/orders/{$order->uuid}/status", [
            'status' => 'processing',
        ], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => OrderStatus::PROCESSING->value,
        ]);
    }

    public function test_admin_can_view_all_users(): void
    {
        User::factory()->count(10)->create();

        $response = $this->getJson('/api/v1/admin/users', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'users',
                    'pagination',
                ],
            ]);
    }

    public function test_admin_can_filter_users_by_role(): void
    {
        User::factory()->count(5)->create(['role' => UserRole::CUSTOMER]);
        User::factory()->count(2)->admin()->create();

        $response = $this->getJson('/api/v1/admin/users?role=customer', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);

        $users = $response->json('data.users');
        foreach ($users as $user) {
            $this->assertEquals('customer', $user['role']);
        }
    }

    public function test_admin_can_view_user_details(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/admin/users/{$user->uuid}", [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user',
                    'stats',
                ],
            ]);
    }

    public function test_admin_can_update_user_role(): void
    {
        $user = User::factory()->create(['role' => UserRole::CUSTOMER]);

        $response = $this->putJson("/api/v1/admin/users/{$user->uuid}/role", [
            'role' => 'admin',
        ], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => UserRole::ADMIN->value,
        ]);
    }

    public function test_admin_cannot_remove_own_admin_role(): void
    {
        $response = $this->putJson("/api/v1/admin/users/{$this->admin->uuid}/role", [
            'role' => 'customer',
        ], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/v1/admin/users/{$user->uuid}", [], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $response = $this->deleteJson("/api/v1/admin/users/{$this->admin->uuid}", [], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_inventory(): void
    {
        $artist = Artist::factory()->create();
        $album = Album::factory()->create(['artist_id' => $artist->id]);
        Inventory::factory()->create(['album_id' => $album->id]);

        $response = $this->getJson('/api/v1/admin/inventory', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'inventory',
                    'pagination',
                ],
            ]);
    }

    public function test_admin_can_update_inventory_stock(): void
    {
        $artist = Artist::factory()->create();
        $album = Album::factory()->create(['artist_id' => $artist->id]);
        $inventory = Inventory::factory()->create([
            'album_id' => $album->id,
            'quantity' => 50,
        ]);

        $response = $this->putJson("/api/v1/admin/inventory/{$album->slug}/stock", [
            'quantity' => 100,
            'low_stock_threshold' => 10,
        ], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inventories', [
            'id' => $inventory->id,
            'quantity' => 100,
            'low_stock_threshold' => 10,
        ]);
    }

    public function test_admin_can_add_stock(): void
    {
        $artist = Artist::factory()->create();
        $album = Album::factory()->create(['artist_id' => $artist->id]);
        $inventory = Inventory::factory()->create([
            'album_id' => $album->id,
            'quantity' => 50,
        ]);

        $response = $this->postJson("/api/v1/admin/inventory/{$album->slug}/add-stock", [
            'quantity' => 25,
        ], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inventories', [
            'id' => $inventory->id,
            'quantity' => 75,
        ]);
    }

    public function test_admin_can_view_low_stock_alerts(): void
    {
        $artist = Artist::factory()->create();
        $album = Album::factory()->create(['artist_id' => $artist->id]);
        Inventory::factory()->create([
            'album_id' => $album->id,
            'quantity' => 3,
            'low_stock_threshold' => 5,
        ]);

        $response = $this->getJson('/api/v1/admin/inventory/low-stock', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'alerts',
                    'count',
                ],
            ]);

        $this->assertEquals(1, $response->json('data.count'));
    }

    public function test_admin_can_view_inventory_statistics(): void
    {
        $response = $this->getJson('/api/v1/admin/inventory/statistics', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_items',
                    'total_reserved',
                    'total_available',
                    'low_stock_count',
                    'out_of_stock_count',
                ],
            ]);
    }
}
