<?php

use App\Models\Business;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected from the customers index', function () {
    $this->get(route('admin-users', 'customers'))
        ->assertRedirect(route('login'));
});

test('regular users cannot view the customers index', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('admin-users', 'customers'))
        ->assertForbidden();
});

test('staff cannot view the customers index', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('admin-users', 'customers'))
        ->assertForbidden();
});

test('admins can view the customers index with an empty list', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin-users', 'customers'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('audience', 'customers')
            ->where('audienceLabel', 'Customers')
            ->where('summary.customers', 0)
            ->where('summary.staff', 0)
            ->where('summary.admins', 1)
            ->has('users', 0));
});

test('the customers index lists customers and their businesses', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.test',
    ]);
    User::factory()->staff()->create();
    Business::factory()->recycle($customer)->create([
        'name' => 'Harbor Cafe',
        'created_by' => $customer->id,
    ]);
    Order::factory()->recycle($customer)->create();

    $this->actingAs($admin)
        ->get(route('admin-users', 'customers'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('summary.customers', 1)
            ->where('summary.staff', 1)
            ->where('summary.admins', 1)
            ->has('users', 1)
            ->where('users.0.name', 'Ada Lovelace')
            ->where('users.0.email', 'ada@example.test')
            ->where('users.0.role', 'user')
            ->where('users.0.roleLabel', 'Customer')
            ->where('users.0.businessesCount', 1)
            ->where('users.0.ordersCount', 1));
});

test('the staff index lists only staff', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create([
        'name' => 'Grace Hopper',
    ]);
    User::factory()->user()->create();

    $this->actingAs($admin)
        ->get(route('admin-users', 'staff'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('audience', 'staff')
            ->has('users', 1)
            ->where('users.0.name', $staff->name)
            ->where('users.0.roleLabel', 'Staff'));
});

test('the admins index lists admins and super admins', function () {
    $admin = User::factory()->admin()->create([
        'name' => 'Admin User',
    ]);
    User::factory()->superAdmin()->create([
        'name' => 'Super Admin',
    ]);
    User::factory()->user()->create();
    User::factory()->staff()->create();

    $this->actingAs($admin)
        ->get(route('admin-users', 'admins'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('audience', 'admins')
            ->has('users', 2)
            ->where('summary.admins', 2));
});

test('admins can view a customer and their businesses', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->user()->create([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.test',
        'phone' => '08012345678',
    ]);
    $business = Business::factory()->recycle($customer)->create([
        'name' => 'Harbor Cafe',
        'created_by' => $customer->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin-users.show', ['audience' => 'customers', 'user' => $customer]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/show')
            ->where('audience', 'customers')
            ->where('user.name', 'Ada Lovelace')
            ->where('user.email', 'ada@example.test')
            ->where('user.phone', '08012345678')
            ->where('user.roleLabel', 'Customer')
            ->has('user.businesses', 1)
            ->where('user.businesses.0.name', $business->name));
});

test('a staff member cannot be viewed on the customers show page', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create();

    $this->actingAs($admin)
        ->get(route('admin-users.show', ['audience' => 'customers', 'user' => $staff]))
        ->assertNotFound();
});
