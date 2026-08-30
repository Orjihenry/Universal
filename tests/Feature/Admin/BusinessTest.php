<?php

use App\Enums\BusinessStatus;
use App\Models\Business;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected from the businesses index', function () {
    $this->get(route('admin-businesses'))
        ->assertRedirect(route('login'));
});

test('regular users cannot view the businesses index', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('admin-businesses'))
        ->assertForbidden();
});

test('admins can view the businesses index with an empty summary', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin-businesses'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/businesses/index')
            ->where('summary.total', 0)
            ->where('summary.pending', 0)
            ->where('summary.approved', 0)
            ->where('summary.suspended', 0)
            ->has('businesses', 0));
});

test('the businesses index summary counts total pending approved and suspended', function () {
    $admin = User::factory()->admin()->create();

    Business::factory()->recycle($admin)->create([
        'created_by' => $admin->id,
    ]);
    Business::factory()->approved($admin)->recycle($admin)->create([
        'created_by' => $admin->id,
    ]);
    Business::factory()->approved($admin)->recycle($admin)->create([
        'created_by' => $admin->id,
    ]);
    Business::factory()->suspended()->recycle($admin)->create([
        'created_by' => $admin->id,
    ]);
    Business::factory()->recycle($admin)->create([
        'status' => BusinessStatus::Rejected,
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin-businesses'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/businesses/index')
            ->where('summary.total', 5)
            ->where('summary.pending', 1)
            ->where('summary.approved', 2)
            ->where('summary.suspended', 1)
            ->has('businesses', 2)
            ->where('businesses.0.status', 'approved')
            ->where('businesses.1.status', 'approved'));
});

test('guests are redirected from the business form', function () {
    $this->get(route('admin-businesses.create'))
        ->assertRedirect(route('login'));
});

test('regular users cannot view the business form', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('admin-businesses.create'))
        ->assertForbidden();
});

test('admins can view the create business form', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin-businesses.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/businesses/create')
            ->has('types', 4)
            ->where('types.0.value', 'retail'));
});

test('admins can create a business', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->post(route('admin-businesses.store'), [
            'name' => 'Harbor Cafe',
            'address' => '12 Dock St',
            'phone' => '555-0100',
            'email' => 'hello@harbor.test',
            'website' => 'https://harbor.test',
            'business_type' => 'retail',
            'city' => 'Portland',
            'state' => 'ME',
        ]);

    $business = Business::query()->where('name', 'Harbor Cafe')->first();

    expect($business)->not->toBeNull()
        ->and($business->status)->toBe(BusinessStatus::Approved)
        ->and($business->created_by)->toBe($admin->id)
        ->and($business->approved_by)->toBe($admin->id)
        ->and($business->approved_at)->not->toBeNull();

    $this->assertModelExists($business);

    $response->assertRedirect(route('admin-businesses'));

    $this->actingAs($admin)
        ->get(route('admin-businesses'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/businesses/index')
            ->where('summary.approved', 1)
            ->has('businesses', 1)
            ->where('businesses.0.name', 'Harbor Cafe'));
});

test('business name address phone email type city and state are required', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->from(route('admin-businesses.create'))
        ->post(route('admin-businesses.store'), [])
        ->assertRedirect(route('admin-businesses.create'))
        ->assertSessionHasErrors([
            'name',
            'address',
            'phone',
            'email',
            'business_type',
            'city',
            'state',
        ]);
});

test('admins can view an active business', function () {
    $admin = User::factory()->admin()->create();
    $business = Business::factory()->approved($admin)->recycle($admin)->create([
        'name' => 'Harbor Cafe',
        'email' => 'hello@harbor.test',
        'phone' => '555-0100',
        'business_type' => 'retail',
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin-businesses.show', $business))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/businesses/show')
            ->where('business.name', 'Harbor Cafe')
            ->where('business.email', 'hello@harbor.test')
            ->where('business.phone', '555-0100')
            ->where('business.typeLabel', 'Retail')
            ->where('business.statusLabel', 'Approved'));
});
