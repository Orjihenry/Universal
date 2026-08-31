<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected from the orders index', function () {
    $this->get(route('admin-orders'))
        ->assertRedirect(route('login'));
});

test('regular users cannot view the orders index', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('admin-orders'))
        ->assertForbidden();
});

test('admins can view the orders index with an empty summary', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin-orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->where('summary.total', 0)
            ->where('summary.pending', 0)
            ->where('summary.readyForPickup', 0)
            ->where('summary.completed', 0)
            ->has('orders', 0));
});

test('the orders index summary counts total pending ready and completed', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.test',
    ]);

    Order::factory()->recycle($customer)->pending()->create(['total' => '10.00']);
    Order::factory()->recycle($customer)->readyForPickup()->create(['total' => '14.50']);
    Order::factory()->recycle($customer)->completed()->create(['total' => '22.00']);
    Order::factory()->recycle($customer)->cancelled()->create(['total' => '5.00']);

    $this->actingAs($admin)
        ->get(route('admin-orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->where('summary.total', 4)
            ->where('summary.pending', 1)
            ->where('summary.readyForPickup', 1)
            ->where('summary.completed', 1)
            ->has('orders', 4)
            ->where('orders.0.customerName', 'Ada Lovelace')
            ->where('orders.0.customerEmail', 'ada@example.test'));
});

test('admins can view an order', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.test',
    ]);
    $order = Order::factory()->recycle($customer)->readyForPickup()->create([
        'total' => '14.50',
    ]);

    $this->actingAs($admin)
        ->get(route('admin-orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.id', $order->id)
            ->where('order.customerName', 'Ada Lovelace')
            ->where('order.customerEmail', 'ada@example.test')
            ->where('order.total', '14.50')
            ->where('order.status', 'ready_for_pickup')
            ->where('order.statusLabel', 'Ready For Pickup'));
});
