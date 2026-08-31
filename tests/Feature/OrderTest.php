<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected from the orders index', function () {
    $this->get(route('orders'))
        ->assertRedirect(route('login'));
});

test('authenticated customers can view their orders index when empty', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/index')
            ->where('summary.total', 0)
            ->where('summary.pending', 0)
            ->where('summary.readyForPickup', 0)
            ->where('summary.completed', 0)
            ->has('orders', 0));
});

test('customers only see their own orders on the index', function () {
    $customer = User::factory()->user()->create();
    $other = User::factory()->user()->create();

    Order::factory()->recycle($customer)->pending()->placedOn(now()->subDays(2))->create(['total' => '10.00']);
    Order::factory()->recycle($customer)->readyForPickup()->placedOn(now()->subDay())->create(['total' => '14.50']);
    Order::factory()->recycle($customer)->completed()->placedOn(now())->create(['total' => '22.00']);
    Order::factory()->recycle($other)->pending()->create(['total' => '99.00']);

    $this->actingAs($customer)
        ->get(route('orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/index')
            ->where('summary.total', 3)
            ->where('summary.pending', 1)
            ->where('summary.readyForPickup', 1)
            ->where('summary.completed', 1)
            ->has('orders', 3)
            ->where('orders.0.total', '22.00')
            ->missing('orders.0.customerName')
            ->where('orders.0.status', 'completed'));
});

test('guests are redirected from an order show page', function () {
    $customer = User::factory()->user()->create();
    $order = Order::factory()->recycle($customer)->create();

    $this->get(route('orders.show', $order))
        ->assertRedirect(route('login'));
});

test('customers can view their own order', function () {
    $customer = User::factory()->user()->create();
    $order = Order::factory()->recycle($customer)->readyForPickup()->create([
        'total' => '14.50',
    ]);

    $this->actingAs($customer)
        ->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/show')
            ->where('order.id', $order->id)
            ->where('order.total', '14.50')
            ->where('order.status', 'ready_for_pickup')
            ->where('order.statusLabel', 'Ready For Pickup')
            ->missing('order.customerEmail'));
});

test('customers cannot view another customers order', function () {
    $customer = User::factory()->user()->create();
    $other = User::factory()->user()->create();
    $order = Order::factory()->recycle($other)->create();

    $this->actingAs($customer)
        ->get(route('orders.show', $order))
        ->assertForbidden();
});
