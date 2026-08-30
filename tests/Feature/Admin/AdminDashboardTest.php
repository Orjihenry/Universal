<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected from the admin dashboard', function () {
    $this->get(route('admin-dashboard'))
        ->assertRedirect(route('login'));
});

test('regular users cannot view the admin dashboard', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('admin-dashboard'))
        ->assertForbidden();
});

test('admins can view the dashboard with empty overview stats', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin-dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.todaysOrders', 0)
            ->where('stats.todaysRevenue', '0.00')
            ->where('stats.pendingOrders', 0)
            ->where('stats.ordersReadyForPickup', 0)
            ->where('stats.totalCustomers', 0)
            ->where('stats.productsAvailable', 0));
});

test('the dashboard overview reflects current orders customers and products', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create();
    User::factory()->user()->create();

    Order::factory()->recycle($customer)->pending()->create([
        'total' => '10.00',
    ]);
    Order::factory()->recycle($customer)->readyForPickup()->create([
        'total' => '14.50',
    ]);
    Order::factory()->recycle($customer)->cancelled()->create([
        'total' => '5.00',
    ]);
    Order::factory()->recycle($customer)->pending()->create([
        'total' => '99.00',
        'created_at' => now()->subDay(),
    ]);
    Order::factory()->recycle($customer)->readyForPickup()->create([
        'total' => '8.00',
        'created_at' => now()->subDay(),
    ]);

    Product::factory()->recycle($admin)->count(2)->create();
    Product::factory()->unavailable()->recycle($admin)->create();

    $this->actingAs($admin)
        ->get(route('admin-dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.todaysOrders', 3)
            ->where('stats.todaysRevenue', '24.50')
            ->where('stats.pendingOrders', 2)
            ->where('stats.ordersReadyForPickup', 2)
            ->where('stats.totalCustomers', 2)
            ->where('stats.productsAvailable', 2));
});
