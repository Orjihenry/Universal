<?php

use App\Models\Business;
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
            ->where('stats.productsAvailable', 0)
            ->where('stats.salesPeriod', 'weekly')
            ->has('stats.salesOverview', 7)
            ->where('stats.salesOverview.6.revenue', '0.00')
            ->where('attention.pendingBusinesses.count', 0)
            ->where('attention.unavailableProducts.count', 0)
            ->where('attention.pendingOrders.count', 0));
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
            ->where('stats.productsAvailable', 2)
            ->where('stats.salesPeriod', 'weekly')
            ->where('stats.salesOverview.6.revenue', '24.50')
            ->where('stats.salesOverview.5.revenue', '107.00'));
});

test('the sales overview can switch between weekly monthly quarterly and yearly', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create();

    Order::factory()->recycle($customer)->pending()->create([
        'total' => '20.00',
        'created_at' => now()->subMonths(2)->startOfMonth(),
    ]);
    Order::factory()->recycle($customer)->pending()->create([
        'total' => '35.00',
        'created_at' => now()->subYears(2)->startOfYear(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin-dashboard', ['sales' => 'weekly']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.salesPeriod', 'weekly')
            ->has('stats.salesOverview', 7)
            ->where('stats.salesOverview.0.revenue', '0.00'));

    $this->actingAs($admin)
        ->get(route('admin-dashboard', ['sales' => 'monthly']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.salesPeriod', 'monthly')
            ->where('stats.salesPeriodLabel', 'Last 12 months')
            ->has('stats.salesOverview', 12)
            ->where('stats.salesOverview.9.revenue', '20.00'));

    $this->actingAs($admin)
        ->get(route('admin-dashboard', ['sales' => 'quarterly']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.salesPeriod', 'quarterly')
            ->has('stats.salesOverview', 4));

    $this->actingAs($admin)
        ->get(route('admin-dashboard', ['sales' => 'yearly']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.salesPeriod', 'yearly')
            ->has('stats.salesOverview', 5)
            ->where('stats.salesOverview.2.revenue', '35.00'));

    $this->actingAs($admin)
        ->get(route('admin-dashboard', ['sales' => 'not-a-period']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.salesPeriod', 'weekly')
            ->has('stats.salesOverview', 7));
});

test('the dashboard lists items that need attention', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create();

    $unavailable = Product::factory()->unavailable()->recycle($admin)->create([
        'name' => 'Sold-out rye',
    ]);
    Product::factory()->recycle($admin)->create(['name' => 'Sourdough']);

    $pendingOrder = Order::factory()->recycle($customer)->pending()->create([
        'total' => '12.00',
    ]);
    Order::factory()->recycle($customer)->completed()->create([
        'total' => '9.00',
    ]);

    $pendingBusiness = Business::factory()->recycle($admin)->create([
        'name' => 'Harbor Cafe',
        'created_by' => $admin->id,
    ]);
    Business::factory()->approved($admin)->recycle($admin)->create([
        'name' => 'Approved Bakery',
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin-dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('attention.unavailableProducts.count', 1)
            ->where('attention.unavailableProducts.items.0.title', $unavailable->name)
            ->where('attention.pendingOrders.count', 1)
            ->where('attention.pendingOrders.items.0.id', $pendingOrder->id)
            ->where('attention.pendingOrders.items.0.title', $customer->name)
            ->where('attention.pendingOrders.items.0.meta', '$12.00')
            ->where('attention.pendingBusinesses.count', 1)
            ->where('attention.pendingBusinesses.items.0.title', $pendingBusiness->name));
});
